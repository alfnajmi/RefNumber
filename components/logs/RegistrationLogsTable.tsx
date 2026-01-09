"use client";

import { Registration } from "@/types";

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
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Registration Logs
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Reset Logs
        </button>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Type
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Seq. No.
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Reference Number
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Staff ID
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Department
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Registered At
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
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
            ) : (
              registrations.map((reg) => (
                <tr
                  key={`${reg.type}-${reg.number}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
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
                  <td className="py-3 px-4 text-sm">
                    {new Date(reg.registeredAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(reg)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(reg)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
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
    </div>
  );
}
