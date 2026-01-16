"use client";

import { useState } from "react";
import { Registration, DocumentType } from "@/types";

interface QuickCheckProps {
  onSearch: (query: string) => void;
  searchResults: Registration[];
  totalCount: number;
  nextNumber: string;
  docType: DocumentType;
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
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quick Check</h2>
      </div>

      {/* Search Input */}
      <div className="mb-4 sm:mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 text-sm sm:text-base"
        />
      </div>

      {/* Search Results */}
      {searchResults && searchResults.length > 0 && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Search Results
          </h3>
          {searchResults.map((result) => {
            const typeColors: Record<DocumentType, string> = {
              'Letter': 'bg-blue-100 text-blue-700',
              'Memo': 'bg-purple-100 text-purple-700',
              'Minister Minutes': 'bg-amber-100 text-amber-700',
              'Dictionary': 'bg-emerald-100 text-emerald-700',
            };
            return (
              <div key={`${result.type}-${result.number}`} className="text-xs sm:text-sm text-gray-700 mb-2 p-2 bg-white rounded-lg">
                <span className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold mr-1 sm:mr-2 ${typeColors[result.type]}`}>
                  {result.type}
                </span>
                <span className="font-mono font-semibold">{result.number}</span>
                <span className="hidden sm:inline"> - {result.name}</span>
                <span className="text-gray-500 hidden sm:inline"> ({result.department})</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-xs sm:text-sm font-medium opacity-90 mb-1">Statistics</div>
            <div className="text-2xl sm:text-4xl font-bold">
              {totalCount}
            </div>
            <div className="text-xs sm:text-sm opacity-90 mt-1">Total Registered</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-2.5 sm:p-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Next Available Number */}
      {(() => {
        const docTypeStyles: Record<DocumentType, { bg: string; border: string; text: string; iconBg: string }> = {
          'Letter': { bg: 'from-blue-50 to-white', border: 'border-blue-200', text: 'text-blue-600', iconBg: 'bg-blue-100' },
          'Memo': { bg: 'from-purple-50 to-white', border: 'border-purple-200', text: 'text-purple-600', iconBg: 'bg-purple-100' },
          'Minister Minutes': { bg: 'from-amber-50 to-white', border: 'border-amber-200', text: 'text-amber-600', iconBg: 'bg-amber-100' },
          'Dictionary': { bg: 'from-emerald-50 to-white', border: 'border-emerald-200', text: 'text-emerald-600', iconBg: 'bg-emerald-100' },
        };
        const styles = docTypeStyles[docType];
        return (
          <div className={`p-4 sm:p-5 rounded-xl border-2 shadow-md bg-gradient-to-br ${styles.bg} ${styles.border}`}>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">Next {docType}</div>
                <div className={`text-2xl sm:text-4xl font-bold ${styles.text}`}>{nextNumber}</div>
              </div>
              <div className={`p-2.5 sm:p-3 rounded-full ${styles.iconBg} flex-shrink-0`}>
                <svg className={`w-5 h-5 sm:w-7 sm:h-7 ${styles.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
