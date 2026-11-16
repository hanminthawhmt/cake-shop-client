import React, { useState } from 'react'
import type { CakeImage } from '../../../types/cake'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { SafeImage, FALLBACK_CAKE_IMAGES } from '../../../components/common/SafeImage'

interface CakeImageGalleryProps {
  images?: CakeImage[]
  cakeName: string
  cakeId: number
}

export const CakeImageGallery: React.FC<CakeImageGalleryProps> = ({
  images = [],
  cakeName,
  cakeId,
}) => {
  const validImages = images
    .filter((img) => img && typeof img.url === 'string' && img.url.trim() !== '')
    .map((img) => img.url.trim())

  const fallbackUrl = FALLBACK_CAKE_IMAGES[Math.abs(cakeId) % FALLBACK_CAKE_IMAGES.length]
  const displayImages = validImages.length > 0 ? validImages : [fallbackUrl]

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Active Image Container */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#FAF2F0] border border-[#F4E6E4] shadow-xs group">
        <SafeImage
          src={displayImages[activeImageIndex]}
          alt={`${cakeName} photo ${activeImageIndex + 1}`}
          cakeId={cakeId}
          fallbackType="cake"
          fallbackSrc={fallbackUrl}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Carousel Navigation Arrows if multiple images */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs text-[#3B2219] flex items-center justify-center shadow-xs hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs text-[#3B2219] flex items-center justify-center shadow-xs hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-[#8C6057] shadow-xs flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#E87A84]" />
          Freshly Baked
        </div>
      </div>

      {/* Thumbnails Row if multiple images */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {displayImages.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? 'border-[#D86A78] ring-2 ring-[#D86A78]/20 scale-105'
                  : 'border-[#F3E2E0] opacity-70 hover:opacity-100'
              }`}
            >
              <SafeImage
                src={imgUrl}
                alt={`Thumbnail ${idx + 1}`}
                cakeId={cakeId + idx}
                fallbackType="cake"
                fallbackSrc={fallbackUrl}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
