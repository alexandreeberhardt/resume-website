/**
 * Change Email Modal - Update email + password for unverified accounts
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Loader2, AlertCircle, CheckCircle, Eye, EyeOff, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../api/client'

export default function ChangeEmailModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const { changeEmail } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Password validation - must match backend requirements (12 chars + special char)
  const passwordChecks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }
  const isPasswordValid = Object.values(passwordChecks).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const allChecksValid = isPasswordValid && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isPasswordValid) {
      setError(t('auth.errors.passwordRequirements'))
      return
    }

    if (!passwordsMatch) {
      setError(t('auth.errors.passwordMismatch'))
      return
    }

    setLoading(true)

    try {
      await changeEmail(email, password)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError(t('auth.errors.emailExists'))
        } else {
          setError(err.detail || t('auth.errors.generic'))
        }
      } else {
        setError(t('auth.errors.generic'))
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 backdrop-blur-sm p-4">
        <div className="bg-surface-0 rounded-2xl shadow-xl border border-primary-100/30 w-full max-w-md animate-fade-in">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-success-100 rounded-xl mb-4 animate-bounce-in">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <h2 className="text-xl font-semibold text-primary-900 mb-2">
              {t('auth.changeEmail.success')}
            </h2>
            <p className="text-sm text-primary-600">{t('auth.verifyEmail.checkEmail')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 backdrop-blur-sm p-4">
      <div className="bg-surface-0 rounded-2xl shadow-xl border border-primary-100/30 w-full max-w-md animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-primary-100/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary-900">
              {t('auth.changeEmail.title')}
            </h2>
            <p className="text-xs text-primary-500">{t('auth.changeEmail.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-5 p-3 bg-error-50 border border-error-200 rounded-xl flex items-center gap-3 animate-shake">
              <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-error-600" />
              </div>
              <p className="text-sm text-error-700 flex-1 min-w-0">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="change-email" className="label">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="change-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="input pl-10"
                  required
                  autoComplete="email"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="change-password" className="label">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="change-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="input pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="change-confirm-password" className="label">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="change-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  className="input pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-4">
              <p className="text-xs font-medium text-primary-700 mb-2">
                {t('auth.passwordRequirements')}
              </p>
              <div className="space-y-1.5">
                {Object.entries({
                  length: t('auth.passwordChecks.length'),
                  uppercase: t('auth.passwordChecks.uppercase'),
                  lowercase: t('auth.passwordChecks.lowercase'),
                  digit: t('auth.passwordChecks.digit'),
                  special: t('auth.passwordChecks.special'),
                }).map(([key, label]) => {
                  const passed = passwordChecks[key as keyof typeof passwordChecks]
                  return (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          passed ? 'bg-success-100 text-success-600' : 'bg-primary-100 text-primary-400'
                        }`}
                      >
                        {passed && <Check className="w-3 h-3" />}
                      </div>
                      <span className={passed ? 'text-success-700' : 'text-primary-600'}>
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <button type="submit" disabled={!allChecksValid || loading} className="btn-brand w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('auth.registering')}
                </>
              ) : (
                <>{t('auth.changeEmail.button')}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
