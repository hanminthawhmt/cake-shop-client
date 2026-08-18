import React from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../../../types/orders'
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

interface OrderCardProps {
  order: Order
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const formattedPrice =
    typeof order.totalPrice === 'number'
      ? order.totalPrice.toFixed(2)
      : parseFloat(String(order.totalPrice || 0)).toFixed(2)

  const createdDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      to={`/orders/${order.id}`}
      className="group bg-white rounded-3xl p-5 sm:p-6 border border-[#F4E6E4] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transform hover:-translate-y-0.5"
    >
      <div className="space-y-3">
        {/* Order Header Info */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-black text-base sm:text-lg text-[#3B2219] group-hover:text-[#D86A78] transition-colors">
            Order #{order.id}
          </span>
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge paymentStatus={order.paymentStatus} />
        </div>

        {/* Pickup & Placed Meta */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-[#7C5C54]">
          <div className="flex items-center gap-1.5 font-semibold text-[#3B2219]">
            <Calendar className="w-3.5 h-3.5 text-[#D86A78]" />
            <span>Pickup: {order.pickupDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#8C6057]">
            <Clock className="w-3.5 h-3.5 text-[#D86A78]" />
            <span>Time: {order.pickupTime}</span>
          </div>

          <div className="flex items-center gap-1 text-[#A88C85]">
            <span>Placed on {createdDate}</span>
          </div>
        </div>
      </div>

      {/* Right Price & CTA */}
      <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F7EFEF]">
        <div className="text-left sm:text-right">
          <span className="text-[11px] text-[#9E7A70] block font-semibold">Total Price</span>
          <span className="text-xl font-black text-[#4A2E2B]">${formattedPrice}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#D86A78] bg-[#FDF0F2] px-3.5 py-2 rounded-2xl group-hover:bg-[#FCE2E6] transition-colors">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
