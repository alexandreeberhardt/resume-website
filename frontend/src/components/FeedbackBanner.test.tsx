import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FeedbackBanner from './FeedbackBanner'
import { FeedbackModal } from './FeedbackBanner'
import { ApiError } from '../api/client'
import '../i18n'

const mockSubmitFeedback = vi.fn()
const mockUseAuth = vi.fn()

vi.mock('../api/auth', () => ({
  submitFeedback: (...args: unknown[]) => mockSubmitFeedback(...args),
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('FeedbackBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render for guest users', () => {
    mockUseAuth.mockReturnValue({
      isGuest: true,
      user: { email: 'guest@site.test', feedbackCompleted: false },
    })

    const { container } = render(<FeedbackBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('opens feedback modal when clicking CTA', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      isGuest: false,
      user: { email: 'user@test.com', feedbackCompleted: false },
    })

    render(<FeedbackBanner />)
    await user.click(screen.getByRole('button', { name: /give feedback/i }))

    expect(screen.getByText('Your feedback matters')).toBeInTheDocument()
  })
})

describe('FeedbackModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits feedback when ease rating is selected', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    mockSubmitFeedback.mockResolvedValue({ bonus_resumes: 3, bonus_downloads: 5 })

    render(<FeedbackModal onClose={vi.fn()} onSuccess={onSuccess} />)

    await user.click(screen.getAllByRole('button', { name: '8' })[0])
    await user.click(screen.getByRole('button', { name: /submit feedback/i }))

    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          ease_rating: 8,
        }),
      )
    })
    expect(await screen.findByText('Thank you for your feedback!')).toBeInTheDocument()
  })

  it('shows already-completed message on 409 error', async () => {
    const user = userEvent.setup()
    mockSubmitFeedback.mockRejectedValue(new ApiError('conflict', 409, 'already'))

    render(<FeedbackModal onClose={vi.fn()} onSuccess={vi.fn()} />)

    await user.click(screen.getAllByRole('button', { name: '7' })[0])
    await user.click(screen.getByRole('button', { name: /submit feedback/i }))

    expect(await screen.findByText('Thank you, you have already submitted your feedback!')).toBeInTheDocument()
  })
})
