import React, { useState, useEffect } from 'react'
import { Cake as CakeIcon, Calendar } from 'lucide-react'

export const FALLBACK_CAKE_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', // Chocolate drip cake
  'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80', // Strawberry shortcake slice
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', // Raspberry cake slice
  'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80', // Pastel bakery cake
  'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80', // Pistachio berry cake
  'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80', // Layer cake
  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', // Berry cheesecake
  'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80', // Chocolate celebration cake
]

export const FALLBACK_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
]

function sanitizeImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return null
  // Upgrade insecure HTTP to HTTPS to prevent browser mixed-content blocks
  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://')
  }
  return trimmed
}

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null
  alt: string
  cakeId?: number
  roomId?: number
  fallbackType?: 'cake' | 'room'
  fallbackSrc?: string
  className?: string
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  cakeId = 0,
  roomId = 0,
  fallbackType = 'cake',
  fallbackSrc,
  className = '',
  ...imgProps
}) => {
  const defaultFallback =
    fallbackSrc ||
    (fallbackType === 'room'
      ? FALLBACK_ROOM_IMAGES[Math.abs(roomId) % FALLBACK_ROOM_IMAGES.length]
      : FALLBACK_CAKE_IMAGES[Math.abs(cakeId) % FALLBACK_CAKE_IMAGES.length])

  const sanitized = sanitizeImageUrl(src)
  const initialSrc = sanitized || defaultFallback

  const [currentSrc, setCurrentSrc] = useState(initialSrc)
  const [hasError, setHasError] = useState(false)
  const [hasFallbackError, setHasFallbackError] = useState(false)

  // Sync if src prop or fallback changes
  useEffect(() => {
    const validSrc = sanitizeImageUrl(src) || defaultFallback
    setCurrentSrc(validSrc)
    setHasError(false)
    setHasFallbackError(false)
  }, [src, defaultFallback])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Switch to reliable fallback
      setCurrentSrc(defaultFallback)
    } else {
      // Even default fallback failed (e.g. offline/network blocked)
      setHasFallbackError(true)
    }
  }

  if (hasFallbackError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-tr from-[#FFF2F4] to-[#FAF0ED] text-[#8C6057] select-none p-3 ${className}`}
      >
        <div className="w-10 h-10 rounded-2xl bg-white/80 shadow-2xs flex items-center justify-center text-[#D86A78] mb-1.5">
          {fallbackType === 'room' ? (
            <Calendar className="w-5 h-5" />
          ) : (
            <CakeIcon className="w-5 h-5" />
          )}
        </div>
        <span className="text-[11px] font-bold text-[#4A2E2B] line-clamp-1 text-center">
          {alt}
        </span>
        <span className="text-[9px] text-[#A88C85] tracking-wider uppercase mt-0.5">
          Petal & Cocoa
        </span>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...imgProps}
    />
  )
}
