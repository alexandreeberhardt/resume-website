import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPassword from './ForgotPassword'
import { renderWithProviders } from '../../test/render'

const mockForgotPassword = vi.fn()

vi.mock('../../api/auth', () => ({
  forgotPassword: (...args: unknown[]) => mockForgotPassword(...args),
}))

describe('ForgotPassword', () => {
  const onSwitchToLogin = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email field and submit button', () => {
    renderWithProviders(<ForgotPassword onSwitchToLogin={onSwitchToLogin} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('submits email and shows success state', async () => {
    mockForgotPassword.mockResolvedValue({ message: 'ok' })
    renderWithProviders(<ForgotPassword onSwitchToLogin={onSwitchToLogin} />)

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(mockForgotPassword).toHaveBeenCalledWith('user@test.com')
    expect(await screen.findByText(/associated with an account/i)).toBeInTheDocument()
  })

  it('shows generic error when API fails', async () => {
    mockForgotPassword.mockRejectedValue(new Error('network'))
    renderWithProviders(<ForgotPassword onSwitchToLogin={onSwitchToLogin} />)

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByText('An error occurred')).toBeInTheDocument()
  })

  it('calls onSwitchToLogin from success screen', async () => {
    mockForgotPassword.mockResolvedValue({ message: 'ok' })
    renderWithProviders(<ForgotPassword onSwitchToLogin={onSwitchToLogin} />)

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))
    await user.click(await screen.findByRole('button', { name: /back to sign in/i }))

    expect(onSwitchToLogin).toHaveBeenCalled()
  })
})
