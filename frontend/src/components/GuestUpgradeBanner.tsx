/**
 * Guest Upgrade Banner - Floating banner for guest users to create a permanent account
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  X,
  UserPlus,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Check,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../api/client'

export default function GuestUpgradeBanner() {
  const { t } = useTranslation()
  // Removed unused 'upgradeAccount' from destructuring
  const { isGuest } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Don't show if not a guest or if dismissed
  if (!isGuest || dismissed) {
    return null
  }

  return (
    <>
      {/* Floating Banner */}
      <div className="fixed bottom-20 lg:bottom-5 left-5 right-5 lg:left-auto lg:right-5 lg:w-96 z-40 animate-slide-up">
        <div className="bg-gradient-to-r from-brand to-indigo-600 rounded-2xl shadow-xl shadow-brand/30 p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-0.5">{t('guest.upgradeBannerTitle')}</h3>
              <p className="text-xs text-white/80 mb-3">{t('guest.upgradeBannerDesc')}</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-brand font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
              >
                {t('guest.createAccount')}
              </button>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}
    </>
  )
}

function UpgradeModal({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const { upgradeAccount } = useAuth()
  const isFrench = i18n.language.startsWith('fr')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
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
  const allChecksValid = isPasswordValid && passwordsMatch && acceptedTerms

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
      await upgradeAccount(email, password)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
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
        <div className="bg-surface-0 dark:bg-surface-200 rounded-2xl shadow-xl border border-primary-100/30 dark:border-primary-700/30 w-full max-w-md animate-fade-in">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-success-100 dark:bg-success-500/20 rounded-xl mb-4 animate-bounce-in">
              <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
              {t('guest.upgradeSuccess')}
            </h2>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              {t('guest.upgradeSuccessDesc')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 backdrop-blur-sm p-4">
      <div className="bg-surface-0 dark:bg-surface-200 rounded-2xl shadow-xl border border-primary-100/30 dark:border-primary-700/30 w-full max-w-md animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary-100/50 dark:border-primary-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-700/50 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">
                {t('guest.createAccount')}
              </h2>
              <p className="text-xs text-primary-500 dark:text-primary-400">
                {t('guest.upgradeModalSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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
            {/* Email field */}
            <div className="form-group">
              <label htmlFor="upgrade-email" className="label">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="upgrade-email"
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

            {/* Password field */}
            <div className="form-group">
              <label htmlFor="upgrade-password" className="label">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="upgrade-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="input pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 dark:text-primary-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary-400 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password requirements */}
              {password && (
                <div className="mt-2.5 p-2.5 bg-primary-50 dark:bg-primary-700/30 rounded-lg border border-primary-100 dark:border-primary-700/50">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
                    <PasswordCheck
                      passed={passwordChecks.length}
                      label={t('auth.passwordRules.length')}
                    />
                    <PasswordCheck
                      passed={passwordChecks.uppercase}
                      label={t('auth.passwordRules.uppercase')}
                    />
                    <PasswordCheck
                      passed={passwordChecks.lowercase}
                      label={t('auth.passwordRules.lowercase')}
                    />
                    <PasswordCheck
                      passed={passwordChecks.digit}
                      label={t('auth.passwordRules.digit')}
                    />
                    <PasswordCheck
                      passed={passwordChecks.special}
                      label={t('auth.passwordRules.special')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password field */}
            <div className="form-group">
              <label htmlFor="upgrade-confirm-password" className="label">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="upgrade-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  className={`input pl-10 pr-10 ${
                    confirmPassword && !passwordsMatch
                      ? 'border-error-300 focus:border-error-400 focus:ring-error-100 dark:focus:ring-error-900/30'
                      : confirmPassword && passwordsMatch
                        ? 'border-success-300 focus:border-success-400 focus:ring-success-100 dark:focus:ring-success-900/30'
                        : ''
                  }`}
                  required
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 dark:text-primary-500" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary-400 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1.5 text-xs text-error-600 dark:text-error-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {t('auth.errors.passwordMismatch')}
                </p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="mt-1.5 text-xs text-success-600 dark:text-success-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t('auth.passwordsMatch') || 'Passwords match'}
                </p>
              )}
            </div>

            {/* Terms acceptance checkbox */}
            <div className="form-group">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                      acceptedTerms
                        ? 'bg-brand border-brand'
                        : 'border-primary-300 dark:border-primary-600 group-hover:border-primary-400'
                    }`}
                  >
                    {acceptedTerms && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-primary-700 dark:text-primary-300 leading-relaxed">
                  {isFrench ? (
                    <>
                      J'accepte les{' '}
                      <Link to="/cgu" className="text-brand hover:underline" target="_blank">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link
                        to="/politique-confidentialite"
                        className="text-brand hover:underline"
                        target="_blank"
                      >
                        politique de confidentialit&eacute;
                      </Link>
                    </>
                  ) : (
                    <>
                      I accept the{' '}
                      <Link to="/terms" className="text-brand hover:underline" target="_blank">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy-policy"
                        className="text-brand hover:underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                    </>
                  )}
                </span>
              </label>
            </div>

            {/* Submit button */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || !allChecksValid}
                className="btn-brand flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('auth.registering')}</span>
                  </>
                ) : (
                  <span>{t('guest.createAccount')}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function PasswordCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[11px] transition-all duration-200 ${
        passed ? 'text-success-600 dark:text-success-400' : 'text-primary-500 dark:text-primary-400'
      }`}
    >
      <div
        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-200 ${
          passed ? 'bg-success-500 text-white' : 'bg-primary-200 dark:bg-primary-600'
        }`}
      >
        {passed && <Check className="w-2.5 h-2.5" />}
      </div>
      <span>{label}</span>
    </div>
  )
}
