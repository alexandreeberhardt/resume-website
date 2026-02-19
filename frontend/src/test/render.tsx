import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext, type AuthContextType } from '../context/AuthContext'
import type { ReactElement } from 'react'
import '../i18n'

/**
 * Stable mock auth context for tests — avoids async API calls from the real AuthProvider
 * and eliminates "not wrapped in act()" warnings. Tests that need custom auth state
 * can pass their own `authValue` override.
 */
const defaultAuthValue: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isGuest: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loginAsGuest: async () => {},
  upgradeAccount: async () => {},
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  authValue?: Partial<AuthContextType>
}

// eslint-disable-next-line react-refresh/only-export-components
function AllProviders({
  children,
  authValue,
}: {
  children: React.ReactNode
  authValue: AuthContextType
}) {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    </BrowserRouter>
  )
}

export function renderWithProviders(ui: ReactElement, options?: RenderWithProvidersOptions) {
  const { authValue: authOverride, ...renderOptions } = options ?? {}
  const authValue = authOverride ? { ...defaultAuthValue, ...authOverride } : defaultAuthValue

  return render(ui, {
    wrapper: ({ children }) => <AllProviders authValue={authValue}>{children}</AllProviders>,
    ...renderOptions,
  })
}
