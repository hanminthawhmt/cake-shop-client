import React from 'react'
import type { Cake } from '../../../types/cake'
import { CakeCard } from './CakeCard'
import { Cake as CakeIcon, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'

interface CakeGridProps {
  cakes: Cake[]
  isLoading: boolean
  isError: boolean
  isFetching?: boolean
  categoryMap?: Record<number, string>
  onResetFilters?: () => void
  onRetry?: () => void
}

export const CakeGrid: React.FC<CakeGridProps> = ({
  cakes,
  isLoading,
  isError,
  isFetching = false,
  categoryMap,
  onResetFilters,
  onRetry,
}) => {
  // Loading skeleton layout
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl overflow-hidden border border-[#F4E6E4] p-4 flex flex-col gap-4 animate-pulse"
          >
            <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl" />
            <div className="h-5 bg-gray-200 rounded-md w-3/4" />
            <div className="h-3 bg-gray-200 rounded-md w-full" />
            <div className="h-3 bg-gray-200 rounded-md w-2/3" />
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
              <div className="h-6 bg-gray-200 rounded-md w-16" />
              <div className="h-8 bg-gray-200 rounded-xl w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto my-12 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-red-900">
            Unable to Load Cakes
          </h3>
          <p className="text-xs text-red-700 leading-relaxed">
            There was a problem communicating with our bakery catalog. If the backend server was inactive, it may be waking up.
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {isFetching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{isFetching ? 'Connecting to Server...' : 'Retry Connecting'}</span>
          </button>
        )}
      </div>
    )
  }

  // Empty state
  if (cakes.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xs border border-[#F3E5E3] rounded-3xl p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 bg-[#FFF2F4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#D86A78]">
          <CakeIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#3B2219]">No Cakes Found</h3>
        <p className="mt-2 text-xs sm:text-sm text-[#7C5C54] leading-relaxed">
          We couldn't find any cakes matching your current filter or search terms. Try searching for something else or clearing your filters!
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold hover:bg-[#38221E] transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Show All Cakes
          </button>
        )}
      </div>
    )
  }

  // Cards grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cakes.map((cake) => (
        <CakeCard key={cake.id} cake={cake} categoryMap={categoryMap} />
      ))}
    </div>
  )
}
