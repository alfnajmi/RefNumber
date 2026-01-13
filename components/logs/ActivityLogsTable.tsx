"use client";

import { useState } from "react";
import { ActivityLog } from "@/types";
import Pagination from "@/components/ui/Pagination";

interface ActivityLogsTableProps {
  activityLogs: ActivityLog[];
}

export default function ActivityLogsTable({ activityLogs }: ActivityLogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  // Filter activity logs based on search query
  const filteredLogs = activityLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.registrationNumber.toLowerCase().includes(query) ||
      log.registrationType.toLowerCase().includes(query) ||
      log.staffName.toLowerCase().includes(query) ||
      log.staffId.toLowerCase().includes(query) ||
      log.department.toLowerCase().includes(query) ||
      (log.referenceNumber && log.referenceNumber.toLowerCase().includes(query)) ||
      (log.remarks && log.remarks.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mt-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Activity Logs
        </h2>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by action, number, type, staff name, staff ID, department, reference number, or remarks..."
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
            Found {filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr className="border-b-2 border-blue-200">
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Action
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Type
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Number
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Reference Number
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Staff Name
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Department
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Remarks
              </th>
              <th className="text-left py-4 px-4 font-bold text-blue-900 text-sm">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(activityLogs) || activityLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No activity logs found
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No results match your search
                </td>
              </tr>
            ) : (
              currentItems.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.action === 'create'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.registrationType === 'Letter'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.registrationType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">
                    {log.registrationNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm font-medium text-blue-600">
                    {log.referenceNumber || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">{log.staffName}</td>
                  <td className="py-3 px-4 text-sm">{log.department}</td>
                  <td className="py-3 px-4 text-sm">
                    {log.remarks ? (
                      <span className="text-gray-700 italic">{log.remarks}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredLogs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
