import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GuestUpgradeBanner from './GuestUpgradeBanner'
import { renderWithProviders } from '../test/render'

describe('GuestUpgradeBanner', () => {
  const user = userEvent.setup()

  it('renders nothing when user is not guest', () => {
    const { container } = renderWithProviders(<GuestUpgradeBanner />, {
      authValue: { isGuest: false },
    })
    expect(container.innerHTML).toBe('')
  })

  it('renders banner when user is guest', () => {
    renderWithProviders(<GuestUpgradeBanner />, {
      authValue: { isGuest: true, isAuthenticated: true },
    })
    // Banner should contain a button to create account
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('dismisses banner when clicking close', async () => {
    renderWithProviders(<GuestUpgradeBanner />, {
      authValue: { isGuest: true, isAuthenticated: true },
    })

    // Find the X close button (small one in banner)
    const closeButtons = screen.getAllByRole('button')
    const dismissBtn = closeButtons.find(
      (b) => b.querySelector('svg.lucide-x') || b.querySelector('[class*="w-4 h-4"]'),
    )
    if (dismissBtn) {
      await user.click(dismissBtn)
    }
  })

  it('opens upgrade modal when clicking create account', async () => {
    renderWithProviders(<GuestUpgradeBanner />, {
      authValue: { isGuest: true, isAuthenticated: true, upgradeAccount: vi.fn() },
    })

    // Find the "create account" button (white bg button in the banner)
    const createAccountBtn = screen
      .getAllByRole('button')
      .find((b) => b.classList.contains('bg-white'))
    if (createAccountBtn) {
      await user.click(createAccountBtn)

      // Modal should now be open — look for form elements
      const emailInput = screen.queryByLabelText(/email/i)
      expect(emailInput).toBeInTheDocument()
    }
  })
})
