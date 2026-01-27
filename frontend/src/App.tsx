import { useState, useEffect } from 'react';
import { FileDown, Loader2, AlertCircle } from 'lucide-react';
import { ResumeData, emptyResumeData } from './types';
import PersonalSection from './components/PersonalSection';
import EducationSection from './components/EducationSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectSection from './components/ProjectSection';
import SkillsSection from './components/SkillsSection';
import LeadershipSection from './components/LeadershipSection';
import SectionToggle from './components/SectionToggle';

// URL de l'API (en dev: proxy vers localhost:8000, en prod: même domaine)
const API_URL = import.meta.env.DEV ? '/api' : '';

function App() {
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Charger les données par défaut au démarrage
  useEffect(() => {
    fetch(`${API_URL}/default-data`)
      .then((res) => res.json())
      .then((defaultData) => {
        setData({
          ...defaultData,
          flags: defaultData.flags || emptyResumeData.flags,
        });
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement données:', err);
        setInitialLoading(false);
      });
  }, []);

  // Générer et télécharger le PDF
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Erreur lors de la génération');
      }

      // Télécharger le PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour générique des données
  const updateData = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle une section
  const toggleSection = (key: keyof ResumeData['flags']) => {
    setData((prev) => ({
      ...prev,
      flags: { ...prev.flags, [key]: !prev.flags[key] },
    }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">CV Generator</h1>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Générer PDF
              </>
            )}
          </button>
        </div>
      </header>

      {/* Erreur */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Colonne gauche - Toggles des sections */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4">Sections</h2>
              <div className="space-y-3">
                <SectionToggle
                  label="Education"
                  checked={data.flags.show_education}
                  onChange={() => toggleSection('show_education')}
                />
                <SectionToggle
                  label="Expériences"
                  checked={data.flags.show_experiences}
                  onChange={() => toggleSection('show_experiences')}
                />
                <SectionToggle
                  label="Projets"
                  checked={data.flags.show_projects}
                  onChange={() => toggleSection('show_projects')}
                />
                <SectionToggle
                  label="Compétences"
                  checked={data.flags.show_skills}
                  onChange={() => toggleSection('show_skills')}
                />
                <SectionToggle
                  label="Leadership"
                  checked={data.flags.show_leadership}
                  onChange={() => toggleSection('show_leadership')}
                />
                <SectionToggle
                  label="Langues"
                  checked={data.flags.show_languages}
                  onChange={() => toggleSection('show_languages')}
                />
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaire */}
          <div className="lg:col-span-3 space-y-6">
            {/* Informations personnelles (toujours visible) */}
            <PersonalSection
              data={data.personal}
              onChange={(personal) => updateData('personal', personal)}
            />

            {/* Education */}
            {data.flags.show_education && (
              <EducationSection
                data={data.education}
                onChange={(education) => updateData('education', education)}
              />
            )}

            {/* Expériences */}
            {data.flags.show_experiences && (
              <ExperienceSection
                data={data.experiences}
                onChange={(experiences) => updateData('experiences', experiences)}
              />
            )}

            {/* Projets */}
            {data.flags.show_projects && (
              <ProjectSection
                data={data.projects}
                onChange={(projects) => updateData('projects', projects)}
              />
            )}

            {/* Compétences */}
            {data.flags.show_skills && (
              <SkillsSection
                data={data.skills}
                onChange={(skills) => updateData('skills', skills)}
              />
            )}

            {/* Leadership */}
            {data.flags.show_leadership && (
              <LeadershipSection
                data={data.leadership}
                onChange={(leadership) => updateData('leadership', leadership)}
              />
            )}

            {/* Langues */}
            {data.flags.show_languages && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Langues</h2>
                <input
                  type="text"
                  value={data.languages_spoken}
                  onChange={(e) => updateData('languages_spoken', e.target.value)}
                  placeholder="Ex: French (Native), English (Fluent)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
