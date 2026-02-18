import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook } from '@testing-library/react'
import { renderWithProviders } from '../test/render'

const mockSetOnUnauthorized = vi.fn()

// Mock the API client
vi.mock('../api/client', () => ({
  setOnUnauthorized: (...args: unknown[]) => mockSetOnUnauthorized(...args),
  api: {
    post: vi.fn(),
  },
}))

// Mock the auth API
const mockLoginUser = vi.fn()
const mockRegisterUser = vi.fn()
const mockCreateGuestAccount = vi.fn()
const mockUpgradeGuestAccount = vi.fn()
const mockGetCurrentUser = vi.fn()
const mockLogoutUser = vi.fn()

vi.mock('../api/auth', () => ({
  loginUser: (...args: unknown[]) => mockLoginUser(...args),
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
  createGuestAccount: () => mockCreateGuestAccount(),
  upgradeGuestAccount: (...args: unknown[]) => mockUpgradeGuestAccount(...args),
  getCurrentUser: () => mockGetCurrentUser(),
  logoutUser: () => mockLogoutUser(),
}))

// Import after mocks
import { useAuth } from './AuthContext'

function TestConsumer() {
  const auth = useAuth()
  return (
    <div>
      <span data-testid="authenticated">{auth.isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="loading">{auth.isLoading ? 'yes' : 'no'}</span>
      <span data-testid="guest">{auth.isGuest ? 'yes' : 'no'}</span>
      <span data-testid="email">{auth.user?.email || 'none'}</span>
      <button
        data-testid="login"
        onClick={() => auth.login({ email: 'a@b.com', password: 'pass' })}
      >
        Login
      </button>
      <button
        data-testid="register"
        onClick={() => auth.register({ email: 'a@b.com', password: 'pass' })}
      >
        Register
      </button>
      <button data-testid="logout" onClick={auth.logout}>
        Logout
      </button>
      <button data-testid="guest-login" onClick={auth.loginAsGuest}>
        Guest
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    window.history.replaceState({}, '', '/')
    mockLogoutUser.mockResolvedValue(undefined)
    mockGetCurrentUser.mockRejectedValue(new Error('unauthenticated'))
  })

  it('throws when useAuth is used outside provider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')
    stderrSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('starts with loading then resolves to not loading', async () => {
    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no')
    })
  })

  it('initializes as unauthenticated when /me fails', async () => {
    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no')
    })
    expect(screen.getByTestId('authenticated').textContent).toBe('no')
    expect(screen.getByTestId('email').textContent).toBe('none')
  })

  it('initializes from server cookie session', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 5,
      email: 'stored@test.com',
      is_guest: false,
      is_verified: true,
      feedback_completed_at: null,
    })

    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no')
    })
    expect(screen.getByTestId('authenticated').textContent).toBe('yes')
    expect(screen.getByTestId('email').textContent).toBe('stored@test.com')
  })

  it('login sets user from /me', async () => {
    mockLoginUser.mockResolvedValue({ access_token: 'new-jwt', token_type: 'bearer' })
    mockGetCurrentUser
      .mockRejectedValueOnce(new Error('initial unauth'))
      .mockResolvedValueOnce({
        id: 10,
        email: 'login@test.com',
        is_guest: false,
        is_verified: true,
        feedback_completed_at: null,
      })

    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no')
    })

    await user.click(screen.getByTestId('login'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('yes')
    })
    expect(screen.getByTestId('email').textContent).toBe('login@test.com')
    expect(screen.getByTestId('guest').textContent).toBe('no')
  })

  it('register calls registerUser but does not auto-login', async () => {
    mockRegisterUser.mockResolvedValue({ message: 'ok' })

    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no')
    })

    await user.click(screen.getByTestId('register'))

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalled()
    })
    expect(screen.getByTestId('authenticated').textContent).toBe('no')
  })

  it('logout clears user state', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 1,
      email: 'user@test.com',
      is_guest: false,
      is_verified: true,
      feedback_completed_at: null,
    })

    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('yes')
    })

    await user.click(screen.getByTestId('logout'))

    expect(screen.getByTestId('authenticated').textContent).toBe('no')
    expect(screen.getByTestId('email').textContent).toBe('none')
    expect(mockLogoutUser).toHaveBeenCalled()
  })

  it('loginAsGuest sets isGuest to true', async () => {
    mockCreateGuestAccount.mockResolvedValue({ access_token: 'guest-jwt', token_type: 'bearer' })
    mockGetCurrentUser
      .mockRejectedValueOnce(new Error('initial unauth'))
      .mockResolvedValueOnce({
        id: 99,
        email: 'guest@guest.local',
        is_guest: true,
        is_verified: true,
        feedback_completed_at: null,
      })

    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no')
    })

    await user.click(screen.getByTestId('guest-login'))

    await waitFor(() => {
      expect(screen.getByTestId('guest').textContent).toBe('yes')
    })
    expect(screen.getByTestId('authenticated').textContent).toBe('yes')
    expect(screen.getByTestId('email').textContent).toBe('guest@guest.local')
  })

  it('sets onUnauthorized callback to logout', async () => {
    renderWithProviders(<TestConsumer />)
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no')
    })
    expect(mockSetOnUnauthorized).toHaveBeenCalled()
  })
})
