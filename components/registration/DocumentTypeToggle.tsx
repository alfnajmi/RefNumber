"use client";

import { DocumentType } from "@/types";

interface DocumentTypeToggleProps {
  value: DocumentType;
  onChange: (type: DocumentType) => void;
}

const DOCUMENT_TYPES: { value: DocumentType; label: string; icon: JSX.Element; color: string }[] = [
  {
    value: "Letter",
    label: "Letter",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "blue"
  },
  {
    value: "Memo",
    label: "Memo",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "purple"
  },
  {
    value: "Minister Minutes",
    label: "Minister Minutes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "amber"
  },
  {
    value: "Dictionary",
    label: "Dictionary",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: "emerald"
  },
];

const colorClasses = {
  blue: {
    active: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
    inactive: "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
    ring: "ring-blue-500"
  },
  purple: {
    active: "bg-purple-500 text-white shadow-lg shadow-purple-500/30",
    inactive: "text-gray-600 hover:bg-purple-50 hover:text-purple-600",
    ring: "ring-purple-500"
  },
  amber: {
    active: "bg-amber-500 text-white shadow-lg shadow-amber-500/30",
    inactive: "text-gray-600 hover:bg-amber-50 hover:text-amber-600",
    ring: "ring-amber-500"
  },
  emerald: {
    active: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
    inactive: "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600",
    ring: "ring-emerald-500"
  }
};

export default function DocumentTypeToggle({ value, onChange }: DocumentTypeToggleProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Document Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        {DOCUMENT_TYPES.map((docType) => {
          const isActive = value === docType.value;
          const colors = colorClasses[docType.color as keyof typeof colorClasses];

          return (
            <button
              key={docType.value}
              onClick={() => onChange(docType.value)}
              className={`
                relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                ${isActive
                  ? `${colors.active} border-transparent`
                  : `${colors.inactive} border-gray-200 hover:border-gray-300`
                }
              `}
            >
              <div className={`
                p-2 rounded-lg transition-colors
                ${isActive ? "bg-white/20" : "bg-gray-100"}
              `}>
                {docType.icon}
              </div>
              <span className="font-medium text-sm">{docType.label}</span>
              {isActive && (
                <div className="absolute top-2 right-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
