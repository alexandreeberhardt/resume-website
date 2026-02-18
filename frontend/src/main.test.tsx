import { describe, it, expect, vi, beforeEach } from 'vitest'

const renderMock = vi.fn()
const createRootMock = vi.fn(() => ({ render: renderMock }))

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: (...args: unknown[]) => createRootMock(...args),
  },
}))

vi.mock('./App', () => ({ default: () => null }))
vi.mock('./context/AuthContext', () => ({ AuthProvider: ({ children }: { children: unknown }) => children }))
vi.mock('./components/ScrollToTop', () => ({ default: () => null }))
vi.mock('./pages/LegalNotice', () => ({ default: () => null }))
vi.mock('./pages/PrivacyPolicy', () => ({ default: () => null }))
vi.mock('./pages/TermsOfService', () => ({ default: () => null }))
vi.mock('./pages/Account', () => ({ default: () => null }))
vi.mock('./pages/ResetPassword', () => ({ default: () => null }))
vi.mock('./pages/VerifyEmailPage', () => ({ default: () => null }))

describe('main entrypoint', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    document.body.innerHTML = '<div id="root"></div>'
  })

  it('mounts the app into #root', async () => {
    await import('./main')

    expect(createRootMock).toHaveBeenCalledTimes(1)
    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'))
    expect(renderMock).toHaveBeenCalledTimes(1)
  })
})
