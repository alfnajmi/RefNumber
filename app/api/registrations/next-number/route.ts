import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Get next available number (shared across all document types)
export async function GET() {
    try {
        // Get the maximum number across ALL document types (shared sequence)
        const { data, error } = await supabase
            .from("registrations")
            .select("number")
            .order("number", { ascending: false })
            .limit(1);

        if (error) throw error;

        let nextNumber: string;
        if (!data || data.length === 0) {
            nextNumber = "0001";
        } else {
            const maxNumber = parseInt(data[0].number, 10);
            nextNumber = (maxNumber + 1).toString().padStart(4, "0");
        }

        return NextResponse.json({ nextNumber });
    } catch (error: unknown) {
        console.error("Error getting next number:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to get next number";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
