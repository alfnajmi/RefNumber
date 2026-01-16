"use client";

import { useState } from "react";
import { Registration } from "@/types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  registration: Registration | null;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  registration,
}: DeleteConfirmationModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!isOpen || !registration) return null;

  const handleConfirm = () => {
    if (confirmText === "DELETE") {
      onConfirm(remarks);
      setConfirmText("");
      setRemarks("");
    } else {
      alert("Please type 'DELETE' to confirm.");
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setRemarks("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          Confirm Delete
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
            Reason for Deletion:
          </label>
          <select
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-white"
          >
            <option value="">Select a reason (optional)</option>
            <option value="Duplicate entry">Duplicate entry</option>
            <option value="Incorrect information">Incorrect information</option>
            <option value="Wrong document type">Wrong document type</option>
            <option value="Wrong department">Wrong department</option>
            <option value="Wrong staff assignment">Wrong staff assignment</option>
            <option value="Test entry">Test entry</option>
            <option value="Cancelled document">Cancelled document</option>
            <option value="Administrative correction">Administrative correction</option>
            <option value="Other">Other</option>
          </select>
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
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmText !== "DELETE"}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
