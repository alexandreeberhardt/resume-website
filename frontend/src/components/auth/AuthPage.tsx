/**
 * Authentication page - Modern split-screen design
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EnvelopeSimple } from '@phosphor-icons/react'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import ThemeToggle from '../ThemeToggle'
import LanguageSwitcher from '../LanguageSwitcher'
import { resendVerification } from '../../api/auth'

type AuthMode = 'login' | 'register' | 'forgot-password' | 'check-email'

interface AuthPageProps {
  onContinueWithoutAuth?: () => void
}

export default function AuthPage({ onContinueWithoutAuth }: AuthPageProps) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<AuthMode>('login')
  const [pendingEmail, setPendingEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  const handleRegistered = (email: string) => {
    setPendingEmail(email)
    setResendSent(false)
    setMode('check-email')
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await resendVerification(pendingEmail)
      setResendSent(true)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-[#eef2f7]">
        {/* Studio lighting radial */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 50% at 50% 45%, rgba(255,255,255,0.75) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-8 xl:p-10 w-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/logo.png" alt="Sivee" className="w-9 h-9" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">sivee.pro</span>
          </div>

          {/* Hero text */}
          <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-slate-900 leading-tight mb-4 text-center">
            {t('auth.brandingTitle') || 'Fini Word et Canva. Voici le CV qui se met en page tout seul.'}
          </h1>

          {/* Floating CVs - side by side with overlap */}
          <div className="flex-1 relative min-h-0 flex items-center justify-center">
            <div className="relative w-full max-w-[500px] xl:max-w-[560px] aspect-[4/3]">
              {/* CV 1 - left, tilted back */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-[6deg] rounded-lg overflow-hidden z-10 w-[52%]"
                style={{
                  boxShadow:
                    '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 12px 24px -8px rgba(15, 23, 42, 0.12)',
                }}
              >
                <img
                  src="/Alexandre.png"
                  alt="CV Example 1"
                  className="w-full h-auto block"
                />
              </div>

              {/* CV 2 - right, tilted opposite, overlapping */}
              <div
                className="absolute right-0 top-1/2 -translate-y-[45%] rotate-[5deg] rounded-lg overflow-hidden z-20 w-[52%]"
                style={{
                  boxShadow:
                    '0 30px 60px -15px rgba(15, 23, 42, 0.30), 0 15px 30px -10px rgba(15, 23, 42, 0.15)',
                }}
              >
                <img
                  src="/Alexandre_2.png"
                  alt="CV Example 2"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* Bottom features */}
          <div className="flex items-end justify-between pt-4 gap-6">
            <div className="flex flex-col gap-3">
              {[
                t('auth.feature1') || 'Des modèles approuvés par les recruteurs.',
                t('auth.feature2') || 'Déposez votre ancien CV, Sivee s\'occupe du reste.',
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                  <span className="text-sm xl:text-base font-semibold text-slate-600 leading-snug">
                    {text}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col bg-surface-50 dark:bg-surface-100 relative overflow-y-auto">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Mobile Header */}
        <header className="lg:hidden relative z-10 bg-surface-0/80 dark:bg-surface-100/80 backdrop-blur-md border-b border-primary-100/50 dark:border-primary-800/50">
          <div className="px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Sivee" className="w-9 h-9" />
              <span className="text-lg font-semibold text-primary-900 dark:text-white">
                {t('landing.appName')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Desktop header with theme/language toggles */}
        <div className="hidden lg:flex justify-end gap-1.5 p-3 relative z-10">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6 relative z-10">
          <div className="w-full max-w-[400px]">
            {/* Glass card container */}
            <div className="bg-surface-0/90 dark:bg-surface-200/90 backdrop-blur-xl rounded-2xl border border-primary-200/30 dark:border-primary-700/30 shadow-xl shadow-primary-900/5 dark:shadow-primary-950/20 p-5 sm:p-6">
              {/* Animated content */}
              <div key={mode} className="animate-fade-in">
                {mode === 'login' ? (
                  <Login
                    onSwitchToRegister={() => setMode('register')}
                    onSwitchToForgotPassword={() => setMode('forgot-password')}
                  />
                ) : mode === 'register' ? (
                  <Register
                    onSwitchToLogin={() => setMode('login')}
                    onRegistered={handleRegistered}
                  />
                ) : mode === 'check-email' ? (
                  <div className="w-full text-center py-2 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl mb-4">
                      <EnvelopeSimple className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
                      {t('auth.verifyEmail.checkEmail')}
                    </h2>
                    <p className="text-sm text-primary-600 dark:text-primary-300 mb-1">
                      {t('auth.verifyEmail.checkEmailMessage')}
                    </p>
                    <p className="text-sm font-medium text-primary-900 dark:text-white mb-6">
                      {pendingEmail}
                    </p>
                    {resendSent ? (
                      <p className="text-sm text-success-600 dark:text-success-400 mb-4">
                        {t('auth.verifyEmail.resendSuccess')}
                      </p>
                    ) : (
                      <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="btn-secondary w-full mb-4"
                      >
                        {resendLoading ? t('common.loading') : t('auth.verifyEmail.resend')}
                      </button>
                    )}
                    <button
                      onClick={() => setMode('login')}
                      className="text-sm text-brand hover:text-brand-hover transition-colors font-medium"
                    >
                      {t('auth.forgotPassword.backToLogin')}
                    </button>
                  </div>
                ) : (
                  <ForgotPassword onSwitchToLogin={() => setMode('login')} />
                )}
              </div>
            </div>

            {/* Optional: Continue without account */}
            {onContinueWithoutAuth && (
              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary-200/50 dark:border-primary-700/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-surface-50 dark:bg-surface-200 text-primary-400 dark:text-white text-xs">
                      {t('auth.or') || 'ou'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onContinueWithoutAuth}
                  data-testid="continue-without-account"
                  className="mt-3 text-sm text-primary-500 dark:text-white hover:text-brand transition-colors font-medium"
                >
                  {t('auth.continueWithoutAccount') || 'Continuer sans compte'}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-4 text-center lg:hidden relative z-10">
          <a
            href="https://github.com/alexandreeberhardt/sivee.pro/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-400 dark:text-primary-500 hover:text-primary-600 transition-colors"
          >
            {t('landing.openSource')}
          </a>
        </footer>
      </div>
    </div>
  )
}
