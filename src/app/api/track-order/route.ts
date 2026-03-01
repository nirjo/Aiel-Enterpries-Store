import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, email } = body;

        if (!orderId || !email) {
            return NextResponse.json(
                { error: "Order ID and email are required" },
                { status: 400 }
            );
        }

        const supabase = await createAdminClient();

        // Query the orders table
        // Ensure you match your actual schema (e.g. order_number vs id)
        const { data, error } = await supabase
            .from("orders")
            .select("id, order_number, status, total, created_at, customer_email, phone, tracking_details")
            .eq("order_number", orderId.trim())
            .eq("customer_email", email.trim())
            .single();

        if (error || !data) {
            console.error("Tracking API error:", error?.message);
            return NextResponse.json(
                { error: "Order not found. Please check your details." },
                { status: 404 }
            );
        }

        // Return the safe details
        return NextResponse.json({ order: data }, { status: 200 });
    } catch (error) {
        console.error("Track Order API Exception:", error);
        return NextResponse.json(
            { error: "An internal server error occurred" },
            { status: 500 }
        );
    }
}
