"use client";

import { useState } from "react";
import { Registration } from "@/types";

interface QuickCheckProps {
  onSearch: (query: string) => void;
  searchResults: Registration[];
  totalCount: number;
  nextNumber: string;
  docType: 'Surat' | 'Memo';
}

export default function QuickCheck({
  onSearch,
  searchResults,
  totalCount,
  nextNumber,
  docType,
}: QuickCheckProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Check</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by number, name, or department..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      {searchResults && searchResults.length > 0 && (
        <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Search Results:</h3>
          {searchResults.map((result) => (
            <div key={`${result.type}-${result.number}`} className="text-sm text-gray-700 mb-1">
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold mr-2 ${
                result.type === 'Surat' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {result.type}
              </span>
              Number: {result.number} - {result.name} ({result.department})
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-600 mb-1">Statistics</div>
        <div className="text-3xl font-bold text-blue-600">
          {totalCount}
        </div>
        <div className="text-sm text-gray-700">Total Registered Numbers</div>
      </div>

      {/* Next Available Number */}
      <div className={`p-4 rounded border ${
        docType === 'Surat' ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'
      }`}>
        <div className="text-sm text-gray-700 mb-1">Next Available {docType} Number</div>
        <div className={`text-3xl font-bold ${
          docType === 'Surat' ? 'text-blue-600' : 'text-purple-600'
        }`}>{nextNumber}</div>
      </div>
    </div>
  );
}
