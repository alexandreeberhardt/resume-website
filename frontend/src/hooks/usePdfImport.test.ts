import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePdfImport } from './usePdfImport'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('usePdfImport', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = originalFetch
  })

  function makeOptions() {
    return {
      setData: vi.fn(),
      setShowLanding: vi.fn(),
      setHasImported: vi.fn(),
      setEditorStep: vi.fn(),
      setError: vi.fn(),
    }
  }

  it('does nothing when no file is selected', async () => {
    const options = makeOptions()
    const { result } = renderHook(() => usePdfImport(options))

    await act(async () => {
      await result.current.handleImport({
        target: { files: [] },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })

    expect(options.setShowLanding).not.toHaveBeenCalled()
    expect(options.setData).not.toHaveBeenCalled()
  })

  it('sets error when API responds with non-ok status', async () => {
    const options = makeOptions()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Import failed' }),
    })
    const { result } = renderHook(() => usePdfImport(options))

    const file = new File(['pdf'], 'cv.pdf', { type: 'application/pdf' })
    await act(async () => {
      await result.current.handleImport({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })

    expect(options.setShowLanding).toHaveBeenCalledWith(false)
    expect(options.setError).toHaveBeenCalledWith('Import failed')
  })

  it('handles complete SSE event and marks import as done', async () => {
    const options = makeOptions()
    const encoder = new TextEncoder()
    const payload = `data: ${JSON.stringify({
      type: 'complete',
      data: {
        personal: { name: 'Jane Doe', title: '', location: '', email: '', phone: '', links: [] },
        sections: [],
        template_id: 'harvard',
      },
    })}\n\n`

    let reads = 0
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: async () => {
            reads += 1
            if (reads === 1) {
              return { done: false, value: encoder.encode(payload) }
            }
            return { done: true, value: undefined }
          },
        }),
      },
    })

    const { result } = renderHook(() => usePdfImport(options))
    const file = new File(['pdf'], 'cv.pdf', { type: 'application/pdf' })

    await act(async () => {
      await result.current.handleImport({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })

    expect(options.setHasImported).toHaveBeenCalledWith(true)
    expect(options.setEditorStep).toHaveBeenCalledWith(999)
    expect(options.setError).toHaveBeenLastCalledWith(null)
  })
})
