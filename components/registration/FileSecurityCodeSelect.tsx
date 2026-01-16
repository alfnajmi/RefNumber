"use client";

import { FILE_SECURITY_CODES } from "@/types";

interface FileSecurityCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
}

const securityColors: Record<string, { bg: string; text: string; border: string; ring: string }> = {
  T: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
    ring: "ring-green-400"
  },
  S: {
    bg: "bg-yellow-500",
    text: "text-white",
    border: "border-yellow-600",
    ring: "ring-yellow-400"
  },
  TD: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
    ring: "ring-orange-400"
  },
  R: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-600",
    ring: "ring-red-400"
  },
  RB: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
    ring: "ring-purple-400"
  }
};

export default function FileSecurityCodeSelect({ value, onChange }: FileSecurityCodeSelectProps) {
  const currentColor = securityColors[value] || securityColors.T;

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        File Security Code
      </label>
      <div className="grid grid-cols-5 gap-2">
        {FILE_SECURITY_CODES.map((item) => {
          const isActive = value === item.code;
          const colors = securityColors[item.code];

          return (
            <button
              key={item.code}
              onClick={() => onChange(item.code)}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 shadow-sm
                ${isActive
                  ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-offset-2 ${colors.ring} shadow-md`
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-1 font-bold text-xs
                ${isActive ? "bg-white/30 text-white" : "bg-gray-200 text-gray-600"}
              `}>
                {item.code}
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${isActive ? "text-white" : ""}`}>
                {item.label.split(" - ")[1] || item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className={`mt-3 p-2 rounded-lg ${currentColor.bg} ${currentColor.border} border`}>
        <p className={`text-xs ${currentColor.text} text-center font-medium`}>
          {FILE_SECURITY_CODES.find(c => c.code === value)?.label}
        </p>
      </div>
    </div>
  );
}
