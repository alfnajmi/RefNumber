"use client";

interface DocumentTypeToggleProps {
  value: 'Surat' | 'Memo';
  onChange: (type: 'Surat' | 'Memo') => void;
}

export default function DocumentTypeToggle({ value, onChange }: DocumentTypeToggleProps) {
  return (
    <div className="mb-6 flex p-1 bg-gray-100 rounded-lg">
      <button
        onClick={() => onChange("Surat")}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
          value === "Surat"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Surat
      </button>
      <button
        onClick={() => onChange("Memo")}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
          value === "Memo"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Memo
      </button>
    </div>
  );
}
