"use client";

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
  setConfirmText: (text: string) => void;
}

export default function ResetConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  confirmText,
  setConfirmText,
}: ResetConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmText === "RESET") {
      onConfirm();
    } else {
      alert("Please type 'RESET' to confirm.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          Confirm Reset
        </h3>
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            This will permanently delete all registration records. This action
            cannot be undone.
          </p>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold">RESET</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type RESET"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmText !== "RESET"}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
