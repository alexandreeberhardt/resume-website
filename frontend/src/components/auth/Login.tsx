/**
 * Login component - Modern design
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail || t('auth.errors.invalidCredentials'));
      } else {
        setError(t('auth.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand to-brand/80 rounded-2xl shadow-lg shadow-brand/25 mb-6">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-2">
          {t('auth.login.title')}
        </h2>
        <p className="text-primary-500">
          {t('auth.login.subtitle')}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-start gap-3 animate-shake">
          <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-error-600" />
          </div>
          <div className="flex-1 pt-1">
            <p className="text-sm font-medium text-error-800">{t('auth.errors.title') || 'Erreur de connexion'}</p>
            <p className="text-sm text-error-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div>
          <label
            htmlFor="email"
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
              id="email"
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
            htmlFor="password"
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
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="w-full pl-12 pr-12 py-3.5 bg-surface-0 border border-primary-200 rounded-xl text-primary-900 placeholder-primary-400 focus:outline-none focus:border-brand transition-colors"
              placeholder={t('auth.passwordPlaceholder')}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-400 hover:text-primary-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-4 px-6 bg-gradient-to-r from-brand to-brand/90 hover:from-brand/90 hover:to-brand text-white font-semibold rounded-xl shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('auth.loggingIn')}</span>
            </>
          ) : (
            <>
              <span>{t('auth.login.button')}</span>
              <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch to register */}
      <div className="mt-8 text-center">
        <p className="text-sm text-primary-600">
          {t('auth.noAccount')}{' '}
          <button
            onClick={onSwitchToRegister}
            className="font-semibold text-brand hover:text-brand/80 transition-colors hover:underline underline-offset-2"
          >
            {t('auth.register.link')}
          </button>
        </p>
      </div>
    </div>
  );
}
