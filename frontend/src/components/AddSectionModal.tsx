import { useState } from 'react';
import {
  X,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Wrench,
  Users,
  Languages,
  FileText,
  User,
  Check,
} from 'lucide-react';
import { SectionType, defaultSectionTitles } from '../types';

interface AddSectionModalProps {
  onAdd: (type: SectionType, title: string) => void;
  onClose: () => void;
  existingSections: SectionType[];
}

const sectionOptions: { type: SectionType; icon: React.ReactNode; description: string }[] = [
  {
    type: 'summary',
    icon: <User className="w-5 h-5" />,
    description: 'Profil et objectif professionnel',
  },
  {
    type: 'education',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Formations, diplomes, certifications',
  },
  {
    type: 'experiences',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Experiences professionnelles',
  },
  {
    type: 'projects',
    icon: <FolderKanban className="w-5 h-5" />,
    description: 'Projets personnels ou professionnels',
  },
  {
    type: 'skills',
    icon: <Wrench className="w-5 h-5" />,
    description: 'Competences techniques',
  },
  {
    type: 'leadership',
    icon: <Users className="w-5 h-5" />,
    description: 'Leadership et engagement associatif',
  },
  {
    type: 'languages',
    icon: <Languages className="w-5 h-5" />,
    description: 'Langues parlees',
  },
  {
    type: 'custom',
    icon: <FileText className="w-5 h-5" />,
    description: 'Section personnalisee avec titre et points',
  },
];

export default function AddSectionModal({ onAdd, onClose, existingSections }: AddSectionModalProps) {
  const [selectedType, setSelectedType] = useState<SectionType | null>(null);
  const [customTitle, setCustomTitle] = useState('');

  const handleAdd = () => {
    if (!selectedType) return;

    const title = selectedType === 'custom' && customTitle
      ? customTitle
      : defaultSectionTitles[selectedType];

    onAdd(selectedType, title);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-0 rounded-2xl shadow-elevated w-full max-w-lg
                      max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-100">
          <div>
            <h2 className="text-xl font-semibold text-primary-900">Ajouter une section</h2>
            <p className="text-sm text-primary-500 mt-0.5">
              Choisissez le type de contenu a ajouter
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-100
                       rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {sectionOptions.map((option) => {
            const isExisting = existingSections.includes(option.type) && option.type !== 'custom';
            const isSelected = selectedType === option.type;

            return (
              <button
                key={option.type}
                onClick={() => !isExisting && setSelectedType(option.type)}
                disabled={isExisting}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                           text-left group ${
                  isSelected
                    ? 'border-primary-900 bg-primary-50'
                    : isExisting
                    ? 'border-primary-100 bg-primary-50/50 opacity-50 cursor-not-allowed'
                    : 'border-transparent bg-primary-50/50 hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-primary-900 text-white'
                      : 'bg-primary-100 text-primary-600 group-hover:bg-primary-200'
                  }`}
                >
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary-900">
                      {defaultSectionTitles[option.type]}
                    </span>
                    {isExisting && (
                      <span className="text-xs text-primary-400 bg-primary-100 px-2 py-0.5 rounded-md">
                        deja ajoute
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-primary-500 truncate">{option.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary-900 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom title input */}
        {selectedType === 'custom' && (
          <div className="px-6 pb-4">
            <label className="label">Titre de la section</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Ex: Publications, Certifications, Hobbies..."
              className="input"
              autoFocus
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-primary-100 bg-primary-50/50">
          <button onClick={onClose} className="btn-ghost">
            Annuler
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedType || (selectedType === 'custom' && !customTitle.trim())}
            className="btn-primary"
          >
            Ajouter la section
          </button>
        </div>
      </div>
    </div>
  );
}
