import { NextRequest, NextResponse } from "next/server";
import { ActivityLog } from "@/types";
import { supabase } from "@/lib/supabase";

// GET - Fetch all activity logs
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100); // Limit to last 100 activities

    if (error) throw error;

    // Map snake_case to camelCase
    const activityLogs: ActivityLog[] = data.map((log) => ({
      id: log.id,
      action: log.action as 'create' | 'delete',
      registrationNumber: log.registration_number,
      registrationType: log.registration_type as 'Surat' | 'Memo',
      staffId: log.staff_id,
      staffName: log.staff_name,
      department: log.department,
      referenceNumber: log.reference_number,
      performedBy: log.performed_by,
      remarks: log.remarks,
      createdAt: log.created_at,
    }));

    return NextResponse.json(activityLogs);
  } catch (error: any) {
    console.error("Error reading activity logs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to read activity logs", details: error },
      { status: 500 }
    );
  }
}

// POST - Create new activity log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      action,
      registrationNumber,
      registrationType,
      staffId,
      staffName,
      department,
      referenceNumber,
      performedBy = "System",
      remarks,
    } = body;

    if (!action || !registrationNumber || !registrationType || !staffId || !staffName || !department) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("activity_logs")
      .insert([
        {
          action,
          registration_number: registrationNumber,
          registration_type: registrationType,
          staff_id: staffId,
          staff_name: staffName,
          department,
          reference_number: referenceNumber,
          performed_by: performedBy,
          remarks,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const newLog: ActivityLog = {
      id: data.id,
      action: data.action as 'create' | 'delete',
      registrationNumber: data.registration_number,
      registrationType: data.registration_type as 'Surat' | 'Memo',
      staffId: data.staff_id,
      staffName: data.staff_name,
      department: data.department,
      referenceNumber: data.reference_number,
      performedBy: data.performed_by,
      remarks: data.remarks,
      createdAt: data.created_at,
    };

    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating activity log:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create activity log", details: error },
      { status: 500 }
    );
  }
}

// DELETE - Reset all activity logs
export async function DELETE() {
  try {
    const { error } = await supabase
      .from("activity_logs")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete everything

    if (error) throw error;

    return NextResponse.json({
      message: "All activity logs deleted"
    });
  } catch (error) {
    console.error("Error deleting activity logs:", error);
    return NextResponse.json(
      { error: "Failed to delete activity logs" },
      { status: 500 }
    );
  }
}
