import React from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { ArrowLeft, ShoppingBag, Calendar, Sparkles } from 'lucide-react'

export const CheckoutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6057] hover:text-[#D86A78] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F4E6E4] shadow-xs text-center space-y-6">
          <div className="w-16 h-16 bg-[#FDF0F2] rounded-full flex items-center justify-center mx-auto text-[#D86A78] shadow-2xs">
            <Calendar className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-[#FDF0F2] text-[#D86A78] text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Checkout Flow Placeholder
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B2219]">Checkout & Pickup Selection</h1>
            <p className="text-xs sm:text-sm text-[#7C5C54] max-w-md mx-auto leading-relaxed">
              This route `/checkout` will host pickup date selection, time slot picking, and order submission.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A2E2B] text-white rounded-2xl text-xs font-bold shadow-xs hover:bg-[#38221E] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Return to Cart</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
