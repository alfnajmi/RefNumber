"use client";

import { useState } from "react";
import { Registration, DocumentType } from "@/types";
import Pagination from "@/components/ui/Pagination";

// Helper function to get badge color based on document type
const getTypeBadgeColor = (type: DocumentType): string => {
  switch (type) {
    case 'Letter':
      return 'bg-blue-100 text-blue-800';
    case 'Memo':
      return 'bg-purple-100 text-purple-800';
    case 'Minister Minutes':
      return 'bg-green-100 text-green-800';
    case 'Dictionary':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to format date as DD/MM/YYYY HH:MM
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

interface RegistrationLogsTableProps {
  registrations: Registration[];
  onEdit: (reg: Registration) => void;
  onDelete: (reg: Registration) => void;
  onReset: () => void;
}

export default function RegistrationLogsTable({
  registrations,
  onEdit,
  onDelete,
  onReset,
}: RegistrationLogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Filter registrations based on search query
  const filteredRegistrations = registrations.filter((reg) => {
    const query = searchQuery.toLowerCase();
    return (
      reg.number.toLowerCase().includes(query) ||
      reg.name.toLowerCase().includes(query) ||
      reg.department.toLowerCase().includes(query) ||
      reg.type.toLowerCase().includes(query) ||
      (reg.referenceNumber && reg.referenceNumber.toLowerCase().includes(query)) ||
      (reg.title && reg.title.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRegistrations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Registration Logs
          </h2>
        </div>
        {/* <button
          onClick={onReset}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Reset All Logs
        </button> */}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full px-4 py-2 sm:py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredRegistrations.length} result{filteredRegistrations.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {!Array.isArray(registrations) || registrations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No records found</div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No results match your search</div>
        ) : (
          currentItems.map((reg) => (
            <div
              key={`mobile-${reg.type}-${reg.number}`}
              className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(reg.type)}`}>
                  {reg.type}
                </span>
                <span className="text-xs text-gray-500">{formatDate(reg.registeredAt)}</span>
              </div>
              <div className="font-mono text-sm font-medium text-blue-600 mb-2 break-all">
                {reg.referenceNumber || '-'}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">{reg.name}</div>
              <div className="text-xs text-gray-600 mb-1">{reg.department}</div>
              {reg.title && <div className="text-xs text-gray-500 mb-3 truncate">{reg.title}</div>}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onEdit(reg)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(reg)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr className="border-b-2 border-blue-200">
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Type
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Seq. No.
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Reference Number
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Name
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm hidden lg:table-cell">
                Department
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm hidden xl:table-cell">
                Title
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Registered At
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(registrations) || registrations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : filteredRegistrations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No results match your search
                </td>
              </tr>
            ) : (
              currentItems.map((reg) => (
                <tr
                  key={`${reg.type}-${reg.number}`}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(reg.type)}`}>
                      {reg.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{reg.number}</td>
                  <td className="py-3 px-4 font-mono text-sm font-medium text-blue-600">
                    {reg.referenceNumber || '-'}
                  </td>
                  <td className="py-3 px-4">{reg.name}</td>
                  <td className="py-3 px-4 text-sm hidden lg:table-cell">{reg.department}</td>
                  <td className="py-3 px-4 text-sm hidden xl:table-cell">{reg.title}</td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    {formatDate(reg.registeredAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(reg)}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(reg)}
                        className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredRegistrations.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredRegistrations.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
