import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GuestUpgradeModal from './GuestUpgradeModal'
import { renderWithProviders } from '../test/render'
import { ApiError } from '../api/client'

const VALID_PASSWORD = 'TestPassword1!abc'

describe('GuestUpgradeModal', () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  const upgradeAccount = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal with email, password and confirm password fields', () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })
    expect(document.getElementById('upgrade-email')).toBeInTheDocument()
    expect(document.getElementById('upgrade-password')).toBeInTheDocument()
    expect(document.getElementById('upgrade-confirm-password')).toBeInTheDocument()
  })

  it('renders terms checkbox (unchecked by default)', () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('submit button is disabled by default', () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })
    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')
    expect(submitBtn).toBeDisabled()
  })

  it('calls onClose when close button is clicked', async () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })
    // Close button has no `type` attribute (not type="button")
    const closeBtn = screen.getAllByRole('button').find((b) => !b.getAttribute('type'))!
    await user.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it('toggles password field visibility', async () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })
    const passwordInput = document.getElementById('upgrade-password') as HTMLInputElement
    expect(passwordInput.type).toBe('password')

    // type="button" buttons: [0] = password toggle, [1] = confirm password toggle
    const toggleButtons = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('type') === 'button')
    await user.click(toggleButtons[0])
    expect(passwordInput.type).toBe('text')

    await user.click(toggleButtons[0])
    expect(passwordInput.type).toBe('password')
  })

  it('toggles confirm password field visibility', async () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })
    const confirmInput = document.getElementById('upgrade-confirm-password') as HTMLInputElement
    expect(confirmInput.type).toBe('password')

    // type="button" buttons: [0] = password toggle, [1] = confirm password toggle
    const toggleButtons = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('type') === 'button')
    await user.click(toggleButtons[1])
    expect(confirmInput.type).toBe('text')
  })

  it('shows password requirements checklist', () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })
    const panel = document.querySelector('.bg-primary-50')
    expect(panel).toBeInTheDocument()
  })

  it('submit button stays disabled without terms checkbox even with valid password', async () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })

    await user.type(document.getElementById('upgrade-email')!, 'guest@example.com')
    await user.type(document.getElementById('upgrade-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('upgrade-confirm-password')!, VALID_PASSWORD)
    // Terms not checked

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')
    expect(submitBtn).toBeDisabled()
  })

  it('enables submit button when all checks pass including terms', async () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })

    await user.type(document.getElementById('upgrade-email')!, 'guest@example.com')
    await user.type(document.getElementById('upgrade-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('upgrade-confirm-password')!, VALID_PASSWORD)
    await user.click(screen.getByRole('checkbox'))

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')
    expect(submitBtn).not.toBeDisabled()
  })

  it('calls upgradeAccount with correct args and shows success state', async () => {
    upgradeAccount.mockResolvedValue(undefined)

    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })

    await user.type(document.getElementById('upgrade-email')!, 'guest@example.com')
    await user.type(document.getElementById('upgrade-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('upgrade-confirm-password')!, VALID_PASSWORD)
    await user.click(screen.getByRole('checkbox'))

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      expect(upgradeAccount).toHaveBeenCalledWith('guest@example.com', VALID_PASSWORD)
    })

    // Success state replaces the form
    await waitFor(() => {
      expect(screen.queryByRole('form')).not.toBeInTheDocument()
    })
  })

  it('shows email exists error on 409', async () => {
    upgradeAccount.mockRejectedValue(new ApiError('Conflict', 409, 'Email already exists'))

    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })

    await user.type(document.getElementById('upgrade-email')!, 'taken@example.com')
    await user.type(document.getElementById('upgrade-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('upgrade-confirm-password')!, VALID_PASSWORD)
    await user.click(screen.getByRole('checkbox'))

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      const errorEl = document.querySelector('.text-error-700')
      expect(errorEl).toBeInTheDocument()
    })
  })

  it('shows email exists error on 400', async () => {
    upgradeAccount.mockRejectedValue(new ApiError('Bad Request', 400, 'Email already exists'))

    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })

    await user.type(document.getElementById('upgrade-email')!, 'taken@example.com')
    await user.type(document.getElementById('upgrade-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('upgrade-confirm-password')!, VALID_PASSWORD)
    await user.click(screen.getByRole('checkbox'))

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      const errorEl = document.querySelector('.text-error-700')
      expect(errorEl).toBeInTheDocument()
    })
  })

  it('shows generic error for non-ApiError exception', async () => {
    upgradeAccount.mockRejectedValue(new Error('network failure'))

    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })

    await user.type(document.getElementById('upgrade-email')!, 'user@example.com')
    await user.type(document.getElementById('upgrade-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('upgrade-confirm-password')!, VALID_PASSWORD)
    await user.click(screen.getByRole('checkbox'))

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      const errorEl = document.querySelector('.text-error-700')
      expect(errorEl).toBeInTheDocument()
    })
  })

  it('submit button stays disabled when passwords do not match', async () => {
    renderWithProviders(<GuestUpgradeModal onClose={onClose} />, {
      authValue: { upgradeAccount },
    })

    await user.type(document.getElementById('upgrade-email')!, 'user@example.com')
    await user.type(document.getElementById('upgrade-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('upgrade-confirm-password')!, 'DifferentPass1!')
    await user.click(screen.getByRole('checkbox'))

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')
    expect(submitBtn).toBeDisabled()
  })
})
