import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOrderById, cancelOrder } from '../../../api/orders'
import { useAuth } from '../../../context/AuthContext'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { OrderStatusBadge, PaymentStatusBadge } from '../components/OrderStatusBadge'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
  XCircle,
  CheckCircle2,
} from 'lucide-react'

const FALLBACK_CAKE_IMAGES = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80',
]

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const [cancelErrorMsg, setCancelErrorMsg] = useState<string | null>(null)
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null)

  // Fetch Order details
  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: isLoggedIn && !isNaN(orderId),
  })

  // Cancel order mutation
  const cancelMutation = useMutation({
    mutationFn: (idToCancel: number) => cancelOrder(idToCancel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      setCancelSuccessMsg(`Order #${orderId} has been successfully cancelled.`)
      setCancelErrorMsg(null)
    },
    onError: (err: any) => {
      console.error('Failed to cancel order:', err)
      const errorText =
        err?.response?.data?.message ||
        'Order cancellation rejected. Pickup cutoff (2 hours before pickup) may have passed.'
      setCancelErrorMsg(Array.isArray(errorText) ? errorText.join(', ') : errorText)
      setCancelSuccessMsg(null)
    },
  })

  const handleCancelClick = () => {
    if (!order) return
    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${order.id}?`
    )
    if (confirmed) {
      cancelMutation.mutate(order.id)
    }
  }

  const isCancellable =
    order && order.status !== 'completed' && order.status !== 'cancelled'

  const formattedTotalPrice =
    order && typeof order.totalPrice === 'number'
      ? order.totalPrice.toFixed(2)
      : parseFloat(String(order?.totalPrice || 0)).toFixed(2)

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6057] hover:text-[#D86A78] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to My Orders</span>
        </Link>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-md w-1/3" />
            <div className="h-20 bg-gray-200 rounded-2xl w-full" />
            <div className="h-40 bg-gray-200 rounded-2xl w-full" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-3xl p-10 border border-red-200 text-center max-w-md mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-900 mb-1">Order Not Found</h2>
            <p className="text-xs text-red-700 mb-6">
              The order identifier could not be retrieved. Please check your order history.
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A2E2B] text-white rounded-xl text-xs font-bold"
            >
              View Order History
            </Link>
          </div>
        )}

        {/* Order Detail Content */}
        {!isLoading && order && (
          <div className="space-y-6">
            {/* Header Banner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#3B2219]">
                    Order #{order.id}
                  </h1>
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge paymentStatus={order.paymentStatus} />
                </div>
                <p className="text-xs text-[#8C6057]">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Cancellation Action Button */}
              {isCancellable && (
                <button
                  type="button"
                  onClick={handleCancelClick}
                  disabled={cancelMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>{cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}</span>
                </button>
              )}
            </div>

            {/* Notification Messages */}
            {cancelErrorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{cancelErrorMsg}</span>
              </div>
            )}

            {cancelSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-3 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{cancelSuccessMsg}</span>
              </div>
            )}

            {/* Pickup Info Card */}
            <div className="bg-[#FAF2F0] border border-[#F3E2E0] rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#D86A78] flex items-center justify-center shadow-2xs shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#9E7A70] font-semibold block">Pickup Date</span>
                  <span className="text-sm font-extrabold text-[#3B2219]">{order.pickupDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#D86A78] flex items-center justify-center shadow-2xs shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#9E7A70] font-semibold block">Pickup Time Slot</span>
                  <span className="text-sm font-extrabold text-[#3B2219]">{order.pickupTime}</span>
                </div>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-6">
              <h3 className="text-lg font-black text-[#3B2219] border-b border-[#F7EFEF] pb-4">
                Order Items ({order.items?.length || 0})
              </h3>

              <div className="space-y-4">
                {order.items &&
                  order.items.map((item) => {
                    const imageUrl =
                      item.cake?.images && item.cake.images.length > 0
                        ? item.cake.images[0].url
                        : FALLBACK_CAKE_IMAGES[item.id % FALLBACK_CAKE_IMAGES.length]

                    const unitPriceFormatted =
                      typeof item.unitPrice === 'number'
                        ? item.unitPrice.toFixed(2)
                        : parseFloat(String(item.unitPrice || 0)).toFixed(2)

                    const lineTotalFormatted =
                      typeof item.totalPrice === 'number'
                        ? item.totalPrice.toFixed(2)
                        : parseFloat(String(item.totalPrice || 0)).toFixed(2)

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F5] border border-[#F3E2E0]"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <img
                            src={imageUrl}
                            alt={item.cakeName || 'Cake'}
                            className="w-16 h-16 rounded-2xl object-cover border border-[#EFE2E0] shrink-0"
                          />

                          <div className="space-y-1 min-w-0">
                            <h4 className="font-extrabold text-sm sm:text-base text-[#3B2219] truncate">
                              {item.cakeName || item.cake?.name || 'Artisanal Cake'}
                            </h4>

                            {/* Option Badges */}
                            {item.selectedValues && item.selectedValues.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {item.selectedValues.map((val) => (
                                  <span
                                    key={val.id}
                                    className="bg-white text-[#8C6057] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#F3E2E0] inline-flex items-center gap-1"
                                  >
                                    <Sparkles className="w-2.5 h-2.5 text-[#E87A84]" />
                                    {val.label}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Custom Notes */}
                            {item.notes && (
                              <div className="text-xs text-[#D86A78] italic flex items-center gap-1 pt-0.5">
                                <MessageSquare className="w-3 h-3 shrink-0" />
                                <span>"{item.notes}"</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFE2E0]">
                          <div className="text-xs text-[#8C6057]">
                            Qty: <strong className="text-[#3B2219]">{item.quantity}</strong> × ${unitPriceFormatted}
                          </div>
                          <div className="text-base font-black text-[#4A2E2B]">
                            ${lineTotalFormatted}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Order Total Footer */}
              <div className="pt-6 border-t-2 border-[#EAD7D5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#9E7A70] font-semibold block">Total Price</span>
                  <span className="text-2xl font-black text-[#4A2E2B]">
                    ${formattedTotalPrice}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#8C6057] block font-semibold">Payment Status</span>
                  <PaymentStatusBadge paymentStatus={order.paymentStatus} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
