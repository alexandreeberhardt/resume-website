import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSwitcher from './LanguageSwitcher'
import { renderWithProviders } from '../test/render'

describe('LanguageSwitcher', () => {
  const user = userEvent.setup()

  it('renders a select with language options', () => {
    renderWithProviders(<LanguageSwitcher />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText(/FR/)).toBeInTheDocument()
    expect(screen.getByText(/EN/)).toBeInTheDocument()
  })

  it('renders flag emojis in options', () => {
    renderWithProviders(<LanguageSwitcher />)
    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThanOrEqual(2)
    expect(options[0].textContent).toContain('🇫🇷')
    expect(options[1].textContent).toContain('🇬🇧')
  })

  it('changing selection switches language', async () => {
    renderWithProviders(<LanguageSwitcher />)
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'en')
    expect(select).toHaveValue('en')
  })

  it('can switch to FR', async () => {
    renderWithProviders(<LanguageSwitcher />)
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'fr')
    expect(select).toHaveValue('fr')
  })
})
