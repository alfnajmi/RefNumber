import { NextRequest, NextResponse } from "next/server";
import { Registration } from "@/types";
import { supabase } from "@/lib/supabase";

// GET - Fetch all registrations
export async function GET() {
    try {
        const { data, error } = await supabase
            .from("registrations")
            .select("*")
            .order("registered_at", { ascending: false });

        if (error) throw error;

        // Map snake_case to camelCase
        const registrations: Registration[] = data.map((reg) => ({
            id: reg.id,
            number: reg.number,
            type: reg.type as 'Surat' | 'Memo',
            fileSecurityCode: reg.file_security_code,
            staffId: reg.staff_id,
            name: reg.name,
            department: reg.department,
            referenceNumber: reg.reference_number,
            registeredAt: reg.registered_at,
        }));

        return NextResponse.json(registrations);
    } catch (error: any) {
        console.error("Error reading registrations:", error);
        return NextResponse.json(
            { error: error.message || "Failed to read registrations", details: error },
            { status: 500 }
        );
    }
}

// POST - Create new registration
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { number, type, fileSecurityCode, staffId, name, department, referenceNumber } = body;

        if (!number || !type || !staffId || !name || !department) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from("registrations")
            .insert([
                {
                    number,
                    type,
                    file_security_code: fileSecurityCode,
                    staff_id: staffId,
                    name,
                    department,
                    reference_number: referenceNumber,
                },
            ])
            .select()
            .single();

        if (error) {
            if (error.code === "23505") { // Unique violation
                return NextResponse.json(
                    { error: "Number already registered" },
                    { status: 400 }
                );
            }
            throw error;
        }

        const newRegistration: Registration = {
            id: data.id,
            number: data.number,
            type: data.type as 'Surat' | 'Memo',
            fileSecurityCode: data.file_security_code,
            staffId: data.staff_id,
            name: data.name,
            department: data.department,
            referenceNumber: data.reference_number,
            registeredAt: data.registered_at,
        };

        return NextResponse.json(newRegistration, { status: 201 });
    } catch (error: any) {
        console.error("Error creating registration:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create registration", details: error },
            { status: 500 }
        );
    }
}

// DELETE - Reset all registrations
export async function DELETE() {
    try {
        // In a real app, you might want to back up to another table or storage
        // For now, we'll just delete all rows
        const { error } = await supabase
            .from("registrations")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete everything

        if (error) throw error;

        return NextResponse.json({
            message: "All registrations deleted",
            backup: "Note: Cloud backups are managed by Supabase"
        });
    } catch (error) {
        console.error("Error deleting registrations:", error);
        return NextResponse.json(
            { error: "Failed to delete registrations" },
            { status: 500 }
        );
    }
}
