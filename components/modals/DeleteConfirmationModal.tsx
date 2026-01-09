"use client";

import { Registration } from "@/types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  registration: Registration | null;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  registration,
}: DeleteConfirmationModalProps) {
  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          ⚠️ Confirm Delete
        </h3>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this registration?
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
            <div className="text-sm text-gray-700">
              <div className="mb-1">
                <span className="font-semibold">Type:</span>{" "}
                {registration.type}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Number:</span>{" "}
                {registration.number}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {registration.name}
              </div>
              <div className="mb-1">
                <span className="font-semibold">Department:</span>{" "}
                {registration.department}
              </div>
            </div>
          </div>
          <p className="text-sm text-red-600 font-medium">
            This action cannot be undone.
          </p>
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
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
