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

  // Fetch next available number when document type changes
  useEffect(() => {
    const fetchNextNumber = async () => {
      if (useSpecificNumber) return;

      setIsLoadingNumber(true);
      try {
        const response = await fetch(`/api/registrations/next-number?type=${encodeURIComponent(docType)}`);
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
  }, [docType, useSpecificNumber]);

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

    const referenceNumber = generateReferenceNumber();

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
  };

  const availableNames = department
    ? getStaffByDepartment(department).map((s) => s.name)
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Register Number
        </h2>
      </div>

      <SuccessMessage message={successMessage} />

      <DocumentTypeToggle value={docType} onChange={handleDocTypeChange} />

      {/* Department */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Name
        </label>
        <select
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          disabled={!department}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
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
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Staff ID
        </label>
        <input
          type="text"
          value={staffId}
          readOnly
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 font-mono text-gray-600"
        />
      </div>

      {/* Document Title
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Title
        </label>
        <input
          type="text"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      <FileSecurityCodeSelect value={fileSecurityCode} onChange={setFileSecurityCode} />

      {/* Mailing Number */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Mailing Number
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useSpecificNumber}
              onChange={(e) => {
                setUseSpecificNumber(e.target.checked);
                if (!e.target.checked) {
                  setMailingNumber("");
                }
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            Request specific number
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={useSpecificNumber ? "Enter specific number" : "Auto-generated"}
            value={mailingNumber}
            onChange={(e) => setMailingNumber(e.target.value)}
            readOnly={!useSpecificNumber}
            className={`w-full px-4 py-2.5 border-2 rounded-lg font-mono transition-all duration-200 ${
              useSpecificNumber
                ? "border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300"
                : "border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 text-gray-600 cursor-not-allowed"
            }`}
          />
          {isLoadingNumber && !useSpecificNumber && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        {!useSpecificNumber && (
          <p className="text-xs text-gray-500 mt-1">Number will be auto-generated based on document type</p>
        )}
      </div>
            {/* Document Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Document Title
        </label>
        <input
          type="text"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
        />
      </div>

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
        className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Register Number
      </button>
    </div>
  );
}
