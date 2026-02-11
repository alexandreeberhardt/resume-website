import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PersonalSection from './PersonalSection'
import { renderWithProviders } from '../test/render'
import type { PersonalInfo } from '../types'

describe('PersonalSection', () => {
  const user = userEvent.setup()

  const emptyData: PersonalInfo = {
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    links: [],
  }

  function renderSection(data: PersonalInfo = emptyData, onChange = vi.fn()) {
    const result = renderWithProviders(
      <PersonalSection data={data} onChange={onChange} />
    )
    return { onChange, ...result }
  }

  it('renders all personal info fields', () => {
    renderSection()
    // 5 text inputs (name, title, location, email, phone)
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThanOrEqual(5)
  })

  it('calls onChange when typing in name field', async () => {
    const onChange = vi.fn()
    renderSection(emptyData, onChange)

    // Name is the first text input
    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'A')

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'A' })
    )
  })

  it('calls onChange when typing in email field', async () => {
    const onChange = vi.fn()
    renderSection(emptyData, onChange)

    const emailInput = screen.getByPlaceholderText(/example/i)
    await user.type(emailInput, 'a')

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'a' })
    )
  })

  it('shows empty state when no links', () => {
    renderSection()
    // The empty links message contains "LinkedIn" or "lien"
    const emptyMessage = screen.getByText((text) =>
      text.toLowerCase().includes('linkedin') || text.toLowerCase().includes('lien')
    )
    expect(emptyMessage).toBeInTheDocument()
  })

  it('adds a link when clicking add button', async () => {
    const onChange = vi.fn()
    renderSection(emptyData, onChange)

    const addButton = screen.getByRole('button', { name: /add/i })
    await user.click(addButton)

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        links: [expect.objectContaining({ platform: 'linkedin', username: '', url: '' })],
      })
    )
  })

  it('renders existing links', () => {
    const data: PersonalInfo = {
      ...emptyData,
      links: [{ platform: 'linkedin', username: 'johndoe', url: 'https://linkedin.com/in/johndoe' }],
    }
    renderSection(data)

    expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://linkedin.com/in/johndoe')).toBeInTheDocument()
  })

  it('removes a link when clicking delete', async () => {
    const onChange = vi.fn()
    const data: PersonalInfo = {
      ...emptyData,
      links: [{ platform: 'github', username: 'jdoe', url: 'https://github.com/jdoe' }],
    }
    renderSection(data, onChange)

    const deleteButton = screen.getByTitle(/delete/i)
    await user.click(deleteButton)

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ links: [] })
    )
  })

  it('displays pre-filled personal data', () => {
    const data: PersonalInfo = {
      name: 'Alice Dupont',
      title: 'Software Engineer',
      location: 'Paris',
      email: 'alice@example.com',
      phone: '+33 6 12 34 56 78',
      links: [],
    }
    renderSection(data)

    expect(screen.getByDisplayValue('Alice Dupont')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument()
    expect(screen.getByDisplayValue('alice@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+33 6 12 34 56 78')).toBeInTheDocument()
  })
})
