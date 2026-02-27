import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createClient } from "@supabase/supabase-js";

// Force Node.js runtime (razorpay lib uses Node crypto)
export const runtime = "nodejs";

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error(
            "Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
        );
    }
    return createClient(url, key);
}

interface VerifyPaymentBody {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: VerifyPaymentBody = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = body;

        // Verify signature
        const isValid = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            console.error("Invalid Razorpay signature");
            return NextResponse.json(
                { error: "Payment verification failed — invalid signature" },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Update payment record
        const { error: paymentError } = await supabase
            .from("payments")
            .update({
                provider_payment_id: razorpay_payment_id,
                provider_signature: razorpay_signature,
                status: "captured",
                updated_at: new Date().toISOString(),
            })
            .eq("order_id", orderId)
            .eq("provider_order_id", razorpay_order_id);

        if (paymentError) {
            console.error("Payment update error:", paymentError);
        }

        // Update order status to confirmed
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .update({
                status: "confirmed",
                updated_at: new Date().toISOString(),
            })
            .eq("id", orderId)
            .select("id, order_number, customer_email, customer_name, total")
            .single();

        if (orderError) {
            console.error("Order update error:", orderError);
        }

        // Send confirmation email (fire & forget — don't block the response)
        if (order?.customer_email) {
            try {
                const appUrl =
                    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                fetch(`${appUrl}/api/email/order-confirmation`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: order.id,
                        orderNumber: order.order_number,
                        customerEmail: order.customer_email,
                        customerName: order.customer_name,
                        total: order.total,
                    }),
                }).catch((err) =>
                    console.error("Email send failed:", err)
                );
            } catch (emailErr) {
                console.error("Email trigger error:", emailErr);
            }
        }

        return NextResponse.json({
            success: true,
            orderId: order?.id || orderId,
            orderNumber: order?.order_number,
        });
    } catch (error: any) {
        console.error("Verify payment error:", error);
        return NextResponse.json(
            { error: error.message || "Verification failed" },
            { status: 500 }
        );
    }
}
