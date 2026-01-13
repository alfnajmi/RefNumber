"use client";

import { useState } from "react";
import { Registration } from "@/types";

interface QuickCheckProps {
  onSearch: (query: string) => void;
  searchResults: Registration[];
  totalCount: number;
  nextNumber: string;
  docType: 'Letter' | 'Memo';
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
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Quick Check</h2>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by number, name, or department..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
        />
      </div>

      {/* Search Results */}
      {searchResults && searchResults.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Search Results
          </h3>
          {searchResults.map((result) => (
            <div key={`${result.type}-${result.number}`} className="text-sm text-gray-700 mb-2 p-2 bg-white rounded-lg">
              <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold mr-2 ${
                result.type === 'Letter' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {result.type}
              </span>
              <span className="font-mono font-semibold">{result.number}</span> - {result.name} <span className="text-gray-500">({result.department})</span>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-6 p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-sm font-medium opacity-90 mb-1">Statistics</div>
            <div className="text-4xl font-bold">
              {totalCount}
            </div>
            <div className="text-sm opacity-90 mt-1">Total Registered Numbers</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Next Available Number */}
      <div className={`p-5 rounded-xl border-2 shadow-md ${
        docType === 'Letter' ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200' : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Next Available {docType} Number</div>
            <div className={`text-4xl font-bold ${
              docType === 'Letter' ? 'text-blue-600' : 'text-purple-600'
            }`}>{nextNumber}</div>
          </div>
          <div className={`p-3 rounded-full ${
            docType === 'Letter' ? 'bg-blue-100' : 'bg-purple-100'
          }`}>
            <svg className={`w-7 h-7 ${docType === 'Letter' ? 'text-blue-600' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
