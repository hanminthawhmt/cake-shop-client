import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchReservations, cancelReservation } from '../../../api/reservations'
import { useAuth } from '../../../context/AuthContext'
import type { ReservationStatus } from '../../../types/room'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  AlertCircle,
  XCircle,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react'

export const ReservationListPage: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => fetchReservations(),
    enabled: isLoggedIn,
  })

  // Cancel Reservation Mutation
  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
      setSuccessMsg('Reservation cancelled successfully.')
      setErrorMsg(null)
    },
    onError: (err: any) => {
      console.error('Failed to cancel reservation:', err)
      const text =
        err?.response?.data?.message ||
        'Failed to cancel reservation. Please try again later.'
      setErrorMsg(Array.isArray(text) ? text.join(', ') : text)
      setSuccessMsg(null)
    },
  })

  const handleCancel = (id: number) => {
    const confirmed = window.confirm(`Are you sure you want to cancel Reservation #${id}?`)
    if (confirmed) {
      cancelMutation.mutate(id)
    }
  }

  const renderStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Pending Approval
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold px-3 py-1 rounded-full">
            {status}
          </span>
        )
    }
  }

  // Sort reservations newest first
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FDF0F2] text-[#D86A78] text-xs font-bold px-3 py-1 rounded-full border border-[#F6DADC] mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Customer Room Reservations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3B2219]">
            My Birthday Room Reservations
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#7C5C54]">
            View details and manage status for your private birthday room bookings.
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-3 font-semibold mb-6">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-[#F4E6E4] h-28" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-900 mb-1">
              Unable to Load Reservations
            </h3>
            <p className="text-xs text-red-700">
              Please check your login session and try again.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!isLoggedIn || sortedReservations.length === 0) && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#F4E6E4] text-center max-w-lg mx-auto my-8 shadow-xs space-y-5">
            <div className="w-20 h-20 bg-[#FDF0F2] rounded-full flex items-center justify-center mx-auto text-[#D86A78] shadow-2xs">
              <Calendar className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#3B2219]">No Reservations Found</h2>
              <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed max-w-md mx-auto">
                {!isLoggedIn
                  ? 'Please sign in to view your birthday room reservations.'
                  : 'You haven’t reserved any birthday tea rooms yet. Browse our available spaces to host your next party!'}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#E87A84]" />
                <span>Browse Birthday Rooms</span>
              </Link>
            </div>
          </div>
        )}

        {/* Reservations List */}
        {!isLoading && isLoggedIn && sortedReservations.length > 0 && (
          <div className="space-y-4">
            {sortedReservations.map((res) => {
              const isCancellable = res.status !== 'completed' && res.status !== 'cancelled'

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F4E6E4] shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7EFEF] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-extrabold text-base sm:text-lg text-[#3B2219]">
                          Reservation #{res.id}
                        </h3>
                        {renderStatusBadge(res.status)}
                      </div>
                      <span className="text-xs font-semibold text-[#8C6057]">
                        Room #{res.roomId}
                      </span>
                    </div>

                    {isCancellable && (
                      <button
                        type="button"
                        onClick={() => handleCancel(res.id)}
                        disabled={cancelMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cancel Reservation</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#7C5C54]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D86A78]" />
                      <span>Date: <strong className="text-[#3B2219]">{res.date}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D86A78]" />
                      <span>Slot: <strong className="text-[#3B2219]">{res.timeSlot}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D86A78]" />
                      <span>Guests: <strong className="text-[#3B2219]">{res.guestCount} guests</strong></span>
                    </div>
                  </div>

                  {res.birthdayRequirements && (
                    <div className="bg-[#FAF7F5] border border-[#EFE2E0] p-3 rounded-2xl text-xs text-[#8C6057] flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#D86A78] shrink-0" />
                      <span>"{res.birthdayRequirements}"</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
