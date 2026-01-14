import { NextRequest, NextResponse } from "next/server";
import { DocumentType } from "@/types";
import { supabase } from "@/lib/supabase";

// GET - Get next available number for a document type
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") as DocumentType;

        if (!type) {
            return NextResponse.json(
                { error: "Document type is required" },
                { status: 400 }
            );
        }

        // Get the maximum number for this document type
        const { data, error } = await supabase
            .from("registrations")
            .select("number")
            .eq("type", type)
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

        return NextResponse.json({ nextNumber, type });
    } catch (error: any) {
        console.error("Error getting next number:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get next number" },
            { status: 500 }
        );
    }
}
