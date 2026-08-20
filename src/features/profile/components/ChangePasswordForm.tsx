import React, { useState } from 'react'
import { changePasswordApi } from '../../../api/user'
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react'

export const ChangePasswordForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg(null)
    setErrorMsg(null)

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please complete all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation password do not match.')
      return
    }

    try {
      setIsSubmitting(true)
      await changePasswordApi({
        oldPassword,
        newPassword,
      })

      // Success
      setSuccessMsg('Your password has been changed successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        setSuccessMsg(null)
      }, 5000)
    } catch (err: any) {
      console.error('Failed to change password:', err)
      const text =
        err?.response?.data?.message ||
        'Failed to change password. Please check your current password and try again.'
      setErrorMsg(Array.isArray(text) ? text.join(', ') : text)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-6">
      <div className="border-b border-[#F7EFEF] pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#3B2219]">Security & Password</h2>
          <p className="text-xs text-[#8C6057]">
            Update your account password to keep your account secure.
          </p>
        </div>
        <span className="text-xs font-bold text-[#D86A78] bg-[#FDF0F2] px-3 py-1 rounded-full border border-[#F6DADC]">
          Security
        </span>
      </div>

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
        {/* Old Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6E4E46] block">Current Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6E4E46] block">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
            />
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#6E4E46] block">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
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
            <ShieldCheck className="w-4 h-4 text-[#E87A84]" />
            <span>{isSubmitting ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
