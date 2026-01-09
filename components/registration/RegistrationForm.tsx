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
    if (!mailingNumber || !department || !name || !staffId) {
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
      referenceNumber,
    });

    // Clear form
    setMailingNumber("");
    setDepartment("");
    setName("");
    setStaffId("");
    setFileSecurityCode("T");
  };

  const availableNames = department
    ? getStaffByDepartment(department).map((s) => s.name)
    : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Register Number
      </h2>

      <SuccessMessage message={successMessage} />

      <DocumentTypeToggle value={docType} onChange={setDocType} />

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
      <div className="mb-4">
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

      <FileSecurityCodeSelect value={fileSecurityCode} onChange={setFileSecurityCode} />

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
            onClick={() => setMailingNumber(onGenerateNumber())}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
          >
            Auto
          </button>
        </div>
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
        className="w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
      >
        Register Number
      </button>
    </div>
  );
}
