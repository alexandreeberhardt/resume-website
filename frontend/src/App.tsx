import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  FileDown,
  Loader2,
  AlertCircle,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  ResumeData,
  CVSection,
  emptyResumeData,
  createSection,
  SectionType,
  generateId,
  TemplateId,
  AVAILABLE_TEMPLATES,
} from './types';
import PersonalSection from './components/PersonalSection';
import SortableSection from './components/SortableSection';
import AddSectionModal from './components/AddSectionModal';

// URL de l'API (en dev: proxy vers localhost:8000, en prod: même domaine)
const API_URL = import.meta.env.DEV ? '/api' : '';

function App() {
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculer le nombre total d'étapes
  // Step 0: Personal, Steps 1-N: Sections dynamiques, Final Step: Review
  const totalSteps = data.sections.length + 2; // Personal + sections + Review
  const isFinalStep = currentStep === totalSteps - 1;
  const isPersonalStep = currentStep === 0;

  // Charger les données par défaut au démarrage
  useEffect(() => {
    fetch(`${API_URL}/default-data`)
      .then((res) => res.json())
      .then((defaultData) => {
        const convertedData = convertLegacyData(defaultData);
        setData(convertedData);
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement données:', err);
        setInitialLoading(false);
      });
  }, []);

  // Convertir l'ancien format de données vers le nouveau
  const convertLegacyData = (legacyData: any): ResumeData => {
    const sections: CVSection[] = [];

    if (legacyData.education?.length > 0) {
      sections.push({
        id: generateId(),
        type: 'education',
        title: 'Education',
        isVisible: true,
        items: legacyData.education,
      });
    }

    if (legacyData.experiences?.length > 0) {
      sections.push({
        id: generateId(),
        type: 'experiences',
        title: 'Experiences',
        isVisible: true,
        items: legacyData.experiences,
      });
    }

    if (legacyData.projects?.length > 0) {
      sections.push({
        id: generateId(),
        type: 'projects',
        title: 'Projects',
        isVisible: true,
        items: legacyData.projects.map((p: any) => ({ ...p, year: String(p.year) })),
      });
    }

    if (legacyData.skills) {
      sections.push({
        id: generateId(),
        type: 'skills',
        title: 'Technical Skills',
        isVisible: true,
        items: legacyData.skills,
      });
    }

    if (legacyData.leadership?.length > 0) {
      sections.push({
        id: generateId(),
        type: 'leadership',
        title: 'Leadership & Community Involvement',
        isVisible: true,
        items: legacyData.leadership,
      });
    }

    if (legacyData.languages_spoken) {
      sections.push({
        id: generateId(),
        type: 'languages',
        title: 'Languages',
        isVisible: true,
        items: legacyData.languages_spoken,
      });
    }

    return {
      personal: legacyData.personal || emptyResumeData.personal,
      sections,
      template_id: 'harvard' as TemplateId,
    };
  };

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

  // Importer un CV depuis un PDF
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/import`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Erreur lors de l'import");
      }

      const importedData: ResumeData = await response.json();

      const processedData: ResumeData = {
        ...importedData,
        sections: importedData.sections.map((section) => ({
          ...section,
          id: generateId(),
        })),
      };

      setData(processedData);
      setCurrentStep(0); // Revenir au début après import
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'import");
    } finally {
      setImportLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Gestion du drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
        const newIndex = prev.sections.findIndex((s) => s.id === over.id);

        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex),
        };
      });
    }
  };

  // Mettre à jour une section
  const updateSection = (sectionId: string, updates: Partial<CVSection>) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  };

  // Supprimer une section
  const deleteSection = (sectionId: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
    // Ajuster l'étape courante si nécessaire
    if (currentStep > data.sections.length) {
      setCurrentStep(data.sections.length);
    }
  };

  // Ajouter une nouvelle section
  const addSection = (type: SectionType, title: string) => {
    const newSection = createSection(type, title);
    setData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setShowAddModal(false);
  };

  // Navigation
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Obtenir le nom de l'étape courante
  const getStepName = (step: number): string => {
    if (step === 0) return 'Informations personnelles';
    if (step === totalSteps - 1) return 'Aperçu & Export';
    const sectionIndex = step - 1;
    return data.sections[sectionIndex]?.title || `Section ${step}`;
  };

  // Obtenir la section courante (pour les étapes 1 à N-1)
  const getCurrentSection = (): CVSection | null => {
    if (isPersonalStep || isFinalStep) return null;
    const sectionIndex = currentStep - 1;
    return data.sections[sectionIndex] || null;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const currentSection = getCurrentSection();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">CV Generator</h1>
            <div className="flex items-center gap-3">
              {/* Input file caché pour l'import PDF */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".pdf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importLoading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {importLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Import...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Importer PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Étape {currentStep + 1} sur {totalSteps}
              </span>
              <span>{getStepName(currentStep)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
            {/* Step indicators */}
            <div className="flex justify-between mt-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600 text-white'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={getStepName(index)}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Erreur */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Step 0: Informations personnelles */}
        {isPersonalStep && (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Commençons par vos informations personnelles
              </h2>
              <p className="text-gray-600 mt-2">
                Ces informations apparaîtront en haut de votre CV
              </p>
            </div>
            <PersonalSection
              data={data.personal}
              onChange={(personal) => setData((prev) => ({ ...prev, personal }))}
            />
          </div>
        )}

        {/* Steps 1 à N-1: Sections dynamiques (une à la fois) */}
        {!isPersonalStep && !isFinalStep && currentSection && (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentSection.title}
              </h2>
              <p className="text-gray-600 mt-2">
                Remplissez les informations pour cette section
              </p>
            </div>
            <SortableSection
              key={currentSection.id}
              section={currentSection}
              onUpdate={(updates) => updateSection(currentSection.id, updates)}
              onDelete={() => {
                deleteSection(currentSection.id);
                // Revenir à l'étape précédente si on supprime la section courante
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                }
              }}
            />
          </div>
        )}

        {/* Final Step: Aperçu & Export */}
        {isFinalStep && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Aperçu et export de votre CV
              </h2>
              <p className="text-gray-600 mt-2">
                Réorganisez vos sections par glisser-déposer et générez votre PDF
              </p>
            </div>

            {/* Sélection du template et bouton d'ajout */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Template :
                </label>
                <select
                  value={data.template_id}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      template_id: e.target.value as TemplateId,
                    }))
                  }
                  className="h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {AVAILABLE_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ajouter section
              </button>
            </div>

            {/* Informations personnelles (non déplaçable) */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">
                Informations personnelles
              </h3>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold">{data.personal.name || 'Nom non renseigné'}</p>
                <p className="text-gray-600">{data.personal.title}</p>
                <p className="text-sm text-gray-500">
                  {[data.personal.email, data.personal.phone, data.personal.location]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              </div>
            </div>

            {/* Sections déplaçables */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={data.sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {data.sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onUpdate={(updates) => updateSection(section.id, updates)}
                    onDelete={() => deleteSection(section.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {data.sections.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-4">Aucune section ajoutée</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une section
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            {!isPersonalStep && (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isFinalStep ? (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuer
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modal d'ajout de section */}
      {showAddModal && (
        <AddSectionModal
          onAdd={addSection}
          onClose={() => setShowAddModal(false)}
          existingSections={data.sections.map((s) => s.type)}
        />
      )}
    </div>
  );
}

export default App;
