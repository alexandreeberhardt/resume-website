import { Plus, Trash2, X } from 'lucide-react';
import { ProjectItem, createEmptyProject } from '../../types';

interface ProjectEditorProps {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
}

export default function ProjectEditor({ items, onChange }: ProjectEditorProps) {
  const addItem = () => {
    onChange([...items, createEmptyProject()]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ProjectItem, value: string | string[]) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addHighlight = (index: number) => {
    const updated = [...items];
    updated[index].highlights = [...updated[index].highlights, ''];
    onChange(updated);
  };

  const removeHighlight = (projIndex: number, hlIndex: number) => {
    const updated = [...items];
    updated[projIndex].highlights = updated[projIndex].highlights.filter((_, i) => i !== hlIndex);
    onChange(updated);
  };

  const updateHighlight = (projIndex: number, hlIndex: number, value: string) => {
    const updated = [...items];
    updated[projIndex].highlights[hlIndex] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {items.map((proj, index) => (
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
                + Ajouter
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

      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Ajouter un projet
      </button>
    </div>
  );
}
