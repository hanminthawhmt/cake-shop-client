import React from 'react'
import type { OrderStatus, PaymentStatus } from '../../../types/orders'
import { CheckCircle2, Clock, PackageCheck, Sparkles, XCircle, DollarSign } from 'lucide-react'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'confirmed':
      return (
        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-sky-600" />
          Confirmed
        </span>
      )
    case 'preparing':
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
          Preparing
        </span>
      )
    case 'ready_for_pick_up':
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
          Ready for Pickup
        </span>
      )
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
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

export const PaymentStatusBadge: React.FC<{ paymentStatus: PaymentStatus }> = ({
  paymentStatus,
}) => {
  if (paymentStatus === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
        <DollarSign className="w-3 h-3 text-emerald-600" />
        Paid
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      <Clock className="w-3 h-3 text-amber-600" />
      Pay at Storefront
    </span>
  )
}
