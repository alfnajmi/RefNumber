"use client";

import { DocumentType } from "@/types";

interface DocumentTypeToggleProps {
  value: DocumentType;
  onChange: (type: DocumentType) => void;
}

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "Letter", label: "Letter" },
  { value: "Memo", label: "Memo" },
  { value: "Minister Minutes", label: "Minister Minutes" },
  { value: "Dictionary", label: "Dictionary" },
];

export default function DocumentTypeToggle({ value, onChange }: DocumentTypeToggleProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
      {DOCUMENT_TYPES.map((docType) => (
        <button
          key={docType.value}
          onClick={() => onChange(docType.value)}
          className={`py-2 px-3 text-sm font-medium rounded-md transition-all ${
            value === docType.value
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {docType.label}
        </button>
      ))}
    </div>
  );
}
