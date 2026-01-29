import { Languages } from 'lucide-react';

interface LanguagesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LanguagesEditor({ value, onChange }: LanguagesEditorProps) {
  return (
    <div className="form-group">
      <label className="label flex items-center gap-2">
        <Languages className="w-4 h-4 text-primary-500" />
        Langues parlees
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Francais (Natif), Anglais (Courant), Espagnol (Intermediaire)"
        className="input"
      />
      <p className="text-xs text-primary-400 mt-1.5">
        Separez les langues par des virgules et indiquez le niveau entre parentheses
      </p>
    </div>
  );
}
