/**
 * Feedback Banner - Card on Account page for registered users to submit feedback
 * and receive bonus save/download limits.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ChatCircleText, SpinnerGap, CheckCircle, WarningCircle, Gift } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { submitFeedback } from '../api/auth'
import { ApiError } from '../api/client'

export default function FeedbackBanner() {
  const { t } = useTranslation()
  const { user, isGuest } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Don't show for guests or if feedback already completed
  if (isGuest || !user || user.feedbackCompleted || completed) {
    return null
  }

  return (
    <>
      {/* Banner Card */}
      <div className="card p-6 mb-6 border-brand/20 bg-gradient-to-r from-brand/5 to-indigo-500/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-brand" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary-900 mb-1">{t('feedback.bannerTitle')}</h3>
            <p className="text-sm text-primary-500 mb-4">{t('feedback.bannerDesc')}</p>
            <button onClick={() => setShowModal(true)} className="btn-brand text-sm">
              <ChatCircleText className="w-4 h-4" />
              {t('feedback.bannerCta')}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showModal && (
        <FeedbackModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setCompleted(true)
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-1">
      <div className="w-7 h-7 rounded-lg bg-brand/10 dark:bg-brand/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-primary-800 dark:text-white uppercase tracking-wide">
        {title}
      </h3>
      <div className="flex-1 h-px bg-primary-100 dark:bg-primary-700/50" />
    </div>
  )
}

