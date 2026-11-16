import React, { useState } from 'react'
import type { CartItem } from '../../../types/cart'
import { Trash2, Minus, Plus, Edit2, Check, X, Sparkles, MessageSquare } from 'lucide-react'
import { SafeImage } from '../../../components/common/SafeImage'
import { formatPrice } from '../../../utils/currency'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (id: number, newQuantity: number) => Promise<void>
  onUpdateNotes: (id: number, newNotes: string) => Promise<void>
  onRemove: (id: number) => Promise<void>
  isPending?: boolean
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onUpdateNotes,
  onRemove,
  isPending = false,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [editedNotes, setEditedNotes] = useState(item.notes || '')

  const imageUrl = item.cake.images && item.cake.images.length > 0 ? item.cake.images[0].url : undefined

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleQuantityIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }

  const handleSaveNotes = async () => {
    await onUpdateNotes(item.id, editedNotes)
    setIsEditingNotes(false)
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#F4E6E4] shadow-2xs transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
      {/* Product Information */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative aspect-square w-20 sm:w-24 rounded-2xl overflow-hidden bg-[#FAF2F0] shrink-0 border border-[#F3E2E0]">
          <SafeImage
            src={imageUrl}
            alt={item.cake.name}
            cakeId={item.cake.id}
            fallbackType="cake"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1 min-w-0">
          <h3 className="font-extrabold text-base sm:text-lg text-[#3B2219] truncate">
            {item.cake.name}
          </h3>

          {/* Selected Option Values */}
          {item.selectedValues && item.selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {item.selectedValues.map((val) => (
                <span
                  key={val.id}
                  className="inline-flex items-center gap-1 bg-[#FAF2F0] text-[#8C6057] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#F3E2E0]"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#E87A84]" />
                  {val.label}
                  {parseFloat(String(val.priceModifier || '0')) > 0
                    ? ` (+${formatPrice(val.priceModifier)})`
                    : ''}
                </span>
              ))}
            </div>
          )}

          {/* Notes display & editing */}
          <div className="pt-1 text-xs text-[#7C5C54]">
            {isEditingNotes ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="E.g., Happy Birthday Chloe!"
                  maxLength={150}
                  className="px-3 py-1 bg-[#FAF2F0] border border-[#EAD7D5] rounded-xl text-xs text-[#3B2219] focus:outline-hidden focus:border-[#D86A78] flex-1"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="p-1.5 bg-[#4A2E2B] text-white rounded-lg hover:bg-[#38221E] transition-colors"
                  aria-label="Save notes"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditedNotes(item.notes || '')
                    setIsEditingNotes(false)
                  }}
                  className="p-1.5 bg-gray-200 text-[#3B2219] rounded-lg hover:bg-gray-300 transition-colors"
                  aria-label="Cancel editing notes"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="italic text-[#9E7A70] flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {item.notes ? `"${item.notes}"` : 'No special note added'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(true)}
                  className="text-[#D86A78] hover:text-[#B54E5C] text-[11px] font-semibold inline-flex items-center gap-0.5 underline cursor-pointer"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  Edit note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quantity & Price Controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F4E6E4]">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-1 bg-[#FAF2F0] border border-[#F3E2E0] rounded-2xl p-1">
          <button
            type="button"
            onClick={handleQuantityDecrease}
            disabled={item.quantity <= 1 || isPending}
            className="w-7 h-7 rounded-xl bg-white text-[#3B2219] flex items-center justify-center shadow-2xs hover:bg-[#FAF5F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="w-8 text-center text-xs font-bold text-[#3B2219]">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={handleQuantityIncrease}
            disabled={isPending}
            className="w-7 h-7 rounded-xl bg-white text-[#3B2219] flex items-center justify-center shadow-2xs hover:bg-[#FAF5F4] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Price Breakdown */}
        <div className="text-right">
          <div className="text-xs text-[#9E7A70]">
            {formatPrice(item.unitPrice)} each
          </div>
          <div className="text-lg font-black text-[#4A2E2B]">
            {formatPrice(item.lineTotal)}
          </div>
        </div>

        {/* Delete Action */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isPending}
          className="p-2 rounded-xl text-[#A88C85] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          aria-label="Remove item from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
