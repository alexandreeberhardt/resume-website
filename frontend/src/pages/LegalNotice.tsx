/**
 * Mentions Légales / Legal Notice page
 */
import { useTranslation } from 'react-i18next'
import { FileText, ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function LegalNotice() {
  const { t, i18n } = useTranslation()
  const isFrench = i18n.language.startsWith('fr')

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-surface-0/80 backdrop-blur-xl border-b border-primary-100/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FileText className="w-7 h-7 text-primary-900" />
            <span className="text-lg font-semibold text-primary-900">{t('landing.appName')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link to="/" className="btn-ghost text-sm">
              <ArrowLeft className="w-4 h-4" />
              {t('legal.backToHome')}
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">{t('legal.legalNotice.title')}</h1>

        <div className="prose prose-primary dark:prose-invert max-w-none space-y-8">
          {isFrench ? (
            <>
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">1. Éditeur du site</h2>
                <p className="text-primary-700">
                  Le site Sivee.pro est édité par :<br />
                  <strong>Alexandre Eberhardt</strong>
                  <br />
                  Personne physique
                  <br />
                  Contact :{' '}
                  <a href="mailto:contact@sivee.pro" className="text-brand hover:underline">
                    contact@sivee.pro
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">2. Hébergement</h2>
                <p className="text-primary-700">
                  Le site est hébergé par :<br />
                  <strong>OVHcloud</strong>
                  <br />
                  2 rue Kellermann
                  <br />
                  59100 Roubaix, France
                  <br />
                  <a
                    href="https://www.ovhcloud.com"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.ovhcloud.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  3. Propriété intellectuelle
                </h2>
                <p className="text-primary-700">
                  L'ensemble du contenu du site Sivee.pro (textes, images, logos, design, code
                  source) est protégé par le droit d'auteur et reste la propriété exclusive de
                  l'éditeur, sauf mention contraire.
                </p>
                <p className="text-primary-700">
                  Toute reproduction, représentation, modification ou exploitation non autorisée de
                  tout ou partie du site est interdite.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">4. Responsabilité</h2>
                <p className="text-primary-700">
                  L'éditeur s'efforce d'assurer l'exactitude des informations diffusées sur le site.
                  Toutefois, il ne peut garantir l'exactitude, la complétude et l'actualité des
                  informations.
                </p>
                <p className="text-primary-700">
                  L'utilisateur est seul responsable de l'utilisation qu'il fait du service et des
                  documents générés via Sivee.pro.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  5. Données personnelles
                </h2>
                <p className="text-primary-700">
                  Pour en savoir plus sur la collecte et le traitement de vos données personnelles,
                  consultez notre{' '}
                  <Link to="/politique-confidentialite" className="text-brand hover:underline">
                    Politique de confidentialité
                  </Link>
                  .
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  1. Website Publisher
                </h2>
                <p className="text-primary-700">
                  The Sivee.pro website is published by:
                  <br />
                  <strong>Alexandre Eberhardt</strong>
                  <br />
                  Individual
                  <br />
                  Contact:{' '}
                  <a href="mailto:contact@sivee.pro" className="text-brand hover:underline">
                    contact@sivee.pro
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">2. Hosting</h2>
                <p className="text-primary-700">
                  The website is hosted by:
                  <br />
                  <strong>OVHcloud</strong>
                  <br />
                  2 rue Kellermann
                  <br />
                  59100 Roubaix, France
                  <br />
                  <a
                    href="https://www.ovhcloud.com"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.ovhcloud.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  3. Intellectual Property
                </h2>
                <p className="text-primary-700">
                  All content on the Sivee.pro website (texts, images, logos, design, source code)
                  is protected by copyright and remains the exclusive property of the publisher,
                  unless otherwise stated.
                </p>
                <p className="text-primary-700">
                  Any unauthorized reproduction, representation, modification or exploitation of all
                  or part of the site is prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">4. Liability</h2>
                <p className="text-primary-700">
                  The publisher strives to ensure the accuracy of information published on the site.
                  However, they cannot guarantee the accuracy, completeness and timeliness of the
                  information.
                </p>
                <p className="text-primary-700">
                  The user is solely responsible for their use of the service and documents
                  generated via Sivee.pro.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">5. Personal Data</h2>
                <p className="text-primary-700">
                  To learn more about the collection and processing of your personal data, please
                  see our{' '}
                  <Link to="/privacy-policy" className="text-brand hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </section>
            </>
          )}
        </div>

        <p className="text-sm text-primary-400 mt-12">
          {t('legal.lastUpdated')}: {new Date().toLocaleDateString(i18n.language)}
        </p>
      </main>
    </div>
  )
}
