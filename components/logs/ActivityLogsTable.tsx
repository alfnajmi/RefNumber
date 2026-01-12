"use client";

import { useState } from "react";
import { ActivityLog } from "@/types";
import Pagination from "@/components/ui/Pagination";

interface ActivityLogsTableProps {
  activityLogs: ActivityLog[];
}

export default function ActivityLogsTable({ activityLogs }: ActivityLogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(activityLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = activityLogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(activityLogs) || activityLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No activity logs found
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
                      log.registrationType === 'Surat'
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
                    {new Date(log.createdAt).toLocaleString()}
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
        totalItems={activityLogs.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
