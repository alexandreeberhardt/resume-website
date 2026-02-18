/**
 * API client with cookie-based auth + CSRF header handling
 */

// API base URL - always use /api prefix
const API_BASE_URL = '/api'

// Token storage keys
const TOKEN_KEY = 'access_token'
const CSRF_COOKIE_KEY = 'csrf_token'

/**
 * Get stored token from localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Store token in localStorage
 */
export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Remove token from localStorage
 */
export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getCsrfToken = (): string | null => {
  const escaped = CSRF_COOKIE_KEY.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Callback for handling 401 errors (token expired)
 */
let onUnauthorized: (() => void) | null = null

export const setOnUnauthorized = (callback: () => void): void => {
  onUnauthorized = callback
}

/**
 * API client with automatic token injection and error handling
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    ...options.headers,
  }

  // Add Content-Type for JSON requests (unless it's FormData or already set)
  if (!(options.body instanceof FormData) && !(headers as Record<string, string>)['Content-Type']) {
    ;(headers as Record<string, string>)['Content-Type'] = 'application/json'
  }

  // Add CSRF token for unsafe methods when cookie-based auth is used
  const method = (options.method || 'GET').toUpperCase()
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      ;(headers as Record<string, string>)['X-CSRF-Token'] = csrfToken
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'same-origin',
      signal: controller.signal,
    })
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'The server took too long to respond')
    }
    throw error
  }
  clearTimeout(timeoutId)

  // Handle 401 Unauthorized
  if (response.status === 401) {
    removeStoredToken()
    if (onUnauthorized) {
      onUnauthorized()
    }
    throw new ApiError('Session expired', 401, 'Please log in again')
  }

  // Handle other errors
  if (!response.ok) {
    let detail = 'An error occurred'
    try {
      const errorData = await response.json()
      detail = errorData.detail || detail
    } catch {
      // Ignore JSON parse errors
    }
    throw new ApiError(detail, response.status, detail)
  }

  // Return empty for 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    apiClient<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),

  // For form data (like OAuth2 login)
  postForm: <T>(endpoint: string, data: URLSearchParams) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString(),
    }),
}
