import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SortableItem from './SortableItem'

const mockUseSortable = vi.fn()

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: (...args: unknown[]) => mockUseSortable(...args),
}))

describe('SortableItem', () => {
  it('renders children and drag handle', () => {
    mockUseSortable.mockReturnValue({
      attributes: { 'data-sortable': 'true' },
      listeners: { onPointerDown: vi.fn() },
      setNodeRef: vi.fn(),
      transform: null,
      transition: 'transform 200ms ease',
      isDragging: false,
    })

    const { container } = render(
      <SortableItem id="item-1">
        <div>My content</div>
      </SortableItem>,
    )

    expect(mockUseSortable).toHaveBeenCalledWith({ id: 'item-1' })
    expect(screen.getByText('My content')).toBeInTheDocument()
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('applies dragging styles when item is dragging', () => {
    mockUseSortable.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
      isDragging: true,
    })

    const { container } = render(
      <SortableItem id="item-2">
        <div>Drag me</div>
      </SortableItem>,
    )

    expect(container.firstElementChild).toHaveClass('opacity-90')
    expect(container.firstElementChild).toHaveClass('z-10')
  })
})
