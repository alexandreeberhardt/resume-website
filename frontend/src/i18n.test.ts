import { describe, it, expect } from 'vitest'
import i18n from './i18n'

describe('i18n configuration', () => {
  it('is initialized with expected languages', () => {
    expect(i18n.isInitialized).toBe(true)
    expect(i18n.options.supportedLngs).toEqual(
      expect.arrayContaining(['fr', 'en', 'es', 'de', 'pt', 'it']),
    )
  })

  it('has english fallback language', () => {
    const fallback = i18n.options.fallbackLng
    if (typeof fallback === 'string') {
      expect(fallback).toBe('en')
      return
    }
    expect(JSON.stringify(fallback)).toContain('en')
  })

  it('loads expected translation keys', () => {
    expect(i18n.t('landing.appName', { lng: 'en' })).toBe('Sivee')
    expect(i18n.t('legal.termsOfService.title', { lng: 'fr' })).toBeTruthy()
  })
})
