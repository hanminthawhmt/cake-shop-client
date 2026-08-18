import React from 'react'
import { Link } from 'react-router-dom'
import type { Reservation, ReservationStatus } from '../../../types/room'
import { Calendar, Clock, Users, ArrowRight, XCircle, CheckCircle2, Sparkles } from 'lucide-react'

interface ReservationCardProps {
  reservation: Reservation
  onCancel?: (id: number) => void
  isCancelling?: boolean
}

export const ReservationStatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
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

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  isCancelling = false,
}) => {
  const isCancellable =
    reservation.status !== 'completed' && reservation.status !== 'cancelled'

  const createdDate = new Date(reservation.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="group bg-white rounded-3xl p-5 sm:p-6 border border-[#F4E6E4] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transform hover:-translate-y-0.5">
      <div className="space-y-3 flex-1 min-w-0">
        {/* Header Info */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to={`/reservations/${reservation.id}`}
            className="font-black text-base sm:text-lg text-[#3B2219] hover:text-[#D86A78] transition-colors"
          >
            Reservation #{reservation.id}
          </Link>
          <ReservationStatusBadge status={reservation.status} />
        </div>

        {/* Schedule & Guest Details */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-[#7C5C54]">
          <div className="flex items-center gap-1.5 font-semibold text-[#3B2219]">
            <Calendar className="w-3.5 h-3.5 text-[#D86A78]" />
            <span>Date: {reservation.date}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#8C6057]">
            <Clock className="w-3.5 h-3.5 text-[#D86A78]" />
            <span>Slot: {reservation.timeSlot}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#8C6057]">
            <Users className="w-3.5 h-3.5 text-[#D86A78]" />
            <span>{reservation.guestCount} Guests</span>
          </div>

          <div className="text-[11px] text-[#A88C85]">
            Booked on {createdDate}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F7EFEF] shrink-0">
        {isCancellable && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(reservation.id)}
            disabled={isCancelling}
            className="px-3.5 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Cancel</span>
          </button>
        )}

        <Link
          to={`/reservations/${reservation.id}`}
          className="flex items-center gap-1.5 text-xs font-extrabold text-[#D86A78] bg-[#FDF0F2] px-3.5 py-2 rounded-2xl hover:bg-[#FCE2E6] transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
