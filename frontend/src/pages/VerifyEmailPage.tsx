/**
 * Verify Email page - Handles /verify-email#token=... links
 */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { SpinnerGap, CheckCircle, WarningCircle, EnvelopeSimple } from '@phosphor-icons/react'
import { verifyEmail } from '../api/auth'
import { ApiError } from '../api/client'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'

type VerifyState = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const { t } = useTranslation()
  const location = useLocation()
  // SECURITY: Read token from URL fragment so it isn't sent in HTTP requests
  const token = new URLSearchParams(location.hash.replace(/^#/, '')).get('token') || ''

  const [state, setState] = useState<VerifyState>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setState('error')
      setErrorMessage(t('auth.verifyEmail.invalidLink'))
      return
    }

    verifyEmail(token)
      .then(() => setState('success'))
      .catch((err) => {
        setState('error')
        if (err instanceof ApiError) {
          setErrorMessage(err.detail || t('auth.verifyEmail.invalidLink'))
        } else {
          setErrorMessage(t('auth.verifyEmail.invalidLink'))
        }
      })
  }, [token, t])

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-100">
      {/* Header */}
      <header className="bg-surface-0/80 dark:bg-surface-100/80 backdrop-blur-md border-b border-primary-100/50 dark:border-primary-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Sivee" className="w-9 h-9" />
            <span className="text-lg font-semibold text-primary-900 dark:text-white">
              {t('landing.appName')}
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="bg-surface-0/90 dark:bg-surface-200/90 backdrop-blur-xl rounded-2xl border border-primary-200/30 dark:border-primary-700/30 shadow-xl shadow-primary-900/5 dark:shadow-primary-950/20 p-6 sm:p-8 text-center">
            {state === 'loading' && (
              <div className="py-4 animate-fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-200 rounded-xl mb-4">
                  <SpinnerGap className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
                  {t('auth.verifyEmail.verifying')}
                </h2>
                <p className="text-sm text-primary-600 dark:text-primary-300">
                  {t('common.loading')}
                </p>
              </div>
            )}

            {state === 'success' && (
              <div className="py-4 animate-fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-success-100 dark:bg-success-500/20 rounded-xl mb-4">
                  <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
                  {t('auth.verifyEmail.success')}
                </h2>
                <p className="text-sm text-primary-600 dark:text-primary-300 mb-6">
                  {t('auth.verifyEmail.successMessage')}
                </p>
                <Link to="/" className="btn-brand inline-flex py-2 px-6">
                  {t('auth.login.button')}
                </Link>
              </div>
            )}

            {state === 'error' && (
              <div className="py-4 animate-fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-error-100 dark:bg-error-500/20 rounded-xl mb-4">
                  <WarningCircle className="w-6 h-6 text-error-600 dark:text-error-400" />
                </div>
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
                  {t('auth.verifyEmail.errorTitle')}
                </h2>
                <p className="text-sm text-primary-600 dark:text-primary-300 mb-6">
                  {errorMessage || t('auth.verifyEmail.invalidLink')}
                </p>
                <div className="flex flex-col gap-3">
                  <Link to="/" className="btn-brand inline-flex py-2 px-6 justify-center">
                    {t('auth.forgotPassword.backToLogin')}
                  </Link>
                  <p className="text-xs text-primary-400 dark:text-primary-500 flex items-center justify-center gap-1">
                    <EnvelopeSimple className="w-3.5 h-3.5" />
                    {t('auth.verifyEmail.expiredHint')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
