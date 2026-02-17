import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExperienceEditor from './ExperienceEditor'
import { renderWithProviders } from '../../test/render'
import type { ExperienceItem } from '../../types'

describe('ExperienceEditor', () => {
  const user = userEvent.setup()

  const sampleItems: ExperienceItem[] = [
    {
      id: 'exp-1',
      title: 'Senior Dev',
      company: 'Acme Corp',
      dates: '2020 - Present',
      highlights: ['Built API', 'Led team'],
    },
  ]

  it('renders existing experience items', () => {
    renderWithProviders(<ExperienceEditor items={sampleItems} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('Senior Dev')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2020 - Present')).toBeInTheDocument()
  })

  it('renders highlights', () => {
    renderWithProviders(<ExperienceEditor items={sampleItems} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('Built API')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Led team')).toBeInTheDocument()
  })

  it('adds a new experience when clicking add button', async () => {
    const onChange = vi.fn()
    renderWithProviders(<ExperienceEditor items={[]} onChange={onChange} />)

    const addButton = screen.getByRole('button', { name: /experience/i })
    await user.click(addButton)

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ title: '', company: '', dates: '', highlights: [] }),
    ])
  })

  it('removes an experience when clicking delete', async () => {
    const onChange = vi.fn()
    renderWithProviders(<ExperienceEditor items={sampleItems} onChange={onChange} />)

    const deleteButton = screen.getByTitle(/delete/i)
    await user.click(deleteButton)

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('calls onChange when editing title field', async () => {
    const onChange = vi.fn()
    renderWithProviders(<ExperienceEditor items={sampleItems} onChange={onChange} />)

    const titleInput = screen.getByDisplayValue('Senior Dev')
    // Type a single character — the component is controlled so we just check onChange was called
    await user.type(titleInput, 'X')

    expect(onChange).toHaveBeenCalled()
    // The first call should append 'X' to existing title
    const firstCall = onChange.mock.calls[0][0]
    expect(firstCall[0].title).toBe('Senior DevX')
  })

  it('adds a highlight', async () => {
    const onChange = vi.fn()
    renderWithProviders(<ExperienceEditor items={sampleItems} onChange={onChange} />)

    // The add highlight button contains "Add" text (common.add) — but there's also the main add experience button.
    // The add highlight button is inside the experience card, find all buttons with plus-like text
    const allButtons = screen.getAllByRole('button')
    // The add highlight button has the Plus icon and small "Add" text,
    // while the main button says "Add experience" / "Ajouter une expérience"
    const addHighlightBtn = allButtons.find((btn) => {
      const text = btn.textContent?.toLowerCase() || ''
      return (
        (text === 'add' || text === 'ajouter') &&
        !text.includes('experience') &&
        !text.includes('expérience')
      )
    })!
    await user.click(addHighlightBtn)

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({
        highlights: ['Built API', 'Led team', ''],
      }),
    ])
  })

  it('shows empty highlights message when no highlights', () => {
    const itemsNoHighlights: ExperienceItem[] = [
      { id: 'exp-2', title: 'Dev', company: 'Co', dates: '2020', highlights: [] },
    ]
    renderWithProviders(<ExperienceEditor items={itemsNoHighlights} onChange={vi.fn()} />)

    // The "noHighlights" message is an italic paragraph
    const emptyMessage = screen.getByText(
      (text, element) =>
        element?.tagName === 'P' && element?.classList.contains('italic') && text.length > 0,
    )
    expect(emptyMessage).toBeInTheDocument()
  })

  it('renders add experience button when empty', () => {
    renderWithProviders(<ExperienceEditor items={[]} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /experience/i })).toBeInTheDocument()
  })
})
