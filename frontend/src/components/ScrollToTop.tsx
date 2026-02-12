/**
 * ScrollToTop component - scrolls to top on legal page navigation
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const LEGAL_PATHS = [
  '/mentions-legales',
  '/legal-notice',
  '/politique-confidentialite',
  '/privacy-policy',
  '/cgu',
  '/terms',
]

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Only scroll to top when navigating to legal pages
    if (LEGAL_PATHS.includes(pathname)) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
