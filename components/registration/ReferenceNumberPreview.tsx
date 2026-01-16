"use client";

import { DocumentType } from "@/types";

interface ReferenceNumberPreviewProps {
  referenceNumber: string;
  deptCode: string;
  typeCode: string;
  department: string;
  docType: DocumentType;
}

const docTypeColors: Record<DocumentType, { bg: string; text: string; border: string }> = {
  Letter: { bg: "bg-blue-500", text: "text-blue-600", border: "border-blue-200" },
  Memo: { bg: "bg-purple-500", text: "text-purple-600", border: "border-purple-200" },
  "Minister Minutes": { bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-200" },
  Dictionary: { bg: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-200" },
};

export default function ReferenceNumberPreview({
  referenceNumber,
  deptCode,
  typeCode,
  department,
  docType,
}: ReferenceNumberPreviewProps) {
  if (!referenceNumber) {
    return (
      <div className="mb-6 p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <span className="text-sm font-medium">Reference number will appear here</span>
        </div>
      </div>
    );
  }

  const colors = docTypeColors[docType];

  return (
    <div className={`mb-4 sm:mb-6 rounded-xl overflow-hidden border-2 ${colors.border}`}>
      {/* Header */}
      <div className={`${colors.bg} px-3 sm:px-4 py-2`}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-white text-xs sm:text-sm font-semibold">Generated Reference Number</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-3 sm:p-4">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 w-full sm:w-auto">
            <span className="text-sm sm:text-xl font-mono font-bold text-gray-800 tracking-wide break-all sm:break-normal block text-center">
              {referenceNumber}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-gray-600">{deptCode}</span>
            </div>
            <div className="min-w-0">
              <p className="text-gray-500">Dept Code</p>
              <p className="font-medium text-gray-700 truncate" title={department}>
                {department ? department.split(" ").slice(0, 2).join(" ") + "..." : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className={`w-6 h-6 rounded ${colors.bg} flex items-center justify-center flex-shrink-0`}>
              <span className="font-bold text-white">{typeCode}</span>
            </div>
            <div className="min-w-0">
              <p className="text-gray-500">Type Code</p>
              <p className={`font-medium ${colors.text}`}>{docType}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[10px] sm:text-xs text-gray-400 text-center">
            Format: MCMC (Security) DIGD -Dept/Type/Year/Seq
          </p>
        </div>
      </div>
    </div>
  );
}
