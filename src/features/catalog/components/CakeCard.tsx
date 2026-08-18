import React from 'react'
import { Link } from 'react-router-dom'
import type { Cake } from '../../../types/cake'
import { ArrowRight, Sparkles } from 'lucide-react'

interface CakeCardProps {
  cake: Cake
  categoryMap?: Record<number, string>
}

// Fallback high quality cake photography URLs for visual warmth if image array is empty
const FALLBACK_CAKE_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
]

export const CakeCard: React.FC<CakeCardProps> = ({ cake, categoryMap }) => {
  // Get image URL or pick fallback based on cake ID
  const imageUrl =
    cake.images && cake.images.length > 0
      ? cake.images[0].url
      : FALLBACK_CAKE_IMAGES[cake.id % FALLBACK_CAKE_IMAGES.length]

  // Category name lookup
  const categoryName =
    cake.category?.name ||
    (categoryMap && categoryMap[cake.categoryId]) ||
    'Freshly Baked'

  const formattedPrice =
    typeof cake.basePrice === 'number'
      ? cake.basePrice.toFixed(2)
      : parseFloat(cake.basePrice || '0').toFixed(2)

  return (
    <Link
      to={`/cakes/${cake.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#F4E6E4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF2F0]">
        <img
          src={imageUrl}
          alt={cake.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#6E3C33] border border-[#F3D5CF] shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#E87A84]" />
          {categoryName}
        </span>

        {/* Availability Badge */}
        {!cake.isAvailable && (
          <span className="absolute top-3 right-3 bg-red-900/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="text-lg font-bold text-[#3B2219] group-hover:text-[#D86A78] transition-colors line-clamp-1">
            {cake.name}
          </h3>
          <p className="mt-1.5 text-xs text-[#7C5C54] line-clamp-2 leading-relaxed">
            {cake.description || 'Deliciously handcrafted with premium ingredients.'}
          </p>
        </div>

        {/* Card Footer: Price & CTA */}
        <div className="mt-4 pt-4 border-t border-[#F7EFEF] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9E7A70] block">Starting from</span>
            <span className="text-xl font-extrabold text-[#4A2E2B]">
              ${formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D86A78] group-hover:bg-[#FDF0F2] px-3 py-2 rounded-xl transition-all">
            <span>View Cake</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
