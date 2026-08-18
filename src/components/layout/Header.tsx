import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Cake, Calendar, User } from 'lucide-react'

export const Header: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/cakes' && location.pathname === '/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F4E6E4] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/cakes" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#D86A78] to-[#E87A84] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Cake className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-tight text-[#3B2219] group-hover:text-[#D86A78] transition-colors leading-none">
              Petal & Cocoa
            </span>
            <span className="text-[10px] font-semibold text-[#A88C85] tracking-widest uppercase mt-0.5">
              Cake Shop
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF2F0] p-1.5 rounded-full border border-[#F3E2E0]">
          <Link
            to="/cakes"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isActive('/cakes')
                ? 'bg-white text-[#D86A78] shadow-2xs'
                : 'text-[#6E4E46] hover:text-[#3B2219]'
            }`}
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Cake Catalog</span>
          </Link>

          <Link
            to="/rooms"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isActive('/rooms')
                ? 'bg-white text-[#D86A78] shadow-2xs'
                : 'text-[#6E4E46] hover:text-[#3B2219]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Birthday Rooms</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative p-2.5 rounded-2xl bg-[#FAF2F0] hover:bg-[#FCEAE8] text-[#4A2E2B] transition-colors border border-[#F3E2E0]"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#6E4E46]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D86A78] text-white text-[10px] font-black rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#4A2E2B] hover:bg-[#38221E] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
