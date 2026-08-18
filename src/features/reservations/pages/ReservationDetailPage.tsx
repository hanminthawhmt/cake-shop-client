import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchReservationById, cancelReservation } from '../../../api/reservations'
import { fetchRoomById } from '../../../api/rooms'
import { useAuth } from '../../../context/AuthContext'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { ReservationStatusBadge } from '../components/ReservationCard'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export const ReservationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const reservationId = Number(id)
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Fetch Reservation detail
  const {
    data: reservation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => fetchReservationById(reservationId),
    enabled: isLoggedIn && !isNaN(reservationId),
  })

  // Fetch Room Info
  const { data: room } = useQuery({
    queryKey: ['room', reservation?.roomId],
    queryFn: () => fetchRoomById(reservation!.roomId),
    enabled: Boolean(reservation?.roomId),
  })

  // Cancel Reservation Mutation
  const cancelMutation = useMutation({
    mutationFn: (idToCancel: number) => cancelReservation(idToCancel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      queryClient.invalidateQueries({ queryKey: ['reservation', reservationId] })
      setSuccessMsg(`Reservation #${reservationId} has been successfully cancelled.`)
      setErrorMsg(null)
    },
    onError: (err: any) => {
      console.error('Failed to cancel reservation:', err)
      const text =
        err?.response?.data?.message ||
        'Failed to cancel reservation. Please check status or try again later.'
      setErrorMsg(Array.isArray(text) ? text.join(', ') : text)
      setSuccessMsg(null)
    },
  })

  const handleCancelClick = () => {
    if (!reservation) return
    const confirmed = window.confirm(
      `Are you sure you want to cancel Reservation #${reservation.id}?`
    )
    if (confirmed) {
      cancelMutation.mutate(reservation.id)
    }
  }

  const isCancellable =
    reservation &&
    reservation.status !== 'completed' &&
    reservation.status !== 'cancelled'

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <Link
          to="/reservations"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6057] hover:text-[#D86A78] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to My Reservations</span>
        </Link>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-md w-1/3" />
            <div className="h-20 bg-gray-200 rounded-2xl w-full" />
            <div className="h-32 bg-gray-200 rounded-2xl w-full" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-3xl p-10 border border-red-200 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-900 mb-1">Reservation Not Found</h2>
            <p className="text-xs text-red-700 mb-6">
              The requested room reservation could not be found.
            </p>
            <Link
              to="/reservations"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold"
            >
              View My Reservations
            </Link>
          </div>
        )}

        {/* Reservation Detail Display */}
        {!isLoading && reservation && (
          <div className="space-y-6">
            {/* Header Banner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#3B2219]">
                    Reservation #{reservation.id}
                  </h1>
                  <ReservationStatusBadge status={reservation.status} />
                </div>
                <p className="text-xs text-[#8C6057]">
                  {room?.name ? `${room.name} — ` : ''}Booked on {new Date(reservation.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Cancel Action */}
              {isCancellable && (
                <button
                  type="button"
                  onClick={handleCancelClick}
                  disabled={cancelMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{cancelMutation.isPending ? 'Cancelling...' : 'Cancel Reservation'}</span>
                </button>
              )}
            </div>

            {/* Notification Banners */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-3 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Reservation Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-6">
              <h3 className="text-lg font-black text-[#3B2219] border-b border-[#F7EFEF] pb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D86A78]" />
                <span>Room Schedule & Booking Info</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF7F5] p-5 rounded-2xl border border-[#F3E2E0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#D86A78] flex items-center justify-center shadow-2xs shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#9E7A70] font-semibold block">Reserved Date</span>
                    <span className="text-sm font-extrabold text-[#3B2219]">{reservation.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#D86A78] flex items-center justify-center shadow-2xs shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#9E7A70] font-semibold block">Time Slot</span>
                    <span className="text-sm font-extrabold text-[#3B2219]">{reservation.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#D86A78] flex items-center justify-center shadow-2xs shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#9E7A70] font-semibold block">Guest Count</span>
                    <span className="text-sm font-extrabold text-[#3B2219]">{reservation.guestCount} guests</span>
                  </div>
                </div>
              </div>

              {/* Birthday Requirements / Notes */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-extrabold text-[#6E4E46] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#D86A78]" />
                  <span>Birthday Requirements & Special Notes</span>
                </h4>
                <div className="p-4 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] leading-relaxed">
                  {reservation.birthdayRequirements || 'No special requirements specified for this reservation.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
