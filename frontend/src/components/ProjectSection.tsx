import { Plus, Trash2, X } from 'lucide-react';
import { Project } from '../types';

interface ProjectSectionProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export default function ProjectSection({ data, onChange }: ProjectSectionProps) {
  const addItem = () => {
    onChange([...data, { name: '', year: '', highlights: [] }]);
  };

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Project, value: string | string[]) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addHighlight = (index: number) => {
    const updated = [...data];
    updated[index].highlights = [...updated[index].highlights, ''];
    onChange(updated);
  };

  const removeHighlight = (projIndex: number, hlIndex: number) => {
    const updated = [...data];
    updated[projIndex].highlights = updated[projIndex].highlights.filter((_, i) => i !== hlIndex);
    onChange(updated);
  };

  const updateHighlight = (projIndex: number, hlIndex: number, value: string) => {
    const updated = [...data];
    updated[projIndex].highlights[hlIndex] = value;
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Projets</h2>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="space-y-6">
        {data.map((proj, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            <button
              onClick={() => removeItem(index)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <input
                  type="text"
                  value={proj.year}
                  onChange={(e) => updateItem(index, 'year', e.target.value)}
                  placeholder="Ex: 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Points clés</label>
                <button
                  onClick={() => addHighlight(index)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Ajouter un point
                </button>
              </div>
              <div className="space-y-2">
                {proj.highlights.map((hl, hlIndex) => (
                  <div key={hlIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => updateHighlight(index, hlIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => removeHighlight(index, hlIndex)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-gray-500 text-center py-4">Aucun projet ajouté</p>
        )}
      </div>
    </div>
  );
}
