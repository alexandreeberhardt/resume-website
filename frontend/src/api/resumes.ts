/**
 * Resumes API functions (cookie-authenticated)
 */
import { api, getCsrfToken } from './client'
import type { SavedResume, SavedResumeListResponse, ResumeData } from '../types'

/**
 * Create a new resume
 */
export async function createResume(name: string, jsonContent?: ResumeData): Promise<SavedResume> {
  return api.post<SavedResume>('/resumes', {
    name,
    json_content: jsonContent || null,
  })
}

/**
 * List all resumes for the authenticated user
 */
export async function listResumes(): Promise<SavedResumeListResponse> {
  return api.get<SavedResumeListResponse>('/resumes')
}

/**
 * Get a specific resume by ID
 */
export async function getResume(id: number): Promise<SavedResume> {
  return api.get<SavedResume>(`/resumes/${id}`)
}

/**
 * Update a resume
 */
export async function updateResume(
  id: number,
  data: { name?: string; json_content?: ResumeData },
): Promise<SavedResume> {
  return api.put<SavedResume>(`/resumes/${id}`, data)
}

/**
 * Delete a resume
 */
export async function deleteResume(id: number): Promise<void> {
  return api.delete(`/resumes/${id}`)
}

/**
 * Generate PDF from a saved resume
 * Returns a Blob for download
 */
export async function generateResumePdf(
  id: number,
  templateId: string = 'harvard',
  lang: string = 'fr',
): Promise<Blob> {
  const API_BASE_URL = import.meta.env.DEV ? '/api' : ''
  const csrfToken = getCsrfToken()
  const headers: Record<string, string> = {}
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
  }

  const response = await fetch(
    `${API_BASE_URL}/resumes/${id}/generate?template_id=${templateId}&lang=${lang}`,
    {
      method: 'POST',
      headers,
      credentials: 'same-origin',
    },
  )

  if (!response.ok) {
    let detail = 'PDF generation failed'
    try {
      const errorData = await response.json()
      detail = errorData.detail || detail
    } catch {
      // Ignore
    }
    throw new Error(detail)
  }

  return response.blob()
}
