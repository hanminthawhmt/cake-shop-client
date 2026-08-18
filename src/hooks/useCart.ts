import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from '../api/cart'
import type { AddCartItemDto, UpdateCartItemDto } from '../types/cart'

export function useCart() {
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  // Query cart data
  const {
    data: cart,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: isLoggedIn,
    staleTime: 1000 * 60, // 1 minute
  })

  // Calculate total item count in cart
  const totalCount =
    cart && cart.items
      ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0

  // Add Item Mutation
  const addItemMutation = useMutation({
    mutationFn: (dto: AddCartItemDto) => addCartItem(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // Update Item Mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCartItemDto }) =>
      updateCartItem(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // Remove Item Mutation
  const removeItemMutation = useMutation({
    mutationFn: (id: number) => deleteCartItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // Clear Cart Mutation
  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  return {
    cart,
    totalCount,
    isLoading: isLoggedIn ? isLoading : false,
    isError,
    refetch,
    addItem: addItemMutation.mutateAsync,
    isAdding: addItemMutation.isPending,
    updateItem: updateItemMutation.mutateAsync,
    isUpdating: updateItemMutation.isPending,
    removeItem: removeItemMutation.mutateAsync,
    isRemoving: removeItemMutation.isPending,
    clearAll: clearCartMutation.mutateAsync,
    isClearing: clearCartMutation.isPending,
  }
}
