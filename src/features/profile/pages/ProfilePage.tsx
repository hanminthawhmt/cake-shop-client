import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { ProfileInfoForm } from '../components/ProfileInfoForm'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { User as UserIcon } from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { user, isLoggedIn, isLoading } = useAuth()
  const location = useLocation()

  // Protect route
  if (!isLoading && !isLoggedIn) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FDF0F2] text-[#D86A78] text-xs font-bold px-3 py-1 rounded-full border border-[#F6DADC] mb-2">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Customer Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3B2219]">
            Account & Security Settings
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#7C5C54]">
            Manage your storefront profile details, contact preferences, and security password.
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] h-64" />
            <div className="bg-white rounded-3xl p-8 border border-[#F4E6E4] h-64" />
          </div>
        )}

        {/* Account Cards */}
        {!isLoading && (
          <div className="space-y-8">
            <ProfileInfoForm user={user} />
            <ChangePasswordForm />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
