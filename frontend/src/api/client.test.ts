import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getCsrfToken,
  ApiError,
  apiClient,
  setOnUnauthorized,
  api,
} from './client'

describe('Token storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token stored', () => {
    expect(getStoredToken()).toBeNull()
  })

  it('stores and retrieves token', () => {
    setStoredToken('my-jwt-token')
    expect(getStoredToken()).toBe('my-jwt-token')
  })

  it('removes stored token', () => {
    setStoredToken('token')
    removeStoredToken()
    expect(getStoredToken()).toBeNull()
  })
})

describe('CSRF cookie', () => {
  beforeEach(() => {
    document.cookie = 'csrf_token=; Max-Age=0; path=/'
  })

  it('returns null when csrf cookie is missing', () => {
    expect(getCsrfToken()).toBeNull()
  })

  it('reads csrf token from cookie', () => {
    document.cookie = 'csrf_token=test-csrf-token; path=/'
    expect(getCsrfToken()).toBe('test-csrf-token')
  })
})

describe('ApiError', () => {
  it('has correct properties', () => {
    const err = new ApiError('Not found', 404, 'Resource not found')
    expect(err.message).toBe('Not found')
    expect(err.status).toBe(404)
    expect(err.detail).toBe('Resource not found')
    expect(err.name).toBe('ApiError')
  })

  it('is an instance of Error', () => {
    const err = new ApiError('fail', 500)
    expect(err).toBeInstanceOf(Error)
  })
})

describe('apiClient', () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
    localStorage.clear()
    document.cookie = 'csrf_token=; Max-Age=0; path=/'
    setOnUnauthorized(null!)
  })

  it('makes GET request and returns JSON', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1, name: 'Test' }),
    })

    const result = await apiClient('/test', { method: 'GET' })
    expect(result).toEqual({ id: 1, name: 'Test' })
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('injects X-CSRF-Token header for unsafe methods when cookie exists', async () => {
    document.cookie = 'csrf_token=my-csrf-token; path=/'
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })

    await apiClient('/test', { method: 'POST', body: JSON.stringify({ ok: true }) })
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(callArgs[1].headers['X-CSRF-Token']).toBe('my-csrf-token')
  })

  it('sets Content-Type to JSON by default', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })

    await apiClient('/test')
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(callArgs[1].headers['Content-Type']).toBe('application/json')
  })

  it('handles 204 No Content', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    })

    const result = await apiClient('/test')
    expect(result).toBeUndefined()
  })

  it('throws ApiError on 401 and calls onUnauthorized', async () => {
    const callback = vi.fn()
    setOnUnauthorized(callback)
    setStoredToken('expired-token')

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    })

    await expect(apiClient('/test')).rejects.toThrow(ApiError)
    expect(callback).toHaveBeenCalled()
    expect(getStoredToken()).toBeNull() // Token removed
  })

  it('throws ApiError with detail on error response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: 'Bad request data' }),
    })

    try {
      await apiClient('/test')
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect((e as ApiError).status).toBe(400)
      expect((e as ApiError).detail).toBe('Bad request data')
    }
  })

  it('handles error response without JSON body', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Not JSON')),
    })

    try {
      await apiClient('/test')
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect((e as ApiError).status).toBe(500)
    }
  })
})

describe('api convenience methods', () => {
  afterEach(() => {
    globalThis.fetch = vi.fn()
    localStorage.clear()
    document.cookie = 'csrf_token=; Max-Age=0; path=/'
  })

  it('api.get calls with GET method', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })

    await api.get('/items')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/items',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('api.post calls with POST and JSON body', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1 }),
    })

    await api.post('/items', { name: 'test' })
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(callArgs[1].method).toBe('POST')
    expect(callArgs[1].body).toBe(JSON.stringify({ name: 'test' }))
  })

  it('api.put calls with PUT method', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })

    await api.put('/items/1', { name: 'updated' })
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(callArgs[1].method).toBe('PUT')
  })

  it('api.delete calls with DELETE method', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    })

    await api.delete('/items/1')
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(callArgs[1].method).toBe('DELETE')
  })

  it('api.postForm sends form data', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ access_token: 'abc' }),
    })

    const params = new URLSearchParams()
    params.append('username', 'test@test.com')
    params.append('password', 'pass')

    await api.postForm('/auth/login', params)
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(callArgs[1].headers['Content-Type']).toBe('application/x-www-form-urlencoded')
  })
})
