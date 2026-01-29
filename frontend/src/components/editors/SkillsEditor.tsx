import { Code2, Wrench } from 'lucide-react';
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
    <div className="space-y-5">
      <div className="form-group">
        <label className="label flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary-500" />
          Langages de programmation
        </label>
        <input
          type="text"
          value={data.languages}
          onChange={(e) => updateField('languages', e.target.value)}
          placeholder="Python, JavaScript, TypeScript, Go, Rust..."
          className="input"
        />
        <p className="text-xs text-primary-400 mt-1.5">
          Separez les langages par des virgules
        </p>
      </div>

      <div className="form-group">
        <label className="label flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary-500" />
          Outils et technologies
        </label>
        <input
          type="text"
          value={data.tools}
          onChange={(e) => updateField('tools', e.target.value)}
          placeholder="Git, Docker, AWS, PostgreSQL, React..."
          className="input"
        />
        <p className="text-xs text-primary-400 mt-1.5">
          Frameworks, outils DevOps, bases de donnees, etc.
        </p>
      </div>
    </div>
  );
}
