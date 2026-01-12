"use client";

import { useState } from "react";
import { Registration } from "@/types";
import Pagination from "@/components/ui/Pagination";

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
      reg.staffId.toLowerCase().includes(query) ||
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
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
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
            placeholder="Search by number, name, staff ID, department, type, reference number, or title..."
            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                Staff ID
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Name
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Department
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
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
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : filteredRegistrations.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      reg.type === 'Surat' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {reg.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{reg.number}</td>
                  <td className="py-3 px-4 font-mono text-sm font-medium text-blue-600">
                    {reg.referenceNumber || '-'}
                  </td>
                  <td className="py-3 px-4">{reg.staffId}</td>
                  <td className="py-3 px-4">{reg.name}</td>
                  <td className="py-3 px-4 text-sm">{reg.department}</td>
                  <td className="py-3 px-4 text-sm">{reg.title}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(reg.registeredAt).toLocaleString()}
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
