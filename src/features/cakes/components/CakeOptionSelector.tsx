import React from 'react'
import type { CakeOption } from '../../../types/cake'
import { Check } from 'lucide-react'

interface CakeOptionSelectorProps {
  options: CakeOption[]
  selectedOptionValues: Record<number, number>
  onSelectValue: (optionId: number, valueId: number) => void
}

export const CakeOptionSelector: React.FC<CakeOptionSelectorProps> = ({
  options,
  selectedOptionValues,
  onSelectValue,
}) => {
  if (!options || options.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const selectedValueId = selectedOptionValues[option.id]

        return (
          <div key={option.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-[#3B2219] flex items-center gap-1.5">
                <span>{option.name}</span>
                <span className="text-red-500 text-xs">*</span>
              </label>

              <span className="text-xs text-[#8C6057]">Select 1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {option.values.map((val) => {
                const isSelected = selectedValueId === val.id
                const modifier = parseFloat(String(val.priceModifier || '0'))
                const formattedModifier =
                  modifier > 0 ? `+$${modifier.toFixed(2)}` : 'Included'

                return (
                  <button
                    key={val.id}
                    type="button"
                    onClick={() => onSelectValue(option.id, val.id)}
                    className={`relative p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#D86A78] bg-[#FDF2F4] ring-2 ring-[#D86A78]/20 shadow-xs'
                        : 'border-[#EFE2E0] bg-white hover:bg-[#FAF5F4] hover:border-[#F3D1D5]'
                    }`}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-[#D86A78] bg-[#D86A78] text-white'
                            : 'border-[#D4C3C0] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <span
                        className={`text-xs sm:text-sm font-semibold transition-colors ${
                          isSelected ? 'text-[#3B2219]' : 'text-[#5C3F37]'
                        }`}
                      >
                        {val.label}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold shrink-0 px-2.5 py-1 rounded-full ${
                        isSelected
                          ? 'bg-[#D86A78]/15 text-[#D86A78]'
                          : modifier > 0
                          ? 'bg-[#FAF2F0] text-[#8C6057]'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {formattedModifier}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
