import { Plus, Trash2 } from 'lucide-react';
import { Education } from '../types';

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export default function EducationSection({ data, onChange }: EducationSectionProps) {
  const addItem = () => {
    onChange([...data, { school: '', degree: '', dates: '', subtitle: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Education, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Education</h2>
        <button
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="space-y-6">
        {data.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            <button
              onClick={() => removeItem(index)}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">École</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateItem(index, 'school', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diplôme</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateItem(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                <input
                  type="text"
                  value={edu.dates}
                  onChange={(e) => updateItem(index, 'dates', e.target.value)}
                  placeholder="Ex: 2021 - 2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre (GPA, etc.)</label>
                <input
                  type="text"
                  value={edu.subtitle}
                  onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={edu.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-gray-500 text-center py-4">Aucune formation ajoutée</p>
        )}
      </div>
    </div>
  );
}
