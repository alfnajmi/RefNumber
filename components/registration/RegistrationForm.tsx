"use client";

import { useState, useEffect } from "react";
import { DEPARTMENTS, DEPARTMENT_CODES, DocumentType, DOCUMENT_TYPE_CODES } from "@/types";
import { staffDatabase, getStaffByDepartment } from "@/data/staff";
import DocumentTypeToggle from "./DocumentTypeToggle";
import FileSecurityCodeSelect from "./FileSecurityCodeSelect";
import ReferenceNumberPreview from "./ReferenceNumberPreview";
import SuccessMessage from "../ui/SuccessMessage";

interface RegistrationFormProps {
  onRegister: (data: {
    number: string;
    type: DocumentType;
    fileSecurityCode: string;
    staffId: string;
    name: string;
    department: string;
    title: string;
    referenceNumber: string;
  }) => Promise<void>;
  successMessage: string;
}

export default function RegistrationForm({
  onRegister,
  successMessage,
}: RegistrationFormProps) {
  const [mailingNumber, setMailingNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [title, setTitle] = useState("");
  const [fileSecurityCode, setFileSecurityCode] = useState("T");
  const [docType, setDocType] = useState<DocumentType>("Letter");
  const [useSpecificNumber, setUseSpecificNumber] = useState(false);
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch next available number (shared across all document types)
  useEffect(() => {
    const fetchNextNumber = async () => {
      if (useSpecificNumber) return;

      setIsLoadingNumber(true);
      try {
        const response = await fetch("/api/registrations/next-number");
        if (response.ok) {
          const data = await response.json();
          setMailingNumber(data.nextNumber);
        }
      } catch (error) {
        console.error("Error fetching next number:", error);
      } finally {
        setIsLoadingNumber(false);
      }
    };

    fetchNextNumber();
  }, [useSpecificNumber]);

  const handleDocTypeChange = (type: DocumentType) => {
    setDocType(type);
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

  const generateReferenceNumber = () => {
    if (!department || !mailingNumber) return "";

    const deptCode = DEPARTMENT_CODES[department] || "0";
    const typeCode = DOCUMENT_TYPE_CODES[docType];
    const year = new Date().getFullYear();
    const sequenceNumber = mailingNumber.padStart(3, "0");

    return `MCMC (${fileSecurityCode}) DIGD -${deptCode}/${typeCode}/${year}/${sequenceNumber}`;
  };

  const handleSubmit = async () => {
    if (!mailingNumber || !department || !name || !staffId || !title) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const referenceNumber = generateReferenceNumber();

    try {
      await onRegister({
        number: mailingNumber,
        type: docType,
        fileSecurityCode,
        staffId,
        name,
        department,
        title,
        referenceNumber,
      });

      // Clear form
      setMailingNumber("");
      setDepartment("");
      setName("");
      setStaffId("");
      setTitle("");
      setFileSecurityCode("T");
      setUseSpecificNumber(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableNames = department
    ? getStaffByDepartment(department).map((s) => s.name)
    : [];

  const isFormValid = mailingNumber && department && name && staffId && title;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Register New Document</h2>
            <p className="text-blue-100 text-sm">Fill in the details below to register a new mailing number</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <SuccessMessage message={successMessage} />

        {/* Document Type Section */}
        <DocumentTypeToggle value={docType} onChange={handleDocTypeChange} />

        {/* Two Column Layout for Department and Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Department */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Department
            </label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 appearance-none bg-white cursor-pointer"
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Staff Name
            </label>
            <div className="relative">
              <select
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={!department}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 appearance-none bg-white cursor-pointer"
              >
                <option value="">{department ? "Select a staff member" : "Select department first"}</option>
                {availableNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Staff ID - Read Only Badge */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            Staff ID
          </label>
          <div className="flex items-center gap-3">
            <div className={`flex-1 px-4 py-3 rounded-xl font-mono text-sm ${
              staffId
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700"
                : "bg-gray-50 border-2 border-gray-200 text-gray-400"
            }`}>
              {staffId || "Auto-populated from staff selection"}
            </div>
            {staffId && (
              <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}
          </div>
        </div>

        {/* File Security Code */}
        <FileSecurityCodeSelect value={fileSecurityCode} onChange={setFileSecurityCode} />

        {/* Mailing Number Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Mailing Number
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useSpecificNumber}
                  onChange={(e) => {
                    setUseSpecificNumber(e.target.checked);
                    if (!e.target.checked) {
                      setMailingNumber("");
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span className="group-hover:text-blue-600 transition-colors">Custom number</span>
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder={useSpecificNumber ? "Enter specific number" : "Auto-generated"}
              value={mailingNumber}
              onChange={(e) => setMailingNumber(e.target.value)}
              readOnly={!useSpecificNumber}
              className={`w-full px-4 py-3 border-2 rounded-xl font-mono text-lg transition-all duration-200 ${
                useSpecificNumber
                  ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-400 bg-white"
                  : "border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 text-gray-600 cursor-not-allowed"
              }`}
            />
            {isLoadingNumber && !useSpecificNumber && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {!useSpecificNumber && !isLoadingNumber && mailingNumber && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Auto
                </div>
              </div>
            )}
          </div>
          {!useSpecificNumber && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Number is auto-generated (shared sequence for all document types)
            </p>
          )}
        </div>

        {/* Document Title */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Document Title
          </label>
          <input
            type="text"
            placeholder="Enter document title or subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
          />
        </div>

        {/* Reference Number Preview */}
        <ReferenceNumberPreview
          referenceNumber={generateReferenceNumber()}
          deptCode={DEPARTMENT_CODES[department] || "0"}
          typeCode={DOCUMENT_TYPE_CODES[docType]}
          department={department}
          docType={docType}
        />

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2
            ${isFormValid && !isSubmitting
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Register Document
            </>
          )}
        </button>

        {/* Form Progress Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${docType ? "bg-blue-500" : "bg-gray-300"}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${department ? "bg-blue-500" : "bg-gray-300"}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${name ? "bg-blue-500" : "bg-gray-300"}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${fileSecurityCode ? "bg-blue-500" : "bg-gray-300"}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${mailingNumber ? "bg-blue-500" : "bg-gray-300"}`}></div>
          <div className={`w-2 h-2 rounded-full transition-colors ${title ? "bg-blue-500" : "bg-gray-300"}`}></div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-1">
          {[docType, department, name, fileSecurityCode, mailingNumber, title].filter(Boolean).length} of 6 fields completed
        </p>
      </div>
    </div>
  );
}
