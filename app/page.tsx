"use client";

import { useState, useEffect } from "react";
import { Registration } from "@/types";
import { staffDatabase, getStaffByDepartment } from "@/data/staff";
import { DEPARTMENTS } from "@/types";

export default function Home() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [mailingNumber, setMailingNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Registration[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [docType, setDocType] = useState<'Surat' | 'Memo'>("Surat");
  const [nextNumber, setNextNumber] = useState("0001");

  // Fetch registrations on mount
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Calculate next available number based on type
  useEffect(() => {
    const typeRegistrations = registrations.filter(r => r.type === docType);
    if (typeRegistrations.length === 0) {
      setNextNumber("0001");
    } else {
      const numbers = typeRegistrations.map((r) => parseInt(r.number));
      const maxNumber = Math.max(...numbers);
      setNextNumber((maxNumber + 1).toString().padStart(4, "0"));
    }
  }, [registrations, docType]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registrations");
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setRegistrations(data);
      } else {
        console.error("Failed to fetch registrations:", data.error || "Unknown error");
        setRegistrations([]);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setRegistrations([]);
    }
  };

  const handleAutoGenerate = () => {
    setMailingNumber(nextNumber);
  };

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    setName("");
    setStaffId("");
  };

  const handleNameChange = (selectedName: string) => {
    setName(selectedName);
    const staff = staffDatabase.find((s) => s.name === selectedName && s.department === department);
    if (staff) {
      setStaffId(staff.id);
    }
  };

  const handleRegister = async () => {
    if (!mailingNumber || !department || !name || !staffId) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: mailingNumber,
          type: docType,
          staffId,
          name,
          department,
        }),
      });

      if (response.ok) {
        const newReg = await response.json();
        setSuccessMessage(
          `Number ${newReg.number} successfully registered to ${newReg.name} (Staff ID: ${newReg.staffId})`
        );
        setMailingNumber("");
        setDepartment("");
        setName("");
        setStaffId("");
        fetchRegistrations();
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to register number");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register number");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setSearchResults(data);
      } else {
        console.error("Search failed:", data.error || "Unknown error");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    }
  };

  const handleResetLogs = async () => {
    // Show notice card
    setNoticeMessage("Resetting logs and creating backup...");

    try {
      const response = await fetch("/api/registrations", {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        await fetchRegistrations();
        setSearchResults([]);
        setSearchQuery("");
        setNoticeMessage("");
        setShowResetModal(false);
        setResetConfirmText("");
        setSuccessMessage(
          `✅ Logs reset successfully! ${data.backup || ""}`
        );
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        const error = await response.json();
        setNoticeMessage("");
        setShowResetModal(false);
        setResetConfirmText("");
        alert(`Failed to reset logs: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error resetting logs:", error);
      setNoticeMessage("");
      setShowResetModal(false);
      setResetConfirmText("");
      alert("Failed to reset logs. Please try again.");
    }
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleCancelReset = () => {
    setShowResetModal(false);
    setResetConfirmText("");
  };

  const handleConfirmReset = () => {
    if (resetConfirmText === "RESET") {
      handleResetLogs();
    } else {
      alert("Please type 'RESET' to confirm.");
    }
  };

  const availableNames = department
    ? getStaffByDepartment(department).map((s) => s.name)
    : [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mailing Number System
          </h1>
          <p className="text-gray-600">
            Manage and track mailing numbers for your division
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Register Number Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Register Number
            </h2>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm font-medium">
                {successMessage}
              </div>
            )}

            {/* Document Type Selection */}
            <div className="mb-6 flex p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setDocType("Surat")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${docType === "Surat"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Surat
              </button>
              <button
                onClick={() => setDocType("Memo")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${docType === "Memo"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Memo
              </button>
            </div>

            {/* Notice Message */}
            {noticeMessage && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm font-medium flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {noticeMessage}
              </div>
            )}

            {/* Mailing Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mailing Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 0001"
                  value={mailingNumber}
                  onChange={(e) => setMailingNumber(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAutoGenerate}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
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
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={!department}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select a name</option>
                {availableNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Staff ID */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff ID
              </label>
              <input
                type="text"
                value={staffId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
              />
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
            >
              Register Number
            </button>
          </div>

          {/* Quick Check Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Check
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Number/Name/Department
              </label>
              <input
                type="text"
                placeholder="0001"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Search Results */}
            {searchResults && searchResults.length > 0 && (
              <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Search Results:</h3>
                {searchResults.map((result) => (
                  <div key={`${result.type}-${result.number}`} className="text-sm text-gray-700 mb-1">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold mr-2 ${result.type === 'Surat' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                      {result.type}
                    </span>
                    Number: {result.number} - {result.name} ({result.department})
                  </div>
                ))}
              </div>
            )}

            {/* Statistics */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600 mb-1">Statistics</div>
              <div className="text-3xl font-bold text-blue-600">
                {registrations.length}
              </div>
              <div className="text-sm text-gray-700">Total Registered Numbers</div>
            </div>

            {/* Next Available Number */}
            <div className={`p-4 rounded border ${docType === 'Surat' ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'
              }`}>
              <div className="text-sm text-gray-700 mb-1">Next Available {docType} Number</div>
              <div className={`text-3xl font-bold ${docType === 'Surat' ? 'text-blue-600' : 'text-purple-600'
                }`}>{nextNumber}</div>
            </div>
          </div>
        </div>

        {/* Registration Logs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Registration Logs
            </h2>
            <button
              onClick={handleResetClick}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Reset Logs
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Number
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
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(registrations) || registrations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${reg.type === 'Surat' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                          {reg.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{reg.number}</td>
                      <td className="py-3 px-4">{reg.staffId}</td>
                      <td className="py-3 px-4">{reg.name}</td>
                      <td className="py-3 px-4">{reg.department}</td>
                      <td className="py-3 px-4">
                        {new Date(reg.registeredAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Double Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ⚠️ Confirm Reset
            </h3>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                This action will <strong>delete all registration logs</strong>.
              </p>
              <p className="text-gray-700 mb-4">
                A backup will be created automatically before deletion.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-yellow-800 font-medium">
                  To confirm, please type <span className="font-bold">RESET</span> below:
                </p>
              </div>
              <input
                type="text"
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                placeholder="Type RESET to confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={resetConfirmText !== "RESET"}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
