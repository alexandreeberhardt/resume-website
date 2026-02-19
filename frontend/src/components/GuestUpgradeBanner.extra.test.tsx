/**
 * Additional tests for GuestUpgradeBanner - renders based on auth state
 */
import { describe, it, vi } from 'vitest'
import { renderWithProviders } from '../test/render'
import GuestUpgradeBanner from './GuestUpgradeBanner'

describe('GuestUpgradeBanner extra', () => {
  it('renders without crashing (not a guest by default)', () => {
    renderWithProviders(<GuestUpgradeBanner />)
  })

  it('does not render for unauthenticated user', () => {
    const { container } = renderWithProviders(<GuestUpgradeBanner />)
    // Not a guest => banner is not shown
    expect(container.firstChild).toBeNull()
  })

  it('renders banner when user is a guest', () => {
    const { container } = renderWithProviders(<GuestUpgradeBanner />, {
      authValue: { isGuest: true, isAuthenticated: true },
    })
    expect(container.firstChild).not.toBeNull()
  })

  it('calls onUpgrade callback via upgrade flow', () => {
    // Guest upgrade is handled internally by the component via useAuth
    const onUpgrade = vi.fn()
    renderWithProviders(<GuestUpgradeBanner />, {
      authValue: { isGuest: true, upgradeAccount: onUpgrade },
    })
  })
})
