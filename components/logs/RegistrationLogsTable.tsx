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
  const itemsPerPage = 10;

  const totalPages = Math.ceil(registrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = registrations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Registration Logs
        </h2>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={registrations.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
