import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../../hooks/useCart'
import { useAuth } from '../../../context/AuthContext'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { CartItemRow } from '../components/CartItemRow'
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Trash2,
  Calendar,
  ShieldCheck,
  Cake,
  AlertCircle,
} from 'lucide-react'

export const CartPage: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const { cart, totalCount, isLoading, isError, updateItem, removeItem, clearAll } = useCart()
  const navigate = useNavigate()

  const handleQuantityUpdate = async (id: number, newQuantity: number) => {
    await updateItem({ id, dto: { quantity: newQuantity } })
  }

  const handleNotesUpdate = async (id: number, newNotes: string) => {
    await updateItem({ id, dto: { notes: newNotes } })
  }

  const handleRemoveItem = async (id: number) => {
    await removeItem(id)
  }

  const handleProceedToCheckout = () => {
    navigate('/checkout')
  }

  const cartTotalFormatted =
    cart && typeof cart.cartTotal === 'number'
      ? cart.cartTotal.toFixed(2)
      : parseFloat(String(cart?.cartTotal || 0)).toFixed(2)

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#FDF0F2] text-[#D86A78] text-xs font-bold px-3 py-1 rounded-full border border-[#F6DADC] mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Your Shopping Cart</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3B2219]">
              Review Your Bakery Order
            </h1>
          </div>

          {isLoggedIn && cart && cart.items.length > 0 && (
            <button
              type="button"
              onClick={() => clearAll()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#EFE2E0] text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

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
          <div className="bg-red-50/80 border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-900 mb-1">
              Unable to Load Cart
            </h3>
            <p className="text-xs text-red-700 mb-4">
              There was an issue fetching your cart. Please ensure you are signed in.
            </p>
            <Link
              to="/cakes"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold"
            >
              Return to Catalog
            </Link>
          </div>
        )}

        {/* Logged Out or Empty Cart State */}
        {!isLoading && (!isLoggedIn || !cart || cart.items.length === 0) && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#F4E6E4] text-center max-w-lg mx-auto my-8 shadow-xs space-y-5">
            <div className="w-20 h-20 bg-[#FDF0F2] rounded-full flex items-center justify-center mx-auto text-[#D86A78] shadow-2xs">
              <Cake className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#3B2219]">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed max-w-md mx-auto">
                {!isLoggedIn
                  ? 'Please sign in to view your cart items or explore our handcrafted cake catalog.'
                  : 'Looks like you haven’t added any delicious cakes or treats to your cart yet.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/cakes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#E87A84]" />
                <span>Explore Cake Catalog</span>
              </Link>

              {!isLoggedIn && (
                <Link
                  to="/login?redirect=/cart"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#EFE2E0] hover:bg-[#FAF5F4] text-[#6E4E46] rounded-2xl text-xs font-bold transition-colors"
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Active Cart Display */}
        {isLoggedIn && cart && cart.items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleQuantityUpdate}
                  onUpdateNotes={handleNotesUpdate}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#F4E6E4] shadow-xs space-y-6 sticky top-24">
              <h3 className="text-lg font-black text-[#3B2219] border-b border-[#F7EFEF] pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-[#7C5C54]">
                <div className="flex justify-between items-center">
                  <span>Total Items ({totalCount})</span>
                  <span className="font-bold text-[#3B2219]">{totalCount} items</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Estimated Pickup</span>
                  <span className="font-semibold text-emerald-700">1 day advance notice required</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#F7EFEF]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#3B2219]">${cartTotalFormatted}</span>
                </div>
              </div>

              {/* Total Cost Display */}
              <div className="pt-4 border-t-2 border-[#EAD7D5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9E7A70] block font-semibold">Total Price</span>
                  <span className="text-2xl font-black text-[#4A2E2B]">
                    ${cartTotalFormatted}
                  </span>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="bg-[#FAF2F0] border border-[#F3E2E0] p-3.5 rounded-2xl text-[11px] text-[#8C6057] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#4A2E2B]">
                  <Calendar className="w-3.5 h-3.5 text-[#D86A78]" />
                  <span>Storefront Pickup Notice</span>
                </div>
                <p className="leading-normal">
                  All cakes are freshly baked to order. Pickup date and time slot selection will be chosen at checkout.
                </p>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-6 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#A88C85] pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure Checkout & Pickup Guarantee</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
