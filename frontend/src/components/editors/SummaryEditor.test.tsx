import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SummaryEditor from './SummaryEditor'
import { renderWithProviders } from '../../test/render'

describe('SummaryEditor', () => {
  const user = userEvent.setup()

  it('renders textarea with current value', () => {
    renderWithProviders(<SummaryEditor value="My summary" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('My summary')).toBeInTheDocument()
  })

  it('renders textarea with placeholder', () => {
    renderWithProviders(<SummaryEditor value="" onChange={vi.fn()} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('placeholder')
  })

  it('calls onChange when typing', async () => {
    const onChange = vi.fn()
    renderWithProviders(<SummaryEditor value="" onChange={onChange} />)

    await user.type(screen.getByRole('textbox'), 'A')
    expect(onChange).toHaveBeenCalledWith('A')
  })

  it('has 4 rows by default', () => {
    renderWithProviders(<SummaryEditor value="" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4')
  })
})
