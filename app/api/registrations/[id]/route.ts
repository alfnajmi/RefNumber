import { NextRequest, NextResponse } from "next/server";
import { Registration } from "@/types";
import { supabase } from "@/lib/supabase";

// PATCH - Update a specific registration
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { number, type, fileSecurityCode, staffId, name, department, title, referenceNumber } = body;
        const { id } = await params;

        if (!number || !type || !staffId || !name || !department || !title) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Update in Supabase
        const { data, error } = await supabase
            .from("registrations")
            .update({
                number,
                type,
                file_security_code: fileSecurityCode,
                staff_id: staffId,
                name,
                department,
                title,
                reference_number: referenceNumber,
            })
            .eq("id", id)
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

        const updatedRegistration: Registration = {
            id: data.id,
            number: data.number,
            type: data.type as 'Surat' | 'Memo',
            fileSecurityCode: data.file_security_code,
            staffId: data.staff_id,
            name: data.name,
            department: data.department,
            title: data.title,
            referenceNumber: data.reference_number,
            registeredAt: data.registered_at,
        };

        return NextResponse.json(updatedRegistration);
    } catch (error: any) {
        console.error("Error updating registration:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update registration" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a specific registration
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { error } = await supabase
            .from("registrations")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ message: "Registration deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting registration:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete registration" },
            { status: 500 }
        );
    }
}
