import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Header } from '../../../components/layout/Header'
import { Footer } from '../../../components/layout/Footer'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'

export const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(true)

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get('token') || searchParams.get('accessToken') || searchParams.get('access_token')
      const paramError = searchParams.get('error')

      if (paramError) {
        setErrorMessage(paramError)
        setIsProcessing(false)
        return
      }

      if (!token) {
        setErrorMessage('No authentication token received from Google sign-in.')
        setIsProcessing(false)
        return
      }

      try {
        await loginWithToken(token)

        // Determine redirect target
        const savedRedirect = localStorage.getItem('petal_cocoa_google_redirect')
        const urlRedirect = searchParams.get('redirect')
        const targetPath = savedRedirect || urlRedirect || '/cakes'

        // Clean up temporary key
        localStorage.removeItem('petal_cocoa_google_redirect')

        // Redirect user
        navigate(targetPath, { replace: true })
      } catch (err: any) {
        console.error('Failed to complete Google sign-in:', err)
        setErrorMessage('Failed to authenticate your account token. Please try again.')
        setIsProcessing(false)
      }
    }

    processCallback()
  }, [searchParams, loginWithToken, navigate])

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-[#3B2219] font-sans antialiased">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F4E6E4] shadow-xs max-w-md w-full text-center space-y-6">
          {isProcessing && !errorMessage ? (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 bg-[#FDF0F2] rounded-full flex items-center justify-center mx-auto text-[#D86A78] shadow-2xs">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[#3B2219]">Signing You In...</h2>
                <p className="text-xs text-[#7C5C54]">
                  Completing your Google authentication. Redirecting in just a moment...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-2xs">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-red-950">Google Sign-In Failed</h2>
                <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                  {errorMessage || 'Something went wrong during Google sign-in. Please try again.'}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full py-3.5 px-4 bg-[#4A2E2B] hover:bg-[#38221E] text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
