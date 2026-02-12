/**
 * Conditions Générales d'Utilisation / Terms of Service page
 */
import { useTranslation } from 'react-i18next'
import { FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function TermsOfService() {
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
        <h1 className="text-3xl font-bold text-primary-900 mb-8">
          {t('legal.termsOfService.title')}
        </h1>

        <div className="prose prose-primary dark:prose-invert max-w-none space-y-8">
          {isFrench ? (
            <>
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">1. Objet</h2>
                <p className="text-primary-700">
                  Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du
                  service Sivee.pro, un outil en ligne de création et génération de CV
                  professionnels.
                </p>
                <p className="text-primary-700">
                  En utilisant Sivee.pro, vous acceptez sans réserve les présentes CGU.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  2. Description du service
                </h2>
                <p className="text-primary-700">Sivee.pro propose :</p>
                <ul className="list-disc list-inside text-primary-700 space-y-2">
                  <li>La création de CV à partir de modèles professionnels</li>
                  <li>L'import automatique de CV existants (format PDF)</li>
                  <li>L'export de CV au format PDF avec rendu LaTeX</li>
                  <li>La sauvegarde de vos CV dans votre espace personnel</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  3. Inscription et compte
                </h2>
                <p className="text-primary-700">
                  Pour utiliser Sivee.pro, vous devez créer un compte en fournissant une adresse
                  email valide.
                </p>
                <p className="text-primary-700">
                  Vous êtes responsable de la confidentialité de vos identifiants de connexion et de
                  toute activité effectuée depuis votre compte.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  4. Utilisation du service
                </h2>
                <p className="text-primary-700">Vous vous engagez à :</p>
                <ul className="list-disc list-inside text-primary-700 space-y-2">
                  <li>Utiliser le service conformément à sa destination</li>
                  <li>Ne pas tenter de contourner les mesures de sécurité</li>
                  <li>Ne pas utiliser le service à des fins illégales</li>
                  <li>Ne pas surcharger les serveurs par des requêtes excessives</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  5. Propriété des contenus
                </h2>
                <p className="text-primary-700">
                  Vous restez propriétaire des contenus que vous saisissez dans vos CV (textes,
                  informations personnelles).
                </p>
                <p className="text-primary-700">
                  Les modèles de CV, le design et le code source de Sivee.pro restent la propriété
                  exclusive de l'éditeur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">6. Tarification</h2>
                <p className="text-primary-700">
                  Sivee.pro propose actuellement un accès gratuit à ses fonctionnalités de base.
                </p>
                <p className="text-primary-700">
                  Des fonctionnalités premium payantes pourront être proposées ultérieurement. Vous
                  serez informé de tout changement tarifaire.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  7. Disponibilité du service
                </h2>
                <p className="text-primary-700">
                  Sivee.pro s'efforce d'assurer une disponibilité maximale du service, mais ne
                  garantit pas une disponibilité continue et ininterrompue.
                </p>
                <p className="text-primary-700">
                  Des interruptions pour maintenance peuvent survenir sans préavis.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  8. Limitation de responsabilité
                </h2>
                <p className="text-primary-700">
                  Sivee.pro est fourni "en l'état". L'éditeur ne saurait être tenu responsable :
                </p>
                <ul className="list-disc list-inside text-primary-700 space-y-2">
                  <li>Des erreurs ou inexactitudes dans les CV générés</li>
                  <li>De l'utilisation que vous faites des documents générés</li>
                  <li>De la perte de données en cas de problème technique</li>
                  <li>Des conséquences liées à l'utilisation du service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">9. Résiliation</h2>
                <p className="text-primary-700">
                  Vous pouvez supprimer votre compte à tout moment depuis votre espace personnel.
                </p>
                <p className="text-primary-700">
                  L'éditeur se réserve le droit de suspendre ou supprimer un compte en cas de
                  violation des présentes CGU.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  10. Modification des CGU
                </h2>
                <p className="text-primary-700">
                  L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les
                  utilisateurs seront informés des modifications significatives.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  11. Droit applicable
                </h2>
                <p className="text-primary-700">
                  Les présentes CGU sont régies par le droit français. En cas de litige, les
                  tribunaux français seront seuls compétents.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">12. Contact</h2>
                <p className="text-primary-700">
                  Pour toute question concernant ces CGU, contactez-nous à :{' '}
                  <a href="mailto:contact@sivee.pro" className="text-brand hover:underline">
                    contact@sivee.pro
                  </a>
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">1. Purpose</h2>
                <p className="text-primary-700">
                  These Terms of Service (ToS) govern the use of Sivee.pro, an online tool for
                  creating and generating professional resumes.
                </p>
                <p className="text-primary-700">
                  By using Sivee.pro, you unreservedly accept these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  2. Service Description
                </h2>
                <p className="text-primary-700">Sivee.pro offers:</p>
                <ul className="list-disc list-inside text-primary-700 space-y-2">
                  <li>Resume creation using professional templates</li>
                  <li>Automatic import of existing resumes (PDF format)</li>
                  <li>PDF export with LaTeX rendering</li>
                  <li>Saving your resumes in your personal space</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  3. Registration and Account
                </h2>
                <p className="text-primary-700">
                  To use Sivee.pro, you must create an account by providing a valid email address.
                </p>
                <p className="text-primary-700">
                  You are responsible for the confidentiality of your login credentials and all
                  activity from your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">4. Service Usage</h2>
                <p className="text-primary-700">You agree to:</p>
                <ul className="list-disc list-inside text-primary-700 space-y-2">
                  <li>Use the service for its intended purpose</li>
                  <li>Not attempt to bypass security measures</li>
                  <li>Not use the service for illegal purposes</li>
                  <li>Not overload servers with excessive requests</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  5. Content Ownership
                </h2>
                <p className="text-primary-700">
                  You retain ownership of the content you enter in your resumes (text, personal
                  information).
                </p>
                <p className="text-primary-700">
                  Resume templates, design, and source code of Sivee.pro remain the exclusive
                  property of the publisher.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">6. Pricing</h2>
                <p className="text-primary-700">
                  Sivee.pro currently offers free access to its basic features.
                </p>
                <p className="text-primary-700">
                  Paid premium features may be offered in the future. You will be informed of any
                  pricing changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  7. Service Availability
                </h2>
                <p className="text-primary-700">
                  Sivee.pro strives to ensure maximum service availability, but does not guarantee
                  continuous and uninterrupted availability.
                </p>
                <p className="text-primary-700">
                  Maintenance interruptions may occur without notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-primary-700">
                  Sivee.pro is provided "as is". The publisher cannot be held responsible for:
                </p>
                <ul className="list-disc list-inside text-primary-700 space-y-2">
                  <li>Errors or inaccuracies in generated resumes</li>
                  <li>Your use of generated documents</li>
                  <li>Data loss due to technical issues</li>
                  <li>Consequences related to service use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">9. Termination</h2>
                <p className="text-primary-700">
                  You can delete your account at any time from your personal space.
                </p>
                <p className="text-primary-700">
                  The publisher reserves the right to suspend or delete an account in case of
                  violation of these ToS.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  10. ToS Modifications
                </h2>
                <p className="text-primary-700">
                  The publisher reserves the right to modify these ToS at any time. Users will be
                  informed of significant changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">11. Applicable Law</h2>
                <p className="text-primary-700">
                  These ToS are governed by French law. In case of dispute, French courts will have
                  exclusive jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">12. Contact</h2>
                <p className="text-primary-700">
                  For any questions regarding these ToS, contact us at:{' '}
                  <a href="mailto:contact@sivee.pro" className="text-brand hover:underline">
                    contact@sivee.pro
                  </a>
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
