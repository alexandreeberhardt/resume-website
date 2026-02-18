/**
 * Authentication Context for managing user state
 */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { setOnUnauthorized, api } from '../api/client'
import {
  loginUser,
  registerUser,
  createGuestAccount,
  upgradeGuestAccount,
  getCurrentUser,
  logoutUser,
} from '../api/auth'
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types'

interface ApiUser {
  id: number
  email: string
  is_guest?: boolean
  is_verified?: boolean
  feedback_completed_at?: string | null
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  isGuest: boolean
  loginAsGuest: () => Promise<void>
  upgradeAccount: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

function mapApiUser(user: ApiUser): User {
  return {
    id: user.id,
    email: user.email,
    isGuest: !!user.is_guest,
    isVerified: user.is_verified,
    feedbackCompleted: !!user.feedback_completed_at,
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user
  const isGuest = !!user?.isGuest

  const applyUser = useCallback((apiUser: ApiUser | null) => {
    if (!apiUser) {
      setUser(null)
      setToken(null)
      return
    }
    setUser(mapApiUser(apiUser))
    // Token is now in HttpOnly cookie; keep a non-sensitive marker for existing UI state shape.
    setToken('cookie-session')
  }, [])

  /**
   * Logout: clear server cookies and local auth state
   */
  const logout = useCallback(() => {
    void logoutUser().catch(() => undefined)
    applyUser(null)
  }, [applyUser])

  /**
   * Initialize auth state from server session cookie and OAuth callback code.
   */
  useEffect(() => {
    const initAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const oauthCode = urlParams.get('code')

      if (oauthCode) {
        // Remove code from URL immediately
        window.history.replaceState({}, document.title, window.location.pathname)
        try {
          await api.post(`/auth/google/exchange?code=${encodeURIComponent(oauthCode)}`)
        } catch {
          // Continue; we'll end up unauthenticated if exchange failed.
        }
      }

      try {
        const me = await getCurrentUser()
        applyUser(me as ApiUser)
      } catch {
        applyUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [applyUser])

  /**
   * Set up unauthorized callback
   */
  useEffect(() => {
    setOnUnauthorized(logout)
  }, [logout])

  /**
   * Login with email and password
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    await loginUser(credentials)
    const me = await getCurrentUser()
    applyUser(me as ApiUser)
  }

  /**
   * Register a new user (does not auto-login)
   */
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    await registerUser(credentials)
  }

  /**
   * Login as a guest (anonymous account)
   */
  const loginAsGuest = async (): Promise<void> => {
    await createGuestAccount()
    const me = await getCurrentUser()
    applyUser(me as ApiUser)
  }

  /**
   * Upgrade guest account to permanent account
   */
  const upgradeAccount = async (email: string, password: string): Promise<void> => {
    const updatedUser = await upgradeGuestAccount(email, password)
    applyUser(updatedUser as ApiUser)
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isGuest,
    loginAsGuest,
    upgradeAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
