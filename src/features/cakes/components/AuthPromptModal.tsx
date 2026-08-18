import React from 'react'
import { Link } from 'react-router-dom'
import { LogIn, X, ShoppingBag, UserPlus } from 'lucide-react'

interface AuthPromptModalProps {
  isOpen: boolean
  onClose: () => void
  cakeName: string
  returnPath: string
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  cakeName,
  returnPath,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#F4E6E4] shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#9E7A70] hover:text-[#3B2219] hover:bg-[#FAF2F0] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-[#FDF0F2] rounded-2xl flex items-center justify-center text-[#D86A78] mx-auto mb-5 shadow-xs">
          <ShoppingBag className="w-7 h-7" />
        </div>

        <div className="text-center space-y-2 mb-6">
          <h3 className="text-xl font-black text-[#3B2219]">Sign In Required</h3>
          <p className="text-xs sm:text-sm text-[#7C5C54] leading-relaxed">
            Please sign in to your Petal & Cocoa account to add <span className="font-bold text-[#D86A78]">"{cakeName}"</span> to your cart and customize your order.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to={`/login?redirect=${encodeURIComponent(returnPath)}`}
            className="w-full py-3.5 px-4 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <Link
            to={`/signup?redirect=${encodeURIComponent(returnPath)}`}
            className="w-full py-3 px-4 bg-white border border-[#EFE2E0] hover:bg-[#FDF6F7] text-[#6E4E46] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4 text-[#D86A78]" />
            <span>Create New Account</span>
          </Link>
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#9E7A70] hover:text-[#4A2E2B] transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  )
}
