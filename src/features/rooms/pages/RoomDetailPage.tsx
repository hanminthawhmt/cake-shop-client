import React, { useState, useMemo } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRoomById, fetchRoomAvailability, createReservation } from '../../../api/rooms'
import { useAuth } from '../../../context/AuthContext'
import type { Reservation } from '../../../types/room'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { AuthPromptModal } from '../../cakes/components/AuthPromptModal'
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Users,
  Clock,
  Check,
  Sparkles,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react'

const FALLBACK_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1000&q=80',
]

export const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const roomId = Number(id)
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  // Default date: tomorrow
  const defaultDateStr = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }, [])

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr)
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [guestCount, setGuestCount] = useState<number>(4)
  const [requirements, setRequirements] = useState<string>('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Fetch Room Info
  const {
    data: room,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => fetchRoomById(roomId),
    enabled: !isNaN(roomId),
  })

  // Fetch Availability for selected date
  const {
    data: availability = [],
    isLoading: isAvailLoading,
  } = useQuery({
    queryKey: ['roomAvailability', roomId, selectedDate],
    queryFn: () => fetchRoomAvailability(roomId, selectedDate),
    enabled: !isNaN(roomId) && Boolean(selectedDate),
  })

  // Create Reservation Mutation
  const reserveMutation = useMutation({
    mutationFn: (payload: {
      date: string
      timeSlot: string
      guestCount: number
      birthdayRequirements?: string
    }) => createReservation(roomId, payload),
    onSuccess: (newRes) => {
      queryClient.invalidateQueries({ queryKey: ['roomAvailability', roomId, selectedDate] })
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      setConfirmedReservation(newRes)
      setErrorMsg(null)
    },
    onError: (err: any) => {
      console.error('Reservation error:', err)
      const text =
        err?.response?.data?.message ||
        'Failed to create reservation. The selected time slot may no longer be available.'
      setErrorMsg(Array.isArray(text) ? text.join(', ') : text)
    },
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!isLoggedIn) {
      setShowAuthModal(true)
      return
    }

    if (!selectedSlot) {
      setErrorMsg('Please select an available time slot.')
      return
    }

    reserveMutation.mutate({
      date: selectedDate,
      timeSlot: selectedSlot,
      guestCount,
      birthdayRequirements: requirements.trim() !== '' ? requirements.trim() : undefined,
    })
  }

  const imageUrl =
    room && room.images && room.images.length > 0
      ? room.images[0].url
      : FALLBACK_ROOM_IMAGES[roomId % FALLBACK_ROOM_IMAGES.length]

  const formattedPrice =
    room && typeof room.price === 'number'
      ? room.price.toFixed(2)
      : parseFloat(String(room?.price || 0)).toFixed(2)

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6057] hover:text-[#D86A78] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Birthday Rooms</span>
        </Link>

        {/* Loading Skeleton */}
        {isRoomLoading && (
          <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[16/10] bg-gray-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-md w-1/2" />
              <div className="h-4 bg-gray-200 rounded-md w-full" />
              <div className="h-24 bg-gray-200 rounded-2xl w-full" />
            </div>
          </div>
        )}

        {/* Error State */}
        {isRoomError && (
          <div className="bg-white rounded-3xl p-10 border border-red-200 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-900 mb-1">Room Not Found</h2>
            <p className="text-xs text-red-700 mb-6">
              The requested birthday room could not be loaded.
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold"
            >
              Browse Available Rooms
            </Link>
          </div>
        )}

        {/* Active Room Detail Layout */}
        {!isRoomLoading && room && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Room Photo & Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-[#FAF2F0] border border-[#F4E6E4] shadow-xs">
                <img
                  src={imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#6E3C33] border border-[#F3D5CF] flex items-center gap-1.5 shadow-xs">
                  <Users className="w-3.5 h-3.5 text-[#D86A78]" />
                  Up to {room.capacity} Guests
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#3B2219]">
                    {room.name}
                  </h1>
                  <div className="text-right">
                    <span className="text-[11px] text-[#9E7A70] block font-semibold">Rate</span>
                    <span className="text-xl font-black text-[#4A2E2B]">${formattedPrice}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed">
                  {room.description ||
                    'Enjoy an exclusive private space decorated for tea parties, birthday celebrations, and cake sharing.'}
                </p>

                <div className="pt-4 border-t border-[#F7EFEF] flex items-center gap-3 text-xs text-[#8C6057]">
                  <span className="inline-flex items-center gap-1 bg-[#FAF2F0] px-3 py-1 rounded-full border border-[#F3E2E0]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D86A78]" />
                    Private Decor Included
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Reservation Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-6">
              <h2 className="text-xl font-black text-[#3B2219] border-b border-[#F7EFEF] pb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#D86A78]" />
                <span>Reserve Birthday Room</span>
              </h2>

              {/* Error Banner */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6E4E46] block">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value)
                      setSelectedSlot('')
                    }}
                    className="w-full p-3.5 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-sm font-bold text-[#3B2219] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                  />
                </div>

                {/* Time Slots Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6E4E46] block flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D86A78]" />
                      <span>Select Fixed Time Slot</span>
                    </span>
                    {isAvailLoading && <span className="text-[11px] text-[#A88C85]">Checking...</span>}
                  </label>

                  <div className="grid grid-cols-3 gap-2.5">
                    {availability.map((slot) => {
                      const isSelected = selectedSlot === slot.timeSlot
                      const isDisabled = !slot.isAvailable

                      return (
                        <button
                          key={slot.timeSlot}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setSelectedSlot(slot.timeSlot)}
                          className={`p-3 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                            isDisabled
                              ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-[#D86A78] text-white shadow-md shadow-[#D86A78]/20 ring-2 ring-[#D86A78]/30 cursor-pointer'
                              : 'bg-[#FAF7F5] text-[#5C3F37] border border-[#EFE2E0] hover:bg-[#FDF6F7] hover:border-[#F3D1D5] cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {isDisabled ? (
                              <Lock className="w-3 h-3 text-gray-400" />
                            ) : isSelected ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : null}
                            <span>{slot.timeSlot}</span>
                          </div>
                          <span className="text-[10px] font-normal">
                            {isDisabled ? 'Booked' : 'Available'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Guest Count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6E4E46] block">
                    Number of Guests (Max {room.capacity})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={room.capacity}
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-3.5 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-sm font-bold text-[#3B2219] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                  />
                </div>

                {/* Birthday Requirements Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6E4E46] block flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D86A78]" />
                    <span>Birthday Requirements / Special Decor Notes</span>
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g. Birthday banner for 'Emma turning 10', pink tablecloth, candle setup..."
                    className="w-full p-3 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                  />
                </div>

                {/* Logged Out Info Callout */}
                {!isLoggedIn && (
                  <div className="bg-[#FFF5F6] border border-[#F3D1D5] text-[#8C4A52] p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3">
                    <span>Sign in required to reserve rooms.</span>
                    <Link
                      to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                      className="text-xs font-bold text-[#D86A78] underline hover:text-[#B54A57]"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={reserveMutation.isPending}
                  className="w-full py-4 px-6 bg-[#4A2E2B] hover:bg-[#38221E] disabled:bg-gray-300 text-white rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <CalendarIcon className="w-5 h-5 text-[#E87A84]" />
                  <span>{reserveMutation.isPending ? 'Submitting Reservation...' : 'Reserve Room'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        cakeName={room?.name || 'Birthday Room'}
        returnPath={location.pathname}
      />

      {/* Reservation Confirmation Modal */}
      {confirmedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#F4E6E4] shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Reservation #{confirmedReservation.id} — {confirmedReservation.status.toUpperCase()}
              </span>
              <h2 className="text-2xl font-black text-[#3B2219]">Room Reserved!</h2>
              <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed">
                Your reservation for <strong className="text-[#3B2219]">{room?.name}</strong> has been submitted.
              </p>
            </div>

            <div className="bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl p-4 space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-[#8C6057]">Date:</span>
                <span className="font-bold text-[#3B2219]">{confirmedReservation.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C6057]">Time Slot:</span>
                <span className="font-bold text-[#3B2219]">{confirmedReservation.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C6057]">Guests:</span>
                <span className="font-bold text-[#3B2219]">{confirmedReservation.guestCount} guests</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmedReservation(null)
                  navigate('/reservations')
                }}
                className="w-full py-3.5 px-4 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <span>View My Reservations</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
