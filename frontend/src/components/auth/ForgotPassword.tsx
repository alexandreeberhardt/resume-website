/**
 * Forgot Password component - Request password reset email
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Mail, KeyRound, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { forgotPassword } from '../../api/auth'

interface ForgotPasswordProps {
  onSwitchToLogin: () => void
}

export default function ForgotPassword({ onSwitchToLogin }: ForgotPasswordProps) {
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      setError(t('auth.errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-200 rounded-xl mb-4">
          <KeyRound className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-primary-900 dark:text-white mb-1.5 tracking-tight">
          {t('auth.forgotPassword.title')}
        </h2>
        <p className="text-sm text-black dark:text-white">{t('auth.forgotPassword.subtitle')}</p>
      </div>

      {sent ? (
        /* Success message */
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-primary-700 dark:text-primary-300">
            {t('auth.forgotPassword.successMessage')}
          </p>
          <button
            onClick={onSwitchToLogin}
            className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('auth.forgotPassword.backToLogin')}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Error message */}
          {error && (
            <div className="mb-5 p-3 bg-error-50 dark:bg-error-100/20 border border-error-200 dark:border-error-500/30 rounded-xl flex items-center gap-3 animate-shake">
              <div className="w-8 h-8 bg-error-100 dark:bg-error-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-error-600 dark:text-error-500" />
              </div>
              <p className="text-sm text-error-700 dark:text-error-400 flex-1 min-w-0">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="reset-email" className="label">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="input pl-10"
                  required
                  autoComplete="email"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 dark:text-primary-500" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-brand w-full py-3 mt-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('auth.forgotPassword.sending')}</span>
                </>
              ) : (
                <span>{t('auth.forgotPassword.button')}</span>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-sm font-medium text-brand hover:text-brand-hover transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('auth.forgotPassword.backToLogin')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
