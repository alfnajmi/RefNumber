import { NextRequest, NextResponse } from "next/server";
import { Registration } from "@/types";
import { supabase } from "@/lib/supabase";

// GET - Search registrations
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || "";

        if (!query) {
            return NextResponse.json([]);
        }

        // Search by number, name, department, or staff ID
        // Note: or() requires the columns to be comma separated inside the string
        const { data, error } = await supabase
            .from("registrations")
            .select("*")
            .or(`number.ilike.%${query}%,name.ilike.%${query}%,department.ilike.%${query}%,staff_id.ilike.%${query}%`);

        if (error) throw error;

        // Map snake_case to camelCase
        const results: Registration[] = data.map((reg) => ({
            number: reg.number,
            type: reg.type as 'Surat' | 'Memo',
            staffId: reg.staff_id,
            name: reg.name,
            department: reg.department,
            title: reg.title,
            registeredAt: reg.registered_at,
        }));

        return NextResponse.json(results);
    } catch (error: any) {
        console.error("Error searching registrations:", error);
        return NextResponse.json(
            { error: error.message || "Failed to search registrations", details: error },
            { status: 500 }
        );
    }
}
