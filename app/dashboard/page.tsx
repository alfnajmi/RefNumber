"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Registration, ActivityLog, DOCUMENT_TYPE_CODES, DocumentType } from "@/types";
import { DEPARTMENT_CODES } from "@/types";
import RegistrationForm from "@/components/registration/RegistrationForm";
import RegistrationLogsTable from "@/components/logs/RegistrationLogsTable";
import ResetConfirmationModal from "@/components/modals/ResetConfirmationModal";
import EditRegistrationModal from "@/components/modals/EditRegistrationModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import NoticeMessage from "@/components/ui/NoticeMessage";
import CustomNotification from "@/components/ui/CustomNotification";

export default function Home() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRegistration, setDeletingRegistration] = useState<Registration | null>(null);

  // Fetch registrations and activity logs on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [regResponse, logsResponse] = await Promise.all([
          fetch("/api/registrations"),
          fetch("/api/activity-logs")
        ]);

        const regData = await regResponse.json();
        const logsData = await logsResponse.json();

        if (isMounted) {
          if (regResponse.ok && Array.isArray(regData)) {
            setRegistrations(regData);
          } else {
            console.error("Failed to fetch registrations:", regData.error || "Unknown error");
            setRegistrations([]);
          }

          if (logsResponse.ok && Array.isArray(logsData)) {
            setActivityLogs(logsData);
          } else {
            console.error("Failed to fetch activity logs:", logsData.error || "Unknown error");
            setActivityLogs([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching data:", error);
          setRegistrations([]);
          setActivityLogs([]);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch("/api/activity-logs");
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setActivityLogs(data);
      } else {
        console.error("Failed to fetch activity logs:", data.error || "Unknown error");
        setActivityLogs([]);
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setActivityLogs([]);
    }
  };

  const handleRegister = async (data: {
    number: string;
    type: DocumentType;
    fileSecurityCode: string;
    staffId: string;
    name: string;
    department: string;
    title: string;
    referenceNumber: string;
  }) => {
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newReg = await response.json();

        // Log the create activity
        await fetch("/api/activity-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
            registrationNumber: data.number,
            registrationType: data.type,
            staffId: data.staffId,
            staffName: data.name,
            department: data.department,
            referenceNumber: data.referenceNumber,
            performedBy: "System",
          }),
        });

        setSuccessMessage(
          `Number ${newReg.number} successfully registered to ${newReg.name} (Staff ID: ${newReg.staffId})`
        );
        await fetchRegistrations();
        await fetchActivityLogs();
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        const error = await response.json();
        setErrorMessage(error.error || "Failed to register number");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrorMessage("Failed to register number");
    }
  };

  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const handleResetLogs = async () => {
    setNoticeMessage("Resetting all logs...");
    setShowResetModal(false);
    setResetConfirmText("");

    try {
      const response = await fetch("/api/registrations", {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRegistrations();
        setNoticeMessage("");
        setSuccessMessage("All logs have been reset successfully");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setNoticeMessage("");
        setErrorMessage("Failed to reset logs");
      }
    } catch (error) {
      console.error("Error resetting logs:", error);
      setNoticeMessage("");
      setErrorMessage("Failed to reset logs");
    }
  };

  const handleEditClick = (registration: Registration) => {
    setEditingRegistration(registration);
    setShowEditModal(true);
  };

  const handleDeleteClick = (registration: Registration) => {
    setDeletingRegistration(registration);
    setShowDeleteModal(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingRegistration(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingRegistration(null);
  };

  const handleConfirmEdit = async () => {
    if (!editingRegistration || !editingRegistration.id) return;

    // Generate reference number for the edited registration
    const deptCode = DEPARTMENT_CODES[editingRegistration.department] || "0";
    const typeCode = DOCUMENT_TYPE_CODES[editingRegistration.type];
    const year = new Date().getFullYear();
    const sequenceNumber = editingRegistration.number.padStart(3, "0");
    const securityCode = editingRegistration.fileSecurityCode || "T";
    const referenceNumber = `MCMC (${securityCode}) DIGD -${deptCode}/${typeCode}/${year}/${sequenceNumber}`;

    try {
      const response = await fetch(`/api/registrations/${editingRegistration.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: editingRegistration.number,
          type: editingRegistration.type,
          fileSecurityCode: editingRegistration.fileSecurityCode,
          staffId: editingRegistration.staffId,
          name: editingRegistration.name,
          department: editingRegistration.department,
          title: editingRegistration.title,
          referenceNumber,
        }),
      });

      if (response.ok) {
        await fetchRegistrations();
        setShowEditModal(false);
        setEditingRegistration(null);
        setSuccessMessage("Registration updated successfully");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        const error = await response.json();
        setErrorMessage(error.error || "Failed to update registration");
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      setErrorMessage("Failed to update registration");
    }
  };

  const handleConfirmDelete = async (remarks: string) => {
    if (!deletingRegistration || !deletingRegistration.id) return;

    try {
      const response = await fetch(`/api/registrations/${deletingRegistration.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Log the delete activity
        await fetch("/api/activity-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete",
            registrationNumber: deletingRegistration.number,
            registrationType: deletingRegistration.type,
            staffId: deletingRegistration.staffId,
            staffName: deletingRegistration.name,
            department: deletingRegistration.department,
            referenceNumber: deletingRegistration.referenceNumber,
            performedBy: "System",
            remarks: remarks || undefined,
          }),
        });

        await fetchRegistrations();
        await fetchActivityLogs();
        setShowDeleteModal(false);
        setDeletingRegistration(null);
        setSuccessMessage("Registration deleted successfully");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        const error = await response.json();
        setErrorMessage(error.error || "Failed to delete registration");
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      setErrorMessage("Failed to delete registration");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/Gemini_Generated_Image_dq1ktcdq1ktcdq1k-removebg-preview.png"
              alt="DIGD Logo"
              width={300}
              height={300}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            DIGD Document Management System (DDMS)
          </h1>
        </div>

        <NoticeMessage message={noticeMessage} />

        {/* Registration Form and Statistics - Side by Side */}
        <div className="mb-6 flex gap-4 items-stretch">
          {/* Registration Form */}
          <div className="flex-1">
            <RegistrationForm
              onRegister={handleRegister}
              successMessage={successMessage}
            />
          </div>

          {/* Statistics Cards */}
          <div className="flex flex-col gap-2 w-[200px] shrink-0">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 flex-1 flex flex-col justify-center">
              <div className="text-5xl font-bold text-blue-600">{registrations.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Documents</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold text-blue-600">
                {registrations.filter(r => r.type === "Letter").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Letters</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold text-purple-600">
                {registrations.filter(r => r.type === "Memo").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Memos</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold text-amber-600">
                {registrations.filter(r => r.type === "Minister Minutes").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Minister Minutes</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 flex-1 flex flex-col justify-center">
              <div className="text-4xl font-bold text-emerald-600">
                {registrations.filter(r => r.type === "Dictionary").length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Dictionary</div>
            </div>
          </div>
        </div>

        {/* Registration Logs */}
        <RegistrationLogsTable
          registrations={registrations}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onReset={handleResetClick}
        />

        {/* Activity Logs */}
        {/* <ActivityLogsTable activityLogs={activityLogs} /> */}
      </div>

      {/* Modals */}
      <ResetConfirmationModal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          setResetConfirmText("");
        }}
        onConfirm={handleResetLogs}
        confirmText={resetConfirmText}
        setConfirmText={setResetConfirmText}
      />

      <EditRegistrationModal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        onConfirm={handleConfirmEdit}
        registration={editingRegistration}
        setRegistration={setEditingRegistration}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        registration={deletingRegistration}
      />

      {/* Custom Notifications */}
      <CustomNotification
        message={successMessage}
        type="success"
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage("")}
        autoClose={true}
        duration={3000}
      />

      <CustomNotification
        message={errorMessage}
        type="error"
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage("")}
        autoClose={true}
        duration={4000}
      />
    </div>
  );
}
