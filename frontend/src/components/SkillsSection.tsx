import { Skills } from '../types';

interface SkillsSectionProps {
  data: Skills;
  onChange: (data: Skills) => void;
}

export default function SkillsSection({ data, onChange }: SkillsSectionProps) {
  const updateField = (field: keyof Skills, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Compétences techniques</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Langages de programmation
          </label>
          <input
            type="text"
            value={data.languages}
            onChange={(e) => updateField('languages', e.target.value)}
            placeholder="Ex: Python, JavaScript, C++, Rust"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Outils</label>
          <input
            type="text"
            value={data.tools}
            onChange={(e) => updateField('tools', e.target.value)}
            placeholder="Ex: Git, Docker, Linux, AWS"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
