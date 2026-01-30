/**
 * Register component - Modern design
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Mail, Lock, UserPlus, AlertCircle, CheckCircle, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const { t } = useTranslation();
  const { register, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Password validation
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const allChecksValid = isPasswordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError(t('auth.errors.passwordRequirements'));
      return;
    }

    if (!passwordsMatch) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      await register({ email, password });
      setSuccess(true);

      // Auto-login after successful registration
      setTimeout(async () => {
        try {
          await login({ email, password });
        } catch {
          onSwitchToLogin();
        }
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setError(t('auth.errors.emailExists'));
        } else {
          setError(err.detail || t('auth.errors.generic'));
        }
      } else {
        setError(t('auth.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-full shadow-lg shadow-success-500/30 mb-6 animate-bounce-in">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-3">
          {t('auth.register.success')}
        </h2>
        <p className="text-primary-600 mb-6">{t('auth.register.successMessage')}</p>
        <div className="flex items-center justify-center gap-2 text-brand">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">{t('auth.loggingIn')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand to-brand/80 rounded-2xl shadow-lg shadow-brand/25 mb-6">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-2">
          {t('auth.register.title')}
        </h2>
        <p className="text-primary-500">
          {t('auth.register.subtitle')}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-start gap-3 animate-shake">
          <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-error-600" />
          </div>
          <div className="flex-1 pt-1">
            <p className="text-sm font-medium text-error-800">{t('auth.errors.title') || 'Erreur'}</p>
            <p className="text-sm text-error-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div>
          <label
            htmlFor="register-email"
            className={`block text-sm font-medium mb-2 transition-colors ${
              focusedField === 'email' ? 'text-brand' : 'text-primary-700'
            }`}
          >
            {t('auth.email')}
          </label>
          <div
            className={`relative rounded-xl transition-all duration-200 ${
              focusedField === 'email'
                ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface-50 dark:ring-offset-surface-100'
                : ''
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`w-5 h-5 transition-colors ${
                focusedField === 'email' ? 'text-brand' : 'text-primary-400'
              }`} />
            </div>
            <input
              type="email"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-12 pr-4 py-3.5 bg-surface-0 border border-primary-200 rounded-xl text-primary-900 placeholder-primary-400 focus:outline-none focus:border-brand transition-colors"
              placeholder={t('auth.emailPlaceholder')}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="register-password"
            className={`block text-sm font-medium mb-2 transition-colors ${
              focusedField === 'password' ? 'text-brand' : 'text-primary-700'
            }`}
          >
            {t('auth.password')}
          </label>
          <div
            className={`relative rounded-xl transition-all duration-200 ${
              focusedField === 'password'
                ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface-50 dark:ring-offset-surface-100'
                : ''
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`w-5 h-5 transition-colors ${
                focusedField === 'password' ? 'text-brand' : 'text-primary-400'
              }`} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-12 pr-12 py-3.5 bg-surface-0 border border-primary-200 rounded-xl text-primary-900 placeholder-primary-400 focus:outline-none focus:border-brand transition-colors"
              placeholder={t('auth.passwordPlaceholder')}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-400 hover:text-primary-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password requirements */}
          {password && (
            <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <PasswordCheck passed={passwordChecks.length} label={t('auth.passwordRules.length')} />
                <PasswordCheck passed={passwordChecks.uppercase} label={t('auth.passwordRules.uppercase')} />
                <PasswordCheck passed={passwordChecks.lowercase} label={t('auth.passwordRules.lowercase')} />
                <PasswordCheck passed={passwordChecks.digit} label={t('auth.passwordRules.digit')} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm password field */}
        <div>
          <label
            htmlFor="register-confirm-password"
            className={`block text-sm font-medium mb-2 transition-colors ${
              focusedField === 'confirmPassword' ? 'text-brand' : 'text-primary-700'
            }`}
          >
            {t('auth.confirmPassword')}
          </label>
          <div
            className={`relative rounded-xl transition-all duration-200 ${
              focusedField === 'confirmPassword'
                ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface-50 dark:ring-offset-surface-100'
                : ''
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`w-5 h-5 transition-colors ${
                focusedField === 'confirmPassword' ? 'text-brand' : 'text-primary-400'
              }`} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="register-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-12 py-3.5 bg-surface-0 border rounded-xl text-primary-900 placeholder-primary-400 focus:outline-none transition-colors ${
                confirmPassword && !passwordsMatch
                  ? 'border-error-300 focus:border-error-500'
                  : confirmPassword && passwordsMatch
                  ? 'border-success-300 focus:border-success-500'
                  : 'border-primary-200 focus:border-brand'
              }`}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-400 hover:text-primary-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="mt-2 text-sm text-error-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {t('auth.errors.passwordMismatch')}
            </p>
          )}
          {confirmPassword && passwordsMatch && (
            <p className="mt-2 text-sm text-success-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t('auth.passwordsMatch') || 'Les mots de passe correspondent'}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !allChecksValid}
          className="relative w-full py-4 px-6 bg-gradient-to-r from-brand to-brand/90 hover:from-brand/90 hover:to-brand text-white font-semibold rounded-xl shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:from-primary-400 disabled:to-primary-400 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('auth.registering')}</span>
            </>
          ) : (
            <>
              <span>{t('auth.register.button')}</span>
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch to login */}
      <div className="mt-8 text-center">
        <p className="text-sm text-primary-600">
          {t('auth.hasAccount')}{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-semibold text-brand hover:text-brand/80 transition-colors hover:underline underline-offset-2"
          >
            {t('auth.login.link')}
          </button>
        </p>
      </div>
    </div>
  );
}

function PasswordCheck({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-all duration-200 ${
      passed ? 'text-success-600' : 'text-primary-400'
    }`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
        passed ? 'bg-success-100 text-success-600' : 'bg-primary-200 text-primary-400'
      }`}>
        <Check className="w-3 h-3" />
      </div>
      <span>{label}</span>
    </div>
  );
}
