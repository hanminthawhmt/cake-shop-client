import React, { useState, useEffect } from 'react'
import type { User } from '../../../types/auth'
import { updateUserInfoApi } from '../../../api/user'
import { useAuth } from '../../../context/AuthContext'
import { User as UserIcon, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Sparkles, Save } from 'lucide-react'

interface ProfileInfoFormProps {
  user: User | null
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ user }) => {
  const { refreshUser } = useAuth()

  const initialPhone = user?.phone || user?.profile?.phone || ''
  const initialAddress = user?.address || user?.profile?.address || ''

  const [phone, setPhone] = useState(initialPhone)
  const [address, setAddress] = useState(initialAddress)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    setPhone(user?.phone || user?.profile?.phone || '')
    setAddress(user?.address || user?.profile?.address || '')
  }, [user])

  const isEmptyInfo = !initialPhone && !initialAddress

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      setIsSubmitting(true)
      await updateUserInfoApi({
        phone: phone.trim() !== '' ? phone.trim() : undefined,
        address: address.trim() !== '' ? address.trim() : undefined,
      })

      await refreshUser()
      setSuccessMsg('Your contact information has been updated successfully!')

      setTimeout(() => {
        setSuccessMsg(null)
      }, 5000)
    } catch (err: any) {
      console.error('Failed to update profile info:', err)
      const text =
        err?.response?.data?.message ||
        'Failed to update profile info. Please check your inputs and try again.'
      setErrorMsg(Array.isArray(text) ? text.join(', ') : text)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-6">
      <div className="border-b border-[#F7EFEF] pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#3B2219]">Contact Information</h2>
          <p className="text-xs text-[#8C6057]">
            Update your phone and delivery address for storefront pickups and notifications.
          </p>
        </div>
        <span className="text-xs font-bold text-[#D86A78] bg-[#FDF0F2] px-3 py-1 rounded-full border border-[#F6DADC]">
          Account Info
        </span>
      </div>

      {/* Empty Info Alert Banner */}
      {isEmptyInfo && (
        <div className="bg-[#FFF5F6] border border-[#F3D1D5] p-4 rounded-2xl text-xs text-[#8C4A52] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#D86A78]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Your Profile</span>
          </div>
          <p className="leading-normal">
            You haven’t added a phone number or address yet. Add your contact info below for faster storefront pickups!
          </p>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-2.5 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Read-Only Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6E4E46] block">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              value={user?.name || ''}
              className="w-full pl-10 pr-4 py-3 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#7C5C54] cursor-not-allowed font-semibold opacity-90"
            />
          </div>
          <span className="text-[11px] text-[#A88C85]">Full name is linked to your account.</span>
        </div>

        {/* Read-Only Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6E4E46] block">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              readOnly
              value={user?.email || ''}
              className="w-full pl-10 pr-4 py-3 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#7C5C54] cursor-not-allowed font-semibold opacity-90"
            />
          </div>
          <span className="text-[11px] text-[#A88C85]">Email address cannot be modified.</span>
        </div>

        {/* Editable Phone */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-[#6E4E46] block">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+95912345678"
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
            />
          </div>
        </div>

        {/* Editable Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6E4E46] block">Default Address</label>
          <div className="relative">
            <div className="absolute top-3.5 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
              <MapPin className="w-4 h-4" />
            </div>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Main Street, Yangon"
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-[#4A2E2B] hover:bg-[#38221E] disabled:bg-gray-300 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#E87A84]" />
            <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
