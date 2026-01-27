interface LanguagesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LanguagesEditor({ value, onChange }: LanguagesEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Langues parlées
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: French (Native), English (Fluent), Spanish (Intermediate)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <p className="mt-1 text-sm text-gray-500">
        Séparez les langues par des virgules et indiquez le niveau entre parenthèses.
      </p>
    </div>
  );
}