function RatingScale({
  value,
  onChange,
  min = 1,
  max = 10,
  colorFn,
}: {
  value: number | null
  onChange: (n: number) => void
  min?: number
  max?: number
  colorFn?: (n: number, selected: boolean) => string
}) {
  const defaultColor = (_n: number, selected: boolean) =>
    selected
      ? 'bg-brand text-white shadow-sm scale-110'
      : 'bg-primary-100 dark:bg-primary-700/50 text-primary-500 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-600/50'

  const getColor = colorFn || defaultColor

  return (
    <div className="flex gap-1.5 justify-between">
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => {
        const selected = value !== null && n <= value
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-all duration-150 ${getColor(n, selected)}`}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}

export function FeedbackModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const { t } = useTranslation()

  const [profile, setProfile] = useState('')
  const [targetSector, setTargetSector] = useState('')
  const [source, setSource] = useState('')
  const [easeRating, setEaseRating] = useState(0)
  const [timeSpent, setTimeSpent] = useState('')
  const [obstacles, setObstacles] = useState('')
  const [alternative, setAlternative] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [nps, setNps] = useState<number | null>(null)
  const [futureHelp, setFutureHelp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ resumes: number; downloads: number } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (easeRating === 0) {
      setError(t('feedback.easeRatingLabel'))
      return
    }

    setLoading(true)
    try {
      const response = await submitFeedback({
        profile: profile || undefined,
        target_sector: targetSector || undefined,
        source: source || undefined,
        ease_rating: easeRating,
        time_spent: timeSpent || undefined,
        obstacles: obstacles || undefined,
        alternative: alternative || undefined,
        suggestions: suggestions || undefined,
        nps: nps ?? undefined,
        future_help: futureHelp || undefined,
      })
      setSuccess({
        resumes: response.bonus_resumes,
        downloads: response.bonus_downloads,
      })
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError(t('feedback.alreadyCompleted'))
        } else {
          setError(err.detail || t('auth.errors.generic'))
        }
      } else {
        setError(t('auth.errors.generic'))
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 backdrop-blur-sm p-4">
        <div className="bg-surface-0 dark:bg-surface-0 rounded-2xl shadow-xl border border-primary-100/30 dark:border-primary-700/30 w-full max-w-md animate-fade-in">
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-success-100 dark:bg-success-500/20 rounded-2xl mb-4 animate-bounce-in">
              <CheckCircle className="w-7 h-7 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">
              {t('feedback.successTitle')}
            </h2>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              {t('feedback.successDesc', {
                resumes: success.resumes,
                downloads: success.downloads,
              })}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 backdrop-blur-sm p-4">
      <div className="bg-surface-0 dark:bg-surface-0 rounded-2xl shadow-xl border border-primary-100/30 dark:border-primary-700/30 w-full max-w-lg animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary-100/50 dark:border-primary-700/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 dark:bg-brand/20 rounded-xl flex items-center justify-center">
              <ChatCircleText className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">
                {t('feedback.modalTitle')}
              </h2>
              <p className="text-xs text-primary-500 dark:text-primary-400">
                {t('feedback.modalSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="p-6">
            {/* Error message */}
            {error && (
              <div className="mb-5 p-3 bg-error-50 dark:bg-error-100/20 border border-error-200 dark:border-error-500/30 rounded-xl flex items-center gap-3 animate-shake">
                <div className="w-8 h-8 bg-error-100 dark:bg-error-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <WarningCircle className="w-4 h-4 text-error-600 dark:text-error-500" />
                </div>
                <p className="text-sm text-error-700 dark:text-error-400 flex-1 min-w-0">{error}</p>
              </div>
            )}

            <form id="feedback-form" onSubmit={handleSubmit} className="space-y-6">
              {/* ── Section 1: About you ── */}
              <section className="space-y-4">
                <SectionHeader
                  icon={
                    <svg
                      className="w-3.5 h-3.5 text-brand"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                  title={t('feedback.sectionAboutYou')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="feedback-profile" className="label">
                      {t('feedback.profileLabel')}
                    </label>
                    <select
                      id="feedback-profile"
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      className="input"
                    >
                      <option value="">—</option>
                      <option value="student">{t('feedback.profileOptions.student')}</option>
                      <option value="graduate">{t('feedback.profileOptions.graduate')}</option>
                      <option value="employed">{t('feedback.profileOptions.employed')}</option>
                      <option value="freelance">{t('feedback.profileOptions.freelance')}</option>
                      <option value="unemployed">{t('feedback.profileOptions.unemployed')}</option>
                      <option value="career_change">
                        {t('feedback.profileOptions.career_change')}
                      </option>
                      <option value="other">{t('feedback.profileOptions.other')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="feedback-source" className="label">
                      {t('feedback.sourceLabel')}
                    </label>
                    <select
                      id="feedback-source"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="input"
                    >
                      <option value="">—</option>
                      <option value="search">{t('feedback.sourceOptions.search')}</option>
                      <option value="social">{t('feedback.sourceOptions.social')}</option>
                      <option value="word_of_mouth">
                        {t('feedback.sourceOptions.wordOfMouth')}
                      </option>
                      <option value="other">{t('feedback.sourceOptions.other')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback-target-sector" className="label">
                    {t('feedback.targetSectorLabel')}
                  </label>
                  <input
                    type="text"
                    id="feedback-target-sector"
                    value={targetSector}
                    onChange={(e) => setTargetSector(e.target.value)}
                    placeholder={t('feedback.targetSectorPlaceholder')}
                    className="input"
                    maxLength={255}
                  />
                </div>
              </section>

              {/* ── Section 2: Your experience ── */}
              <section className="space-y-4">
                <SectionHeader
                  icon={
                    <svg
                      className="w-3.5 h-3.5 text-brand"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  }
                  title={t('feedback.sectionExperience')}
                />

                {/* Ease rating */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="label !mb-0">
                      {t('feedback.easeRatingLabel')}
                      <span className="ml-1.5 text-[10px] font-medium text-brand bg-brand/10 px-1.5 py-0.5 rounded-full">
                        {t('feedback.required')}
                      </span>
                    </label>
                    {easeRating > 0 && (
                      <span className="text-sm text-brand font-bold tabular-nums">
                        {easeRating}/10
                      </span>
                    )}
                  </div>
                  <RatingScale
                    value={easeRating || null}
                    onChange={setEaseRating}
                    min={1}
                    max={10}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="feedback-time-spent" className="label">
                      {t('feedback.timeSpentLabel')}
                    </label>
                    <select
                      id="feedback-time-spent"
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(e.target.value)}
                      className="input"
                    >
                      <option value="">—</option>
                      <option value="lt15">{t('feedback.timeSpentOptions.lt15')}</option>
                      <option value="15to30">{t('feedback.timeSpentOptions.15to30')}</option>
                      <option value="30to60">{t('feedback.timeSpentOptions.30to60')}</option>
                      <option value="gt60">{t('feedback.timeSpentOptions.gt60')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="feedback-alternative" className="label">
                      {t('feedback.alternativeLabel')}
                    </label>
                    <select
                      id="feedback-alternative"
                      value={alternative}
                      onChange={(e) => setAlternative(e.target.value)}
                      className="input"
                    >
                      <option value="">—</option>
                      <option value="canva">{t('feedback.alternativeOptions.canva')}</option>
                      <option value="word">{t('feedback.alternativeOptions.word')}</option>
                      <option value="latex">{t('feedback.alternativeOptions.latex')}</option>
                      <option value="other_tool">
                        {t('feedback.alternativeOptions.other_tool')}
                      </option>
                      <option value="none">{t('feedback.alternativeOptions.none')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback-obstacles" className="label">
                    {t('feedback.obstaclesLabel')}
                  </label>
                  <textarea
                    id="feedback-obstacles"
                    value={obstacles}
                    onChange={(e) => setObstacles(e.target.value)}
                    placeholder={t('feedback.obstaclesPlaceholder')}
                    className="input min-h-[70px] resize-none"
                    rows={2}
                  />
                </div>
              </section>

              {/* ── Section 3: Your opinion ── */}
              <section className="space-y-4">
                <SectionHeader
                  icon={
                    <svg
                      className="w-3.5 h-3.5 text-brand"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  }
                  title={t('feedback.sectionOpinion')}
                />

                {/* NPS */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="label !mb-0">{t('feedback.npsLabel')}</label>
                    {nps !== null && (
                      <span className="text-sm font-bold tabular-nums text-brand">{nps}/10</span>
                    )}
                  </div>
                  <RatingScale value={nps} onChange={setNps} min={0} max={10} />
                  <div className="flex justify-between mt-1.5 px-1">
                    <span className="text-[10px] text-primary-400">
                      {t('feedback.npsNotLikely')}
                    </span>
                    <span className="text-[10px] text-primary-400">
                      {t('feedback.npsVeryLikely')}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="feedback-suggestions" className="label">
                    {t('feedback.suggestionsLabel')}
                  </label>
                  <textarea
                    id="feedback-suggestions"
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder={t('feedback.suggestionsPlaceholder')}
                    className="input min-h-[70px] resize-none"
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="feedback-future-help" className="label">
                    {t('feedback.futureHelpLabel')}
                  </label>
                  <textarea
                    id="feedback-future-help"
                    value={futureHelp}
                    onChange={(e) => setFutureHelp(e.target.value)}
                    placeholder={t('feedback.futureHelpPlaceholder')}
                    className="input min-h-[70px] resize-none"
                    rows={2}
                  />
                </div>
              </section>
            </form>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="px-6 py-4 border-t border-primary-100/50 dark:border-primary-700/50 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            form="feedback-form"
            disabled={loading || easeRating === 0}
            className="btn-brand flex-1"
          >
            {loading ? (
              <>
                <SpinnerGap className="w-4 h-4 animate-spin" />
                <span>{t('feedback.submitting')}</span>
              </>
            ) : (
              <span>{t('feedback.submit')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
