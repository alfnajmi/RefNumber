"use client";

import { useState } from "react";
import { DEPARTMENTS, DEPARTMENT_CODES } from "@/types";
import { staffDatabase, getStaffByDepartment } from "@/data/staff";
import DocumentTypeToggle from "./DocumentTypeToggle";
import FileSecurityCodeSelect from "./FileSecurityCodeSelect";
import ReferenceNumberPreview from "./ReferenceNumberPreview";
import SuccessMessage from "../ui/SuccessMessage";

interface RegistrationFormProps {
  onRegister: (data: {
    number: string;
    type: 'Surat' | 'Memo';
    fileSecurityCode: string;
    staffId: string;
    name: string;
    department: string;
    title: string;
    referenceNumber: string;
  }) => Promise<void>;
  nextNumber: string;
  onGenerateNumber: () => string;
  successMessage: string;
}

export default function RegistrationForm({
  onRegister,
  nextNumber,
  onGenerateNumber,
  successMessage,
}: RegistrationFormProps) {
  const [mailingNumber, setMailingNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [title, setTitle] = useState("");
  const [fileSecurityCode, setFileSecurityCode] = useState("T");
  const [docType, setDocType] = useState<'Surat' | 'Memo'>("Surat");

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
    const typeCode = docType === "Memo" ? "2" : "1";
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

      <DocumentTypeToggle value={docType} onChange={setDocType} />

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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mailing Number
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., 0001"
            value={mailingNumber}
            onChange={(e) => setMailingNumber(e.target.value)}
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 font-mono"
          />
          <button
            onClick={() => setMailingNumber(onGenerateNumber())}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Auto
          </button>
        </div>
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
        typeCode={docType === "Memo" ? "2" : "1"}
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
