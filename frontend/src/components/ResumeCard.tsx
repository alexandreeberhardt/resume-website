import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, PencilSimple, Trash, Check } from '@phosphor-icons/react'
import { SavedResume } from '../types'
import { isMobileDevice } from '../utils/deviceDetection'
import { getCsrfToken } from '../api/client'

const API_URL = import.meta.env.DEV ? '/api' : ''

interface ResumeCardProps {
  resume: SavedResume
  isActive: boolean
  onOpen: () => void
  onDelete: () => void
  onRename: (newName: string) => void
}

export default function ResumeCard({
  resume,
  isActive,
  onOpen,
  onDelete,
  onRename,
}: ResumeCardProps) {
  const { t } = useTranslation()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isMobile] = useState(isMobileDevice)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(resume.name)

  const generatePreview = useCallback(async () => {
    if (!resume.json_content) return

    setLoading(true)
    try {
      const csrfToken = getCsrfToken()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }
      const response = await fetch(`${API_URL}/generate?preview=true`, {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({ ...resume.json_content, lang: 'fr' }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
      }
    } catch (err) {
      console.error('Failed to generate preview:', err)
    } finally {
      setLoading(false)
    }
  }, [resume.json_content])

  useEffect(() => {
    if (resume.json_content) {
      generatePreview()
    }
  }, [resume.id, resume.json_content, generatePreview])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const templateId = resume.json_content?.template_id?.replace(/_compact|_large/, '') || 'harvard'
  const displayName = resume.name

  return (
    <div
      className={`group bg-surface-0/92 rounded-[1.6rem] border overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
        isActive
          ? 'border-brand ring-2 ring-brand/20 shadow-[0_20px_38px_-24px_rgba(15,118,110,0.55)]'
          : 'border-primary-200/75 hover:border-primary-300 shadow-[0_18px_34px_-28px_rgba(10,21,16,0.35)]'
      }`}
      onClick={onOpen}
    >
      {/* Preview */}
      <div className="relative aspect-[210/297] bg-primary-50/75 overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full border-2 border-primary-200 border-t-brand animate-spin" />
          </div>
        ) : previewUrl && !isMobile ? (
          <object
            data={previewUrl}
            type="application/pdf"
            className="w-full h-full pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-primary-300" />
            </div>
          </object>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-primary-300" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/92 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/40">
            <span className="text-sm font-medium text-primary-700">
              {t('resumes.open') || 'Ouvrir'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
              setEditName(resume.name)
            }}
            className="p-2 bg-white/90 hover:bg-primary-50 text-primary-400 hover:text-primary-700 rounded-lg transition-all shadow-sm"
            title={t('resumes.rename') || 'Renommer'}
          >
            <PencilSimple className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 bg-white/90 hover:bg-error-50 text-primary-400 hover:text-error-600 rounded-lg transition-all shadow-sm"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-brand text-white text-xs font-semibold rounded-lg">
            {t('resumes.current') || 'Actuel'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        {isEditing ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editName.trim()) {
                  onRename(editName.trim())
                  setIsEditing(false)
                } else if (e.key === 'Escape') {
                  setIsEditing(false)
                  setEditName(resume.name)
                }
              }}
              autoFocus
              className="flex-1 min-w-0 px-2 py-0.5 text-sm font-medium text-primary-900 bg-surface-0 border border-primary-200 rounded focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
            <button
              onClick={() => {
                if (editName.trim()) {
                  onRename(editName.trim())
                  setIsEditing(false)
                }
              }}
              className="p-1 text-brand hover:text-brand-dark rounded transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <h3 className="font-semibold text-primary-900 truncate tracking-tight">{displayName}</h3>
        )}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-primary-500 capitalize">{templateId}</span>
          {resume.created_at && (
            <span className="text-xs text-primary-400">
              {new Date(resume.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
