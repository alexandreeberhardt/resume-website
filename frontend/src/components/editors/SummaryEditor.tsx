import { User } from 'lucide-react';

interface SummaryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SummaryEditor({ value, onChange }: SummaryEditorProps) {
  return (
    <div className="form-group">
      <label className="label flex items-center gap-2">
        <User className="w-4 h-4 text-primary-500" />
        Profil / Objectif professionnel
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Decrivez votre profil professionnel, vos competences cles et vos objectifs de carriere..."
        rows={4}
        className="input resize-y min-h-[100px]"
      />
      <p className="text-xs text-primary-400 mt-1.5">
        Un court paragraphe qui resume votre profil et vos objectifs. Soyez concis et percutant.
      </p>
    </div>
  );
}
