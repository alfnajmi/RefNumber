"use client";

import { useEffect } from "react";

interface CustomNotificationProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function CustomNotification({
  message,
  type = "info",
  isOpen,
  onClose,
  autoClose = true,
  duration = 3000,
}: CustomNotificationProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-blue-600",
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-red-600",
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-500 to-amber-600",
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-500 to-blue-600",
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in fade-in zoom-in duration-300">
        <div className={`${styles.bg} rounded-t-2xl p-6 flex items-center justify-center`}>
          <div className="bg-white bg-opacity-20 rounded-full p-3 backdrop-blur-sm">
            {styles.icon}
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
            {type === "success" && "Success!"}
            {type === "error" && "Error"}
            {type === "warning" && "Warning"}
            {type === "info" && "Information"}
          </h3>

          <p className="text-gray-600 text-center leading-relaxed mb-6">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
