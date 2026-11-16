import React from 'react'
import { Link } from 'react-router-dom'
import type { Room } from '../../../types/room'
import { Users, ArrowRight } from 'lucide-react'
import { SafeImage } from '../../../components/common/SafeImage'
import { formatPrice } from '../../../utils/currency'

interface RoomCardProps {
  room: Room
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const imageUrl = room.images && room.images.length > 0 ? room.images[0].url : undefined

  return (
    <Link
      to={`/rooms/${room.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-[#F4E6E4] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF2F0]">
        <SafeImage
          src={imageUrl}
          alt={room.name}
          roomId={room.id}
          fallbackType="room"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Capacity Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#6E3C33] border border-[#F3D5CF] shadow-xs flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#D86A78]" />
          Up to {room.capacity} Guests
        </span>

        {/* Status Badge */}
        {!room.isAvailable && (
          <span className="absolute top-3 right-3 bg-red-900/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            Under Maintenance
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#3B2219] group-hover:text-[#D86A78] transition-colors line-clamp-1">
            {room.name}
          </h3>
          <p className="mt-1.5 text-xs text-[#7C5C54] line-clamp-2 leading-relaxed">
            {room.description ||
              'A beautifully decorated private room for birthday celebrations, afternoon tea, and cake parties.'}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-4 border-t border-[#F7EFEF] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#9E7A70] block font-semibold">Reservation Rate</span>
            <span className="text-xl font-black text-[#4A2E2B]">
              {formatPrice(room.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#D86A78] group-hover:bg-[#FDF0F2] px-3.5 py-2 rounded-2xl transition-all">
            <span>View & Reserve</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
