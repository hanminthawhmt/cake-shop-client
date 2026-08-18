import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../context/AuthContext'
import { createOrder } from '../../../api/orders'
import type { Order } from '../../../types/orders'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { CheckoutSummary } from '../components/CheckoutSummary'
import { OrderConfirmationModal } from '../components/OrderConfirmationModal'
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Check,
  ShoppingBag,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

// Available bakery pickup time slots (HH:mm format)
const PICKUP_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

export const CheckoutPage: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const { cart, isLoading } = useCart()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Calculate minimum allowed pickup date (tomorrow: at least 1 day in advance)
  const minPickupDate = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }, [])

  const [pickupDate, setPickupDate] = useState<string>(minPickupDate)
  const [pickupTime, setPickupTime] = useState<string>('10:00')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!pickupDate || !pickupTime) {
      setErrorMsg('Please select a valid pickup date and time slot.')
      return
    }

    try {
      setIsSubmitting(true)
      const newOrder = await createOrder({
        pickupDate,
        pickupTime,
      })

      // Invalidate cart and orders queries so header badge clears instantly
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      await queryClient.invalidateQueries({ queryKey: ['orders'] })

      setConfirmedOrder(newOrder)
    } catch (err: any) {
      console.error('Order placement failed:', err)
      const text =
        err?.response?.data?.message ||
        'Failed to place order. Please check your pickup date and try again.'
      setErrorMsg(Array.isArray(text) ? text.join(', ') : text)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEmptyCart = !cart || !cart.items || cart.items.length === 0

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6057] hover:text-[#D86A78] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shopping Cart</span>
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FDF0F2] text-[#D86A78] text-xs font-bold px-3 py-1 rounded-full border border-[#F6DADC] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront Pre-Order Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3B2219]">
            Select Pickup Date & Time
          </h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded-md w-1/3" />
            <div className="h-24 bg-gray-200 rounded-2xl w-full" />
          </div>
        )}

        {/* Empty Cart Safeguard */}
        {!isLoading && (isEmptyCart || !isLoggedIn) && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#F4E6E4] text-center max-w-md mx-auto my-8 shadow-xs space-y-5">
            <div className="w-16 h-16 bg-[#FDF0F2] rounded-full flex items-center justify-center mx-auto text-[#D86A78] shadow-2xs">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#3B2219]">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed">
                You need items in your cart to proceed with checkout. Please explore our cake catalog first!
              </p>
            </div>

            <Link
              to="/cakes"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold shadow-xs transition-colors"
            >
              <span>Browse Cake Catalog</span>
            </Link>
          </div>
        )}

        {/* Active Checkout Layout */}
        {!isLoading && isLoggedIn && cart && cart.items.length > 0 && (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Pickup Date & Time Selection Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-6">
              <h2 className="text-xl font-black text-[#3B2219] border-b border-[#F7EFEF] pb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#D86A78]" />
                <span>Pickup Details</span>
              </h2>

              {/* Error Alert */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Notice Banner */}
              <div className="bg-[#FAF2F0] border border-[#F3E2E0] p-4 rounded-2xl text-xs text-[#8C6057] space-y-1">
                <span className="font-extrabold text-[#4A2E2B] block">Notice: 1-Day Advance Booking</span>
                <p className="leading-relaxed">
                  All cakes are freshly baked to order. Our bakery system requires at least 1 day advance notice (earliest pickup is tomorrow).
                </p>
              </div>

              {/* Pickup Date Picker Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6E4E46] block flex items-center justify-between">
                  <span>Pickup Date</span>
                  <span className="text-[11px] text-[#D86A78] font-semibold">Min 1 day in advance</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={minPickupDate}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-3.5 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-sm font-bold text-[#3B2219] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                  />
                </div>
              </div>

              {/* Pickup Time Slot Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#6E4E46] block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D86A78]" />
                  <span>Select Bakery Pickup Time Slot</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PICKUP_TIME_SLOTS.map((slot) => {
                    const isSelected = pickupTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setPickupTime(slot)}
                        className={`p-3 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#D86A78] text-white shadow-md shadow-[#D86A78]/20 ring-2 ring-[#D86A78]/30'
                            : 'bg-[#FAF7F5] text-[#5C3F37] border border-[#EFE2E0] hover:bg-[#FDF6F7] hover:border-[#F3D1D5]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{slot}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Place Order CTA Button */}
              <div className="pt-4 border-t border-[#F7EFEF] space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#4A2E2B] hover:bg-[#38221E] disabled:bg-gray-300 text-white rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-[#E87A84]" />
                  <span>{isSubmitting ? 'Placing Order...' : 'Place Order'}</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-[#A88C85]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>No upfront payment required — Pay upon storefront pickup</span>
                </div>
              </div>
            </div>

            {/* Right Column: Read-Only Cart Summary */}
            <div className="lg:col-span-5 sticky top-24">
              <CheckoutSummary cart={cart} />
            </div>
          </form>
        )}
      </main>

      <Footer />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={Boolean(confirmedOrder)}
        order={confirmedOrder}
        onClose={() => {
          setConfirmedOrder(null)
          navigate('/cakes')
        }}
      />
    </div>
  )
}
