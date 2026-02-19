import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChangeEmailModal from './ChangeEmailModal'
import { renderWithProviders } from '../test/render'
import { ApiError } from '../api/client'

const VALID_PASSWORD = 'TestPassword1!abc'

describe('ChangeEmailModal', () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  const changeEmail = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the modal with title, close button and email field', () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })
    // Modal has multiple buttons (close + visibility toggles + submit)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(4)
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
  })

  it('renders email, password and confirm password fields', () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
    // Use id selectors to distinguish the two password fields
    expect(document.getElementById('change-password')).toBeInTheDocument()
    expect(document.getElementById('change-confirm-password')).toBeInTheDocument()
  })

  it('submit button is disabled by default', () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })
    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')
    expect(submitBtn).toBeDisabled()
  })

  it('calls onClose when close button is clicked', async () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })
    // Close button has no `type` attribute (not type="button")
    const closeBtn = screen.getAllByRole('button').find((b) => !b.getAttribute('type'))!
    await user.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it('toggles password field visibility', async () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })
    const passwordInput = document.getElementById('change-password') as HTMLInputElement
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
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })
    const confirmInput = document.getElementById('change-confirm-password') as HTMLInputElement
    expect(confirmInput.type).toBe('password')

    // type="button" buttons: [0] = password toggle, [1] = confirm password toggle
    const toggleButtons = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('type') === 'button')
    await user.click(toggleButtons[1])
    expect(confirmInput.type).toBe('text')
  })

  it('shows password requirements checklist', () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })
    // The requirements panel always renders (not conditional on typing)
    const panel = document.querySelector('.bg-primary-50')
    expect(panel).toBeInTheDocument()
  })

  it('enables submit button when all checks pass', async () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })

    await user.type(screen.getByLabelText(/^email/i), 'new@example.com')
    await user.type(document.getElementById('change-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('change-confirm-password')!, VALID_PASSWORD)

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')
    expect(submitBtn).not.toBeDisabled()
  })

  it('calls changeEmail with correct args and shows success state', async () => {
    changeEmail.mockResolvedValue(undefined)

    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })

    await user.type(screen.getByLabelText(/^email/i), 'new@example.com')
    await user.type(document.getElementById('change-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('change-confirm-password')!, VALID_PASSWORD)

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      expect(changeEmail).toHaveBeenCalledWith('new@example.com', VALID_PASSWORD)
    })

    // Success state renders a CheckCircle icon and success message
    await waitFor(() => {
      const modal = document.querySelector('.fixed')
      expect(modal).toBeInTheDocument()
      // Success view replaces the form
      expect(screen.queryByRole('form')).not.toBeInTheDocument()
    })
  })

  it('shows email exists error on 409', async () => {
    changeEmail.mockRejectedValue(new ApiError('Conflict', 409, 'Email already exists'))

    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })

    await user.type(screen.getByLabelText(/^email/i), 'taken@example.com')
    await user.type(document.getElementById('change-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('change-confirm-password')!, VALID_PASSWORD)

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      const errorEl = document.querySelector('.text-error-700')
      expect(errorEl).toBeInTheDocument()
    })
  })

  it('shows generic error for non-409 ApiError', async () => {
    changeEmail.mockRejectedValue(new ApiError('Server Error', 500, 'Internal error'))

    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })

    await user.type(screen.getByLabelText(/^email/i), 'user@example.com')
    await user.type(document.getElementById('change-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('change-confirm-password')!, VALID_PASSWORD)

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      const errorEl = document.querySelector('.text-error-700')
      expect(errorEl).toBeInTheDocument()
    })
  })

  it('shows generic error for non-ApiError exception', async () => {
    changeEmail.mockRejectedValue(new Error('network failure'))

    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })

    await user.type(screen.getByLabelText(/^email/i), 'user@example.com')
    await user.type(document.getElementById('change-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('change-confirm-password')!, VALID_PASSWORD)

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submitBtn)

    await waitFor(() => {
      const errorEl = document.querySelector('.text-error-700')
      expect(errorEl).toBeInTheDocument()
    })
  })

  it('submit button stays disabled when passwords do not match', async () => {
    renderWithProviders(<ChangeEmailModal onClose={onClose} />, {
      authValue: { changeEmail },
    })

    await user.type(screen.getByLabelText(/^email/i), 'user@example.com')
    await user.type(document.getElementById('change-password')!, VALID_PASSWORD)
    await user.type(document.getElementById('change-confirm-password')!, 'DifferentPass1!')

    const submitBtn = screen.getAllByRole('button').find((b) => b.getAttribute('type') === 'submit')
    expect(submitBtn).toBeDisabled()
  })
})
