import React from 'react'

interface CakePriceSummaryProps {
  basePrice: number
  selectedModifiers: Array<{ label: string; price: number }>
  quantity: number
  unitPrice: number
  totalPrice: number
}

export const CakePriceSummary: React.FC<CakePriceSummaryProps> = ({
  basePrice,
  selectedModifiers,
  quantity,
  unitPrice,
  totalPrice,
}) => {
  return (
    <div className="bg-[#FAF2F0] border border-[#F3E2E0] rounded-2xl p-4 sm:p-5 space-y-3">
      <h4 className="text-xs font-extrabold text-[#4A2E2B] uppercase tracking-wider">
        Price Breakdown
      </h4>

      <div className="space-y-1.5 text-xs text-[#7C5C54]">
        <div className="flex justify-between items-center">
          <span>Base Price</span>
          <span className="font-semibold text-[#3B2219]">${basePrice.toFixed(2)}</span>
        </div>

        {selectedModifiers.map((mod, idx) => (
          <div key={idx} className="flex justify-between items-center pl-2 border-l-2 border-[#E87A84]/40">
            <span className="truncate pr-2">{mod.label}</span>
            <span className="font-semibold text-[#D86A78]">
              {mod.price > 0 ? `+$${mod.price.toFixed(2)}` : '+$0.00'}
            </span>
          </div>
        ))}

        <div className="pt-2 border-t border-[#EFE2E0] flex justify-between items-center font-medium">
          <span>Unit Price</span>
          <span className="font-bold text-[#3B2219]">${unitPrice.toFixed(2)}</span>
        </div>

        {quantity > 1 && (
          <div className="flex justify-between items-center">
            <span>Quantity ({quantity}x)</span>
            <span className="font-semibold text-[#8C6057]">
              ${unitPrice.toFixed(2)} × {quantity}
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t-2 border-[#EAD7D5] flex items-center justify-between">
        <span className="text-sm font-black text-[#3B2219]">Total Running Price</span>
        <span className="text-2xl font-black text-[#4A2E2B]">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
