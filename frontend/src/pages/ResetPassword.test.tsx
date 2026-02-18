import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ResetPassword from './ResetPassword'
import { ApiError } from '../api/client'
import '../i18n'

const mockResetPassword = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../api/auth', () => ({
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderPage(path: string) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ResetPassword page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows invalid link message when token is missing', () => {
    renderPage('/reset-password')

    expect(screen.getByText('This reset link is invalid or has expired.')).toBeInTheDocument()
    expect(mockResetPassword).not.toHaveBeenCalled()
  })

  it('submits a valid password reset', async () => {
    const user = userEvent.setup()
    mockResetPassword.mockResolvedValue(undefined)
    renderPage('/reset-password#token=test-token')

    await user.type(screen.getByLabelText('New password'), 'MyStrongPass!123')
    await user.type(screen.getByLabelText('Confirm password'), 'MyStrongPass!123')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test-token', 'MyStrongPass!123')
    })
    expect(
      screen.getByText('Your password has been reset successfully. Redirecting to sign in...'),
    ).toBeInTheDocument()
  })

  it('shows API error details when reset fails', async () => {
    const user = userEvent.setup()
    mockResetPassword.mockRejectedValue(new ApiError('bad', 400, 'Token expired'))
    renderPage('/reset-password#token=expired-token')

    await user.type(screen.getByLabelText('New password'), 'MyStrongPass!123')
    await user.type(screen.getByLabelText('Confirm password'), 'MyStrongPass!123')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    expect(await screen.findByText('Token expired')).toBeInTheDocument()
  })
})
