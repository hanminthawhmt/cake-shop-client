import React from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../../../types/orders'
import { CheckCircle2, Calendar, Clock, ShoppingBag } from 'lucide-react'

interface OrderConfirmationModalProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!isOpen || !order) return null

  const totalPriceFormatted =
    typeof order.totalPrice === 'number'
      ? order.totalPrice.toFixed(2)
      : parseFloat(String(order.totalPrice || 0)).toFixed(2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#F4E6E4] shadow-2xl space-y-6 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed #{order.id}
          </span>
          <h2 className="text-2xl font-black text-[#3B2219]">Thank You for Your Order!</h2>
          <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed">
            Your cake pre-order has been placed successfully. We are preparing it for your chosen pickup slot.
          </p>
        </div>

        {/* Order Details Box */}
        <div className="bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl p-4 space-y-2.5 text-left text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8C6057] flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#D86A78]" />
              Pickup Date
            </span>
            <span className="font-extrabold text-[#3B2219]">{order.pickupDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8C6057] flex items-center gap-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#D86A78]" />
              Pickup Time
            </span>
            <span className="font-extrabold text-[#3B2219]">{order.pickupTime}</span>
          </div>

          <div className="pt-2 border-t border-[#EFE2E0] flex items-center justify-between text-sm">
            <span className="font-bold text-[#3B2219]">Total Paid at Store</span>
            <span className="font-black text-[#4A2E2B]">${totalPriceFormatted}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            to="/cakes"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#E87A84]" />
            <span>Continue Browsing Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
