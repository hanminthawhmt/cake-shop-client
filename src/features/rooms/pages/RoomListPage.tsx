import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchRooms } from '../../../api/rooms'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { RoomCard } from '../components/RoomCard'
import { Sparkles, Calendar, Heart, AlertCircle } from 'lucide-react'

export const RoomListPage: React.FC = () => {
  const {
    data: rooms = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  })

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Birthday Room Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF5F5] via-[#FDF2F4] to-[#F7E6E8] rounded-3xl p-6 sm:p-10 mb-8 border border-[#F6DADC] shadow-xs">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-bold text-[#D86A78] border border-[#F3D1D5] mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D86A78]" />
              <span>Private Event & Birthday Reservations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3B2219] tracking-tight leading-tight">
              Host Unforgettable <br />
              <span className="text-[#D86A78]">Birthday Parties</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#6E4E46] leading-relaxed max-w-xl">
              Reserve our beautifully styled tea rooms for birthdays, family gatherings, and cake celebrations. Choose a date and time slot to book your space.
            </p>

            <div className="mt-5 flex items-center gap-4 text-xs font-semibold text-[#8C6057]">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[#E87A84] fill-[#E87A84]" />
                Decorated & Cleaned for Your Event
              </span>
              <span className="w-1 h-1 rounded-full bg-[#D4B5AF]" />
              <span>Fixed Daily Time Slots</span>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-[#F4E6E4] h-72 space-y-4">
                <div className="aspect-[16/10] bg-gray-200 rounded-2xl w-full" />
                <div className="h-6 bg-gray-200 rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 rounded-md w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto my-8 space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-red-900">
                Unable to Load Birthday Rooms
              </h3>
              <p className="text-xs text-red-700">
                Please check your network connection or allow a moment if the backend server is waking up.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>{isFetching ? 'Connecting to Server...' : 'Retry Connecting'}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && rooms.length === 0 && (
          <div className="bg-white rounded-3xl p-10 border border-[#F4E6E4] text-center max-w-md mx-auto my-8 space-y-3">
            <div className="w-14 h-14 bg-[#FDF0F2] rounded-full flex items-center justify-center mx-auto text-[#D86A78]">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-[#3B2219]">No Rooms Available</h3>
            <p className="text-xs text-[#7C5C54]">
              Our birthday rooms are currently being updated. Please check back soon!
            </p>
          </div>
        )}

        {/* Rooms Grid */}
        {!isLoading && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
