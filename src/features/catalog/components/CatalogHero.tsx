import React from 'react'
import { Sparkles, Heart } from 'lucide-react'

export const CatalogHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF5F5] via-[#FDF2F4] to-[#F7E6E8] rounded-3xl p-6 sm:p-10 mb-8 border border-[#F6DADC] shadow-sm">
      {/* Background Decorative Accent Blobs */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-[#FCE4E6]/50 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 rounded-full bg-[#F5D5D8]/40 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#D86A78] border border-[#F3D1D5] mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D86A78]" />
          <span>Handcrafted Daily in Small Batches</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3B2219] tracking-tight leading-tight">
          Baked with Love, <br />
          <span className="text-[#D86A78]">Served with Joy</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-[#6E4E46] leading-relaxed max-w-xl">
          Explore our signature collection of artisanal cakes, custom celebration desserts, and freshly prepared bakery treats.
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs font-medium text-[#8C6057]">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#E87A84] fill-[#E87A84]" />
            100% Organic Ingredients
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D4B5AF]" />
          <span>Pickup Available</span>
        </div>
      </div>
    </div>
  )
}
