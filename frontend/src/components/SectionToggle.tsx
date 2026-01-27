interface SectionToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function SectionToggle({ label, checked, onChange }: SectionToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
