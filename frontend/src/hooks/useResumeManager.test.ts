import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useResumeManager } from './useResumeManager'
import { getEmptyResumeData } from '../types'
import { ApiError } from '../api/client'

const mockListResumes = vi.fn()
const mockCreateResume = vi.fn()
const mockUpdateResume = vi.fn()
const mockDeleteResume = vi.fn()

vi.mock('../api/resumes', () => ({
  listResumes: (...args: unknown[]) => mockListResumes(...args),
  createResume: (...args: unknown[]) => mockCreateResume(...args),
  updateResume: (...args: unknown[]) => mockUpdateResume(...args),
  deleteResume: (...args: unknown[]) => mockDeleteResume(...args),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

function makeOptions(isAuthenticated: boolean) {
  return {
    isAuthenticated,
    setData: vi.fn(),
    setShowLanding: vi.fn(),
    setShowResumesPage: vi.fn(),
    setHasImported: vi.fn(),
    setEditorStep: vi.fn(),
    setError: vi.fn(),
    onLimitError: vi.fn(),
    data: getEmptyResumeData(),
  }
}

describe('useResumeManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resets editor state when user is not authenticated', () => {
    const options = makeOptions(false)
    renderHook(() => useResumeManager(options))

    expect(options.setShowResumesPage).toHaveBeenCalledWith(false)
    expect(options.setShowLanding).toHaveBeenCalledWith(true)
    expect(options.setHasImported).toHaveBeenCalledWith(false)
    expect(options.setEditorStep).toHaveBeenCalledWith(0)
    expect(options.setData).toHaveBeenCalledWith(expect.objectContaining({ template_id: 'harvard' }))
  })

  it('loads saved resumes when authenticated', async () => {
    const options = makeOptions(true)
    mockListResumes.mockResolvedValue({
      resumes: [{ id: 1, name: 'CV 1', json_content: null }],
    })

    const { result } = renderHook(() => useResumeManager(options))

    await waitFor(() => {
      expect(result.current.savedResumes).toHaveLength(1)
    })
    expect(result.current.savedResumes[0].name).toBe('CV 1')
  })

  it('creates a new resume when saving without currentResumeId', async () => {
    const options = makeOptions(true)
    mockListResumes.mockResolvedValue({ resumes: [] })
    mockCreateResume.mockResolvedValue({ id: 42 })

    const { result } = renderHook(() => useResumeManager(options))

    act(() => {
      result.current.setResumeName('My CV')
    })

    await act(async () => {
      await result.current.handleSaveResume()
    })

    expect(mockCreateResume).toHaveBeenCalledWith('My CV', options.data)
    expect(result.current.currentResumeId).toBe(42)
    expect(result.current.showSaveModal).toBe(false)
    expect(options.setError).toHaveBeenCalledWith(null)
  })

  it('handles 429 limit error and calls onLimitError', async () => {
    const options = makeOptions(true)
    mockListResumes.mockResolvedValue({ resumes: [] })
    mockCreateResume.mockRejectedValue(
      new ApiError('limit', 429, 'Guest accounts are limited to 1 resume'),
    )

    const { result } = renderHook(() => useResumeManager(options))

    await act(async () => {
      await result.current.handleSaveResume()
    })

    expect(options.onLimitError).toHaveBeenCalled()
    expect(options.setError).toHaveBeenCalledWith('guest.limitReached')
  })
})
