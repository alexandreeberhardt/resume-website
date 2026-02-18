import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import VerifyEmailPage from './VerifyEmailPage'
import { ApiError } from '../api/client'
import '../i18n'

const mockVerifyEmail = vi.fn()

vi.mock('../api/auth', () => ({
  verifyEmail: (...args: unknown[]) => mockVerifyEmail(...args),
}))

function renderPage(path: string) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows error state when token is missing', async () => {
    renderPage('/verify-email')

    expect(await screen.findByText('Verification failed')).toBeInTheDocument()
    expect(screen.getByText('This verification link is invalid or has expired.')).toBeInTheDocument()
    expect(mockVerifyEmail).not.toHaveBeenCalled()
  })

  it('verifies token successfully', async () => {
    mockVerifyEmail.mockResolvedValue(undefined)
    renderPage('/verify-email?token=ok-token')

    expect(await screen.findByText('Email verified!')).toBeInTheDocument()
    expect(mockVerifyEmail).toHaveBeenCalledWith('ok-token')
  })

  it('shows API error detail when verification fails', async () => {
    mockVerifyEmail.mockRejectedValue(new ApiError('bad', 400, 'Verification token expired'))
    renderPage('/verify-email?token=expired')

    expect(await screen.findByText('Verification failed')).toBeInTheDocument()
    expect(await screen.findByText('Verification token expired')).toBeInTheDocument()
  })

  it('falls back to generic invalid-link message on unknown error', async () => {
    mockVerifyEmail.mockRejectedValue(new Error('network down'))
    renderPage('/verify-email?token=any')

    expect(await screen.findByText('Verification failed')).toBeInTheDocument()
    expect(await screen.findByText('This verification link is invalid or has expired.')).toBeInTheDocument()
  })
})
