import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCakeById } from '../../../api/cakes'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../hooks/useCart'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { CakeImageGallery } from '../components/CakeImageGallery'
import { CakeOptionSelector } from '../components/CakeOptionSelector'
import { CakePriceSummary } from '../components/CakePriceSummary'
import { AuthPromptModal } from '../components/AuthPromptModal'
import {
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Minus,
  Plus,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

export const CakeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const cakeId = Number(id)

  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [selectedOptionValues, setSelectedOptionValues] = useState<Record<number, number>>({})
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [addedSuccessMsg, setAddedSuccessMsg] = useState<string | null>(null)

  // Fetch cake details
  const {
    data: cake,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cake', cakeId],
    queryFn: () => fetchCakeById(cakeId),
    enabled: !isNaN(cakeId),
  })

  // Pre-select first value for every option group upon cake load
  useEffect(() => {
    if (cake && cake.options && cake.options.length > 0) {
      const initialMap: Record<number, number> = {}
      cake.options.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          initialMap[opt.id] = opt.values[0].id
        }
      })
      setSelectedOptionValues(initialMap)
    }
  }, [cake])

  // Handle option selection update
  const handleSelectOptionValue = (optionId: number, valueId: number) => {
    setSelectedOptionValues((prev) => ({
      ...prev,
      [optionId]: valueId,
    }))
  }

  // Calculate base price & modifiers
  const basePriceNum = useMemo(() => {
    if (!cake) return 0
    return typeof cake.basePrice === 'number'
      ? cake.basePrice
      : parseFloat(cake.basePrice || '0')
  }, [cake])

  const selectedModifiers = useMemo(() => {
    if (!cake || !cake.options) return []
    const modifiers: Array<{ label: string; price: number }> = []

    cake.options.forEach((opt) => {
      const selectedValId = selectedOptionValues[opt.id]
      if (selectedValId) {
        const val = opt.values.find((v) => v.id === selectedValId)
        if (val) {
          const mod = parseFloat(String(val.priceModifier || '0'))
          modifiers.push({
            label: `${opt.name}: ${val.label}`,
            price: mod,
          })
        }
      }
    })

    return modifiers
  }, [cake, selectedOptionValues])

  const unitPrice = useMemo(() => {
    const sumModifiers = selectedModifiers.reduce((acc, curr) => acc + curr.price, 0)
    return basePriceNum + sumModifiers
  }, [basePriceNum, selectedModifiers])

  const totalPrice = useMemo(() => {
    return unitPrice * quantity
  }, [unitPrice, quantity])

  const { isLoggedIn } = useAuth()
  const { addItem, isAdding } = useCart()

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true)
      return
    }

    try {
      const selectedValueIds = Object.values(selectedOptionValues)
      await addItem({
        cakeId: cakeId,
        quantity,
        notes: notes.trim() !== '' ? notes.trim() : undefined,
        selectedValueIds,
      })

      setAddedSuccessMsg(
        `Successfully added ${quantity}x "${cake?.name}" ($${totalPrice.toFixed(2)}) to your cart!`
      )

      // Auto dismiss success toast after 5 seconds
      setTimeout(() => {
        setAddedSuccessMsg(null)
      }, 5000)
    } catch (err: any) {
      console.error('Failed to add item to cart:', err)
      const errorText = err?.response?.data?.message || 'Failed to add item to cart. Please try again.'
      alert(Array.isArray(errorText) ? errorText.join(', ') : errorText)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <Link
          to="/cakes"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6057] hover:text-[#D86A78] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Cake Catalog</span>
        </Link>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-200 rounded-md w-full" />
              <div className="h-4 bg-gray-200 rounded-md w-2/3" />
              <div className="h-24 bg-gray-200 rounded-2xl w-full" />
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-3xl p-10 border border-red-200 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-900 mb-1">Cake Not Found</h2>
            <p className="text-xs text-red-700 mb-6">
              The requested cake identifier is invalid or no longer available.
            </p>
            <Link
              to="/cakes"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold"
            >
              Browse Catalog
            </Link>
          </div>
        )}

        {/* Cake Detail Display */}
        {cake && (
          <div className="bg-white rounded-3xl overflow-hidden border border-[#F4E6E4] shadow-xs p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6">
              <CakeImageGallery
                images={cake.images}
                cakeName={cake.name}
                cakeId={cake.id}
              />
            </div>

            {/* Right Column: Cake Info & Customization */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-[#FDF0F2] text-[#D86A78] text-xs font-bold px-3 py-1 rounded-full border border-[#F6DADC]">
                    <Sparkles className="w-3.5 h-3.5 text-[#E87A84]" />
                    {cake.category?.name || 'Handcrafted Bakery'}
                  </span>

                  {cake.isAvailable ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Available for Pickup
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      Currently Sold Out
                    </span>
                  )}
                </div>

                {/* Name & Base Price */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3B2219]">
                    {cake.name}
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-[#7C5C54] leading-relaxed">
                    {cake.description ||
                      'Crafted with premium organic cocoa, fresh cream, and natural flavors. Perfect for birthdays, celebrations, or daily treats.'}
                  </p>
                </div>
              </div>

              {/* Customization Options */}
              {cake.options && cake.options.length > 0 && (
                <div className="pt-6 border-t border-[#F7EFEF]">
                  <CakeOptionSelector
                    options={cake.options}
                    selectedOptionValues={selectedOptionValues}
                    onSelectValue={handleSelectOptionValue}
                  />
                </div>
              )}

              {/* Quantity Selector & Special Instructions */}
              <div className="space-y-4 pt-6 border-t border-[#F7EFEF]">
                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-[#3B2219]">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3 bg-[#FAF2F0] border border-[#EFE2E0] rounded-2xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl bg-white text-[#3B2219] flex items-center justify-center shadow-2xs hover:bg-[#FAF5F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-8 text-center text-sm font-bold text-[#3B2219]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-xl bg-white text-[#3B2219] flex items-center justify-center shadow-2xs hover:bg-[#FAF5F4] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Special Instructions Notes Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6E4E46] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D86A78]" />
                    <span>Special Instructions / Birthday Message</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Write 'Happy 25th Birthday Sarah!' in chocolate icing..."
                    className="w-full p-3 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                  />
                </div>
              </div>

              {/* Price Breakdown Calculator */}
              <CakePriceSummary
                basePrice={basePriceNum}
                selectedModifiers={selectedModifiers}
                quantity={quantity}
                unitPrice={unitPrice}
                totalPrice={totalPrice}
              />

              {/* Added Success Banner */}
              {addedSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{addedSuccessMsg}</span>
                </div>
              )}

              {/* Logged Out Info Callout if unauthenticated */}
              {!isLoggedIn && (
                <div className="bg-[#FFF5F6] border border-[#F3D1D5] text-[#8C4A52] p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3">
                  <span>Sign in required to add items to cart.</span>
                  <Link
                    to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                    className="text-xs font-bold text-[#D86A78] underline hover:text-[#B54A57]"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!cake.isAvailable || isAdding}
                className="w-full py-4 px-6 bg-[#4A2E2B] hover:bg-[#38221E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {isAdding
                    ? 'Adding to Cart...'
                    : cake.isAvailable
                    ? `Add to Cart — $${totalPrice.toFixed(2)}`
                    : 'Currently Unavailable'}
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Auth Modal Prompt for Logged Out Visitors */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        cakeName={cake?.name || 'Cake'}
        returnPath={location.pathname}
      />
    </div>
  )
}
