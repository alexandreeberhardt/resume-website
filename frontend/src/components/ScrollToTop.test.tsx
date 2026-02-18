import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

function renderAtPath(path: string) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="*" element={<ScrollToTop />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ScrollToTop', () => {
  const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

  beforeEach(() => {
    scrollSpy.mockClear()
  })

  it('scrolls to top on legal pages', () => {
    renderAtPath('/mentions-legales')
    expect(scrollSpy).toHaveBeenCalledWith(0, 0)
  })

  it('does not scroll on non-legal pages', () => {
    renderAtPath('/account')
    expect(scrollSpy).not.toHaveBeenCalled()
  })
})
