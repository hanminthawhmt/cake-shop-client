import React from 'react'
import { Cake, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3B2219] text-[#F3E2E0] pt-12 pb-8 border-t border-[#4A2E2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#52332A]">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D86A78] flex items-center justify-center text-white">
                <Cake className="w-4 h-4" />
              </div>
              <span className="font-black text-lg text-white">Petal & Cocoa</span>
            </div>
            <p className="text-xs text-[#C4A8A1] leading-relaxed max-w-sm">
              Artisanal cakes and birthday celebration room experiences crafted with care and premium organic ingredients.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore Storefront
            </h4>
            <ul className="space-y-2 text-xs text-[#C4A8A1]">
              <li>
                <a href="/cakes" className="hover:text-white transition-colors">
                  Full Cake Catalog
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-white transition-colors">
                  Birthday Room Reservations
                </a>
              </li>
            </ul>
          </div>

          {/* Bakery info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Opening Hours & Pickup
            </h4>
            <p className="text-xs text-[#C4A8A1] leading-relaxed">
              Monday – Sunday: 8:00 AM – 7:00 PM <br />
              Pre-order pickup cutoff: 1 day in advance.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A88C85]">
          <p>© {new Date().getFullYear()} Petal & Cocoa Cake Shop. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#D86A78] fill-[#D86A78]" /> for cake lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
