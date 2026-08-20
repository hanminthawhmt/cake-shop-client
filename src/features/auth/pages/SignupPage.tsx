import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { Cake, UserPlus, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'

export const SignupPage: React.FC = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirectPath = searchParams.get('redirect') || '/cakes'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGoogleSignIn = () => {
    if (redirectPath) {
      localStorage.setItem('petal_cocoa_google_redirect', redirectPath)
    }
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    window.location.href = `${backendUrl}/auth/google`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    try {
      setIsSubmitting(true)
      await signup({ name, email, password })
      navigate(redirectPath, { replace: true })
    } catch (err: any) {
      console.error('Signup error:', err)
      const message =
        err?.response?.data?.message ||
        'Registration failed. Please check your details or try a different email address.'
      setErrorMsg(Array.isArray(message) ? message.join(', ') : message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#F4E6E4] shadow-xs space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D86A78] to-[#E87A84] flex items-center justify-center text-white mx-auto shadow-xs">
              <Cake className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B2219]">Create Account</h1>
            <p className="text-xs sm:text-sm text-[#7C5C54]">
              Join Petal & Cocoa to order custom cakes, track purchases, and reserve birthday rooms.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm font-bold text-[#3B2219] flex items-center justify-center gap-3 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#F7EFEF] w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-[#A88C85] uppercase tracking-wider absolute">
              or email
            </span>
          </div>

          {/* Alert Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-2xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6E4E46] block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6E4E46] block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6E4E46] block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E7A70]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F5] border border-[#EFE2E0] rounded-2xl text-xs sm:text-sm text-[#3B2219] placeholder-[#A88C85] focus:outline-hidden focus:ring-2 focus:ring-[#E87A84]/40 focus:border-[#E87A84] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#4A2E2B] hover:bg-[#38221E] disabled:bg-gray-300 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          {/* Footer link to Login */}
          <div className="pt-4 border-t border-[#F7EFEF] text-center text-xs text-[#7C5C54]">
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-bold text-[#D86A78] hover:underline inline-flex items-center gap-1"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
