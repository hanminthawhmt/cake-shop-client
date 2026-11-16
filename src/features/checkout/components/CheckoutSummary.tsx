import React from 'react'
import type { Cart } from '../../../types/cart'
import { Sparkles, MessageSquare, ShoppingBag } from 'lucide-react'

interface CheckoutSummaryProps {
  cart: Cart
}

const FALLBACK_CAKE_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=300&q=80',
]

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ cart }) => {
  const cartTotalFormatted =
    typeof cart.cartTotal === 'number'
      ? cart.cartTotal.toFixed(2)
      : parseFloat(String(cart.cartTotal || 0)).toFixed(2)

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#F4E6E4] shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#F7EFEF] pb-4">
        <h3 className="text-lg font-black text-[#3B2219] flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#D86A78]" />
          <span>Items to Order ({cart.items.length})</span>
        </h3>
        <span className="text-xs font-bold text-[#8C6057] bg-[#FAF2F0] px-2.5 py-1 rounded-full border border-[#F3E2E0]">
          Read-Only
        </span>
      </div>

      {/* Cart Items List */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
        {cart.items.map((item) => {
          const imageUrl =
            item.cake.images && item.cake.images.length > 0
              ? item.cake.images[0].url
              : FALLBACK_CAKE_IMAGES[item.cake.id % FALLBACK_CAKE_IMAGES.length]

          const unitPriceFormatted =
            typeof item.unitPrice === 'number'
              ? item.unitPrice.toFixed(2)
              : parseFloat(String(item.unitPrice || 0)).toFixed(2)

          const lineTotalFormatted =
            typeof item.lineTotal === 'number'
              ? item.lineTotal.toFixed(2)
              : parseFloat(String(item.lineTotal || 0)).toFixed(2)

          return (
            <div
              key={item.id}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F5] border border-[#F3E2E0]"
            >
              <img
                src={imageUrl}
                alt={item.cake.name}
                className="w-16 h-16 rounded-xl object-cover border border-[#EFE2E0] shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#3B2219] truncate">
                    {item.cake.name}
                  </h4>
                  <span className="text-xs font-bold text-[#4A2E2B] shrink-0">
                    ${lineTotalFormatted}
                  </span>
                </div>

                {/* Option Badges */}
                {item.selectedValues && item.selectedValues.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.selectedValues.map((val) => (
                      <span
                        key={val.id}
                        className="text-[10px] font-medium bg-white text-[#8C6057] px-2 py-0.5 rounded-full border border-[#EFE2E0] inline-flex items-center gap-0.5"
                      >
                        <Sparkles className="w-2 h-2 text-[#E87A84]" />
                        {val.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-[#8C6057]">
                  <span>
                    Qty: <strong className="text-[#3B2219]">{item.quantity}</strong> × ${unitPriceFormatted}
                  </span>
                  {item.notes && (
                    <span className="truncate max-w-[140px] italic inline-flex items-center gap-0.5 text-[#D86A78]">
                      <MessageSquare className="w-2.5 h-2.5" />
                      {item.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart Summary Totals */}
      <div className="pt-4 border-t-2 border-[#EAD7D5] flex items-center justify-between">
        <div>
          <span className="text-xs text-[#9E7A70] font-semibold block">Total Amount</span>
          <span className="text-2xl font-black text-[#4A2E2B]">${cartTotalFormatted}</span>
        </div>
        <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
          Pay at Storefront
        </span>
      </div>
    </div>
  )
}
