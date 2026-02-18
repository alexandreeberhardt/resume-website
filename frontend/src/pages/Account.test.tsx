import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Account from './Account'
import '../i18n'

const mockNavigate = vi.fn()
const mockLogout = vi.fn()
const mockExportUserData = vi.fn()
const mockDeleteUserAccount = vi.fn()

type AuthState = {
  user: { email: string } | null
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

let authState: AuthState = {
  user: { email: 'user@test.com' },
  logout: mockLogout,
  isAuthenticated: true,
  isLoading: false,
}

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('../context/AuthContext')>(
    '../context/AuthContext',
  )
  return {
    ...actual,
    useAuth: () => authState,
  }
})

vi.mock('../api/auth', () => ({
  exportUserData: (...args: unknown[]) => mockExportUserData(...args),
  deleteUserAccount: (...args: unknown[]) => mockDeleteUserAccount(...args),
}))

vi.mock('../components/FeedbackBanner', () => ({
  default: () => <div data-testid="feedback-banner-mock" />,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderPage() {
  return render(
    <MemoryRouter
      initialEntries={['/account']}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/account" element={<Account />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Account page', () => {
  const createObjectURLSpy = vi.fn(() => 'blob:mock-url')
  const revokeObjectURLSpy = vi.fn()
  const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
    authState = {
      user: { email: 'user@test.com' },
      logout: mockLogout,
      isAuthenticated: true,
      isLoading: false,
    }
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: createObjectURLSpy,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: revokeObjectURLSpy,
    })
  })

  afterEach(() => {
    anchorClickSpy.mockClear()
  })

  it('redirects to home when user is not authenticated', async () => {
    authState = { user: null, logout: mockLogout, isAuthenticated: false, isLoading: false }
    renderPage()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('exports user data and shows success message', async () => {
    const user = userEvent.setup()
    mockExportUserData.mockResolvedValue({ email: 'user@test.com', resumes: [] })
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Download my data' }))

    await waitFor(() => {
      expect(mockExportUserData).toHaveBeenCalledTimes(1)
      expect(createObjectURLSpy).toHaveBeenCalledTimes(1)
      expect(anchorClickSpy).toHaveBeenCalledTimes(1)
      expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1)
    })
    expect(screen.getByText('Data exported successfully')).toBeInTheDocument()
  })

  it('deletes account after confirmation and logs out', async () => {
    const user = userEvent.setup()
    mockDeleteUserAccount.mockResolvedValue(undefined)
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Delete my account' }))
    await user.type(screen.getByPlaceholderText('DELETE'), 'DELETE')
    await user.click(screen.getByRole('button', { name: 'Delete permanently' }))

    await waitFor(() => {
      expect(mockDeleteUserAccount).toHaveBeenCalledTimes(1)
      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('shows error when export fails', async () => {
    const user = userEvent.setup()
    mockExportUserData.mockRejectedValue(new Error('Export failed'))
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Download my data' }))

    expect(await screen.findByText('Export failed')).toBeInTheDocument()
  })

  it('shows error and does not navigate when account deletion fails', async () => {
    const user = userEvent.setup()
    mockDeleteUserAccount.mockRejectedValue(new Error('Deletion failed'))
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Delete my account' }))
    await user.type(screen.getByPlaceholderText('DELETE'), 'DELETE')
    await user.click(screen.getByRole('button', { name: 'Delete permanently' }))

    expect(await screen.findByText('Deletion failed')).toBeInTheDocument()
    expect(mockLogout).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalledWith('/')
  })
})
