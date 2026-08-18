import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCakeById } from '../../../api/cakes'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react'

export const CakeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const cakeId = Number(id)

  const {
    data: cake,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cake', cakeId],
    queryFn: () => fetchCakeById(cakeId),
    enabled: !isNaN(cakeId),
  })

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Link
          to="/cakes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6057] hover:text-[#D86A78] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cake Catalog
        </Link>

        {isLoading && (
          <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl w-full" />
            <div className="h-8 bg-gray-200 rounded-md w-1/3" />
            <div className="h-4 bg-gray-200 rounded-md w-2/3" />
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-3xl p-10 border border-red-200 text-center">
            <h2 className="text-xl font-bold text-red-900 mb-2">Cake Not Found</h2>
            <p className="text-xs text-red-700 mb-6">
              The cake you are looking for does not exist or has been removed from our menu.
            </p>
            <Link
              to="/cakes"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold"
            >
              Browse Available Cakes
            </Link>
          </div>
        )}

        {cake && (
          <div className="bg-white rounded-3xl overflow-hidden border border-[#F4E6E4] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Image display */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF2F0]">
              <img
                src={
                  cake.images && cake.images.length > 0
                    ? cake.images[0].url
                    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
                }
                alt={cake.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cake details */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <span className="inline-flex items-center gap-1 bg-[#FDF0F2] text-[#D86A78] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3 h-3" />
                  {cake.category?.name || 'Artisanal Bakery'}
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-[#3B2219]">
                  {cake.name}
                </h1>

                <p className="mt-3 text-sm text-[#7C5C54] leading-relaxed">
                  {cake.description}
                </p>

                <div className="mt-6 text-2xl font-extrabold text-[#4A2E2B]">
                  ${typeof cake.basePrice === 'number' ? cake.basePrice.toFixed(2) : parseFloat(cake.basePrice || '0').toFixed(2)}
                </div>
              </div>

              {/* Options Preview */}
              {cake.options && cake.options.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#F7EFEF]">
                  <h3 className="text-xs font-bold text-[#8C6057] uppercase tracking-wider">
                    Customization Options Available
                  </h3>
                  {cake.options.map((opt) => (
                    <div key={opt.id} className="space-y-2">
                      <span className="text-xs font-semibold text-[#3B2219]">
                        {opt.name}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {opt.values.map((v) => (
                          <span
                            key={v.id}
                            className="bg-[#FAF7F5] border border-[#EFE2E0] text-[#6E4E46] text-xs px-2.5 py-1 rounded-lg"
                          >
                            {v.label} {parseFloat(String(v.priceModifier)) > 0 ? `(+$${v.priceModifier})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-[#F7EFEF]">
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-6 bg-[#E87A84] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 opacity-80 cursor-not-allowed shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (Coming Soon)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
