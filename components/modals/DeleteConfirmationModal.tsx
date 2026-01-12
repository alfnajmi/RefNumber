"use client";

import { useState } from "react";
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
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen || !registration) return null;

  const handleConfirm = () => {
    if (confirmText === "DELETE") {
      onConfirm();
      setConfirmText("");
    } else {
      alert("Please type 'DELETE' to confirm.");
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

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
          <p className="text-sm text-red-600 font-medium mb-4">
            This action cannot be undone.
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmText !== "DELETE"}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
