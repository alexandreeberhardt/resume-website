import { SkillsItem } from '../../types';

interface SkillsEditorProps {
  data: SkillsItem;
  onChange: (data: SkillsItem) => void;
}

export default function SkillsEditor({ data, onChange }: SkillsEditorProps) {
  const updateField = (field: keyof SkillsItem, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
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
  );
}
