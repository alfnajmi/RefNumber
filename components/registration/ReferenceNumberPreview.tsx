"use client";

import { DEPARTMENT_CODES, DocumentType } from "@/types";

interface ReferenceNumberPreviewProps {
  referenceNumber: string;
  deptCode: string;
  typeCode: string;
  department: string;
  docType: DocumentType;
}

export default function ReferenceNumberPreview({
  referenceNumber,
  deptCode,
  typeCode,
  department,
  docType,
}: ReferenceNumberPreviewProps) {
  if (!referenceNumber) return null;

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
      <label className="block text-sm font-medium text-blue-900 mb-2">
        Generated Reference Number
      </label>
      <div className="text-lg font-mono font-bold text-blue-700">
        {referenceNumber}
      </div>
      <div className="text-xs text-blue-600 mt-2">
        <div>Format: MCMC (T) DIGD -[Dept]/[Type]/[Year]/[Seq]</div>
        <div className="mt-1">
          <span className="font-semibold">Dept Code:</span> {deptCode} •
          <span className="font-semibold ml-2">Type Code:</span> {typeCode} (1=Letter, 2=Memo, 3=Minister Minutes, 4=Dictionary)
        </div>
      </div>
    </div>
  );
}
