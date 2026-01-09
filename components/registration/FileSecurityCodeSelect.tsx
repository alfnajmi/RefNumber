"use client";

import { FILE_SECURITY_CODES } from "@/types";

interface FileSecurityCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
}

export default function FileSecurityCodeSelect({ value, onChange }: FileSecurityCodeSelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        File Security Code
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {FILE_SECURITY_CODES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
