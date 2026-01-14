"use client";

import { Registration } from "@/types";
import { DEPARTMENTS, DEPARTMENT_CODES, DOCUMENT_TYPE_CODES, FILE_SECURITY_CODES } from "@/types";
import { staffDatabase, getStaffByDepartment } from "@/data/staff";

interface EditRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  registration: Registration | null;
  setRegistration: (reg: Registration) => void;
}

export default function EditRegistrationModal({
  isOpen,
  onClose,
  onConfirm,
  registration,
  setRegistration,
}: EditRegistrationModalProps) {
  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Edit Registration
        </h3>
        <div className="mb-4">
          {/* Document Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={registration.type}
              onChange={(e) =>
                setRegistration({
                  ...registration,
                  type: e.target.value as 'Letter' | 'Memo' | 'Minister Minutes' | 'Dictionary',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Letter">Letter</option>
              <option value="Memo">Memo</option>
              <option value="Minister Minutes">Minister Minutes</option>
              <option value="Dictionary">Dictionary</option>
            </select>
          </div>

          {/* Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number
            </label>
            <input
              type="text"
              value={registration.number}
              onChange={(e) =>
                setRegistration({
                  ...registration,
                  number: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Security Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Security Code
            </label>
            <select
              value={registration.fileSecurityCode || "T"}
              onChange={(e) =>
                setRegistration({
                  ...registration,
                  fileSecurityCode: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {FILE_SECURITY_CODES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={registration.department}
              onChange={(e) => {
                setRegistration({
                  ...registration,
                  department: e.target.value,
                  name: "",
                  staffId: "",
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <select
              value={registration.name}
              onChange={(e) => {
                const selectedName = e.target.value;
                const staff = staffDatabase.find(
                  (s) =>
                    s.name === selectedName &&
                    s.department === registration.department
                );
                setRegistration({
                  ...registration,
                  name: selectedName,
                  staffId: staff?.id || "",
                });
              }}
              disabled={!registration.department}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select a name</option>
              {registration.department &&
                getStaffByDepartment(registration.department).map(
                  (s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  )
                )}
            </select>
          </div>

          {/* Staff ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff ID
            </label>
            <input
              type="text"
              value={registration.staffId}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>

          {/* Document Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title
            </label>
            <input
              type="text"
              placeholder="Enter document title"
              value={registration.title}
              onChange={(e) =>
                setRegistration({
                  ...registration,
                  title: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reference Number Preview */}
          {registration.number && registration.department && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <label className="block text-xs font-medium text-blue-900 mb-1">
                Updated Reference Number
              </label>
              <div className="text-sm font-mono font-bold text-blue-700">
                {`MCMC (${registration.fileSecurityCode || "T"}) DIGD -${DEPARTMENT_CODES[registration.department]}/${DOCUMENT_TYPE_CODES[registration.type]}/${new Date().getFullYear()}/${registration.number.padStart(3, "0")}`}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
