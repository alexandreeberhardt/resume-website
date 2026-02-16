import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'fr', flag: '🇫🇷' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'es', flag: '🇪🇸' },
    { code: 'de', flag: '🇩🇪' },
    { code: 'pt', flag: '🇵🇹' },
    { code: 'it', flag: '🇮🇹' },
  ]

  return (
    <div className="relative flex items-center bg-primary-200 dark:bg-primary-300 rounded-lg p-1">
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="appearance-none bg-surface-0 shadow-sm rounded-md p-1.5 pr-6 text-sm text-primary-900 cursor-pointer outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.code.toUpperCase()}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 text-primary-400 text-[10px]">
        ▼
      </span>
    </div>
  )
}

export default LanguageSwitcher
