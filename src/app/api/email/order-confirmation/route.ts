import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/order-confirmation";

export async function POST(request: NextRequest) {
    try {
        const { orderId, orderNumber, customerEmail, customerName, total } =
            await request.json();

        if (!customerEmail || !orderNumber) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const appUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        await sendEmail({
            to: customerEmail,
            subject: `Order Confirmed — ${orderNumber} | Aiel Enterprises`,
            react: OrderConfirmationEmail({
                customerName: customerName || "Customer",
                orderNumber,
                total: Number(total),
                orderId,
                appUrl,
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Order confirmation email error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to send email" },
            { status: 500 }
        );
    }
}
