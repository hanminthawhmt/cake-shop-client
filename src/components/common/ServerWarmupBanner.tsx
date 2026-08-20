import React, { useState, useEffect } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { Loader2, X, Server } from 'lucide-react'

export const ServerWarmupBanner: React.FC = () => {
  const isFetching = useIsFetching()
  const [showSlowNotice, setShowSlowNotice] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Trigger slow loading warning after 2.5 seconds of continuous fetching
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isFetching > 0) {
      timer = setTimeout(() => {
        setShowSlowNotice(true)
      }, 2500)
    } else {
      setShowSlowNotice(false)
    }
    return () => clearTimeout(timer)
  }, [isFetching])

  if (bannerDismissed && !showSlowNotice) {
    return null
  }

  return (
    <aside aria-label="Server notice" className="bg-gradient-to-r from-[#4A2E2B] via-[#663A36] to-[#4A2E2B] text-white text-xs py-2 px-4 shadow-xs relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showSlowNotice ? (
            <span className="inline-flex items-center gap-2 bg-[#D86A78] text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] animate-pulse shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Waking Up Server...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-pink-100 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0 border border-white/20">
              <Server className="w-3 h-3 text-[#E87A84]" />
              Render Free Tier Host
            </span>
          )}

          <p className="truncate text-[11px] sm:text-xs font-medium text-pink-50/95">
            {showSlowNotice ? (
              <span>
                The backend is spinning up from inactivity. This first load may take up to <strong>50–60 seconds</strong>. Thank you for your patience!
              </span>
            ) : (
              <span>
                Backend API is hosted on Render free tier. First request may take up to 1 minute to wake up from inactivity.
              </span>
            )}
          </p>
        </div>

        {!showSlowNotice && (
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="text-pink-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Dismiss notice"
            aria-label="Dismiss server notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  )
}
