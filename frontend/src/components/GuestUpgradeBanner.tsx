/**
 * Guest Upgrade Banner - Floating banner for guest users to create a permanent account
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkle, X } from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import GuestUpgradeModal from './GuestUpgradeModal'

export default function GuestUpgradeBanner() {
  const { t } = useTranslation()
  const { isGuest } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Don't show if not a guest or if dismissed
  if (!isGuest || dismissed) {
    return null
  }

  return (
    <>
      {/* Floating Banner */}
      <div className="fixed bottom-20 lg:bottom-5 left-5 right-5 lg:left-auto lg:right-5 lg:w-96 z-40 animate-slide-up">
        <div className="bg-gradient-to-r from-brand to-indigo-600 rounded-2xl shadow-xl shadow-brand/30 p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-0.5">{t('guest.upgradeBannerTitle')}</h3>
              <p className="text-xs text-white/80 mb-3">{t('guest.upgradeBannerDesc')}</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-brand font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
              >
                {t('guest.createAccount')}
              </button>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && <GuestUpgradeModal onClose={() => setShowModal(false)} />}
    </>
  )
}
