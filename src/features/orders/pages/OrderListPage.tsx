import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchOrders } from '../../../api/orders'
import { useAuth } from '../../../context/AuthContext'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { OrderCard } from '../components/OrderCard'
import { Sparkles, AlertCircle, Clock, Cake } from 'lucide-react'

export const OrderListPage: React.FC = () => {
  const { isLoggedIn } = useAuth()

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrders(),
    enabled: isLoggedIn,
  })

  // Sort orders newest first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FDF0F2] text-[#D86A78] text-xs font-bold px-3 py-1 rounded-full border border-[#F6DADC] mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Customer Purchase History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3B2219]">
            My Orders & Tracking
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#7C5C54]">
            Track status updates for your cake pre-orders and view past storefront pickups.
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-[#F4E6E4] h-28" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50/80 border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-900 mb-1">
              Unable to Load Orders
            </h3>
            <p className="text-xs text-red-700 mb-4">
              Please check your login session and network connection.
            </p>
            <Link
              to="/login?redirect=/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold"
            >
              Sign In Again
            </Link>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!isLoggedIn || sortedOrders.length === 0) && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#F4E6E4] text-center max-w-lg mx-auto my-8 shadow-xs space-y-5">
            <div className="w-20 h-20 bg-[#FDF0F2] rounded-full flex items-center justify-center mx-auto text-[#D86A78] shadow-2xs">
              <Cake className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#3B2219]">No Orders Found</h2>
              <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed max-w-md mx-auto">
                {!isLoggedIn
                  ? 'Please sign in to view your past cake pre-orders and tracking status.'
                  : 'You haven’t placed any cake orders yet. Browse our bakery catalog to treat yourself!'}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                to="/cakes"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#E87A84]" />
                <span>Explore Cake Catalog</span>
              </Link>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && isLoggedIn && sortedOrders.length > 0 && (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
