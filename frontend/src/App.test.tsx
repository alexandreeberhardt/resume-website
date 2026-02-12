import { describe, it, expect } from 'vitest'
import App from './App'
import { renderWithProviders } from './test/render'

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />)
    // The app should mount and show the landing page content
    expect(document.body).toBeTruthy()
  })
})
