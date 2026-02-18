import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useItemSortable } from './useItemSortable'

type Item = { id: string; label: string }

describe('useItemSortable', () => {
  const items: Item[] = [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B' },
    { id: 'c', label: 'C' },
  ]

  it('returns item ids in order', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useItemSortable({ items, onChange }))

    expect(result.current.itemIds).toEqual(['a', 'b', 'c'])
  })

  it('reorders items on valid drag end', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useItemSortable({ items, onChange }))

    act(() => {
      result.current.handleDragEnd({
        active: { id: 'a' },
        over: { id: 'c' },
      } as never)
    })

    expect(onChange).toHaveBeenCalledWith([
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
      { id: 'a', label: 'A' },
    ])
  })

  it('does not reorder when dropping on same item', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useItemSortable({ items, onChange }))

    act(() => {
      result.current.handleDragEnd({
        active: { id: 'b' },
        over: { id: 'b' },
      } as never)
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does nothing when over is null', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useItemSortable({ items, onChange }))

    act(() => {
      result.current.handleDragEnd({
        active: { id: 'b' },
        over: null,
      } as never)
    })

    expect(onChange).not.toHaveBeenCalled()
  })
})
