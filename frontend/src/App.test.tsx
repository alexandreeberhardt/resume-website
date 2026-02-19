import { describe, it, expect } from 'vitest'
import App from './App'
import { renderWithProviders } from './test/render'

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />)
    expect(document.body).toBeTruthy()
  })
})
