"use client";

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm font-medium">
      {message}
    </div>
  );
}
