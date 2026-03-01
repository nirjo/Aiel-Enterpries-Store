import { NextResponse } from "next/server";
import { Resend } from "resend";
// Optional Twilio import: import twilio from "twilio";

// Requires RESEND_API_KEY in .env.local
const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order, customerEmail, phone, status, eta } = body;

        if (!order || !customerEmail) {
            return NextResponse.json(
                { error: "Order details and customer email are required" },
                { status: 400 }
            );
        }

        // 1. Send Email via Resend
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: "Aiel Enterprises <tracking@aiel-enterprises.com>",
                to: [customerEmail],
                subject: `Order Update: ${order} - ${status}`,
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                        <h2 style="color: #06b6d4;">Aiel Enterprises Tracking</h2>
                        <p>Hello! This is a quick update regarding your order <strong>${order}</strong>.</p>
                        <p>Your current status is: <strong style="color: #10b981;">${status}</strong></p>
                        ${eta ? `<p>Estimated Time of Arrival: ${eta}</p>` : ""}
                        <p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-orders">here</a> to view your live tracking map.</p>
                        <hr style="border-top: 1px solid #eee; margin: 30px 0;" />
                        <p style="font-size: 12px; color: #999;">Play & Innovate - Aiel Enterprises</p>
                    </div>
                `,
            });
        } else {
            console.log("Mock Email Sent (No RESEND_API_KEY):", { order, customerEmail, status });
        }

        // 2. Mock WhatsApp/SMS via Twilio (Implement actual keys when available)
        if (phone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            // await client.messages.create({
            //     body: \`Aiel Enterprises: Your order \${order} is now \${status}.\`,
            //     from: "whatsapp:+14155238886", // Twilio test number
            //     to: \`whatsapp:\${phone}\`
            // });
            console.log(`Mock Twilio Message requested for ${phone}`);
        }

        return NextResponse.json({ success: true, message: "Notifications dispatched." }, { status: 200 });

    } catch (error) {
        console.error("Notification API Exception:", error);
        return NextResponse.json(
            { error: "Failed to send notifications" },
            { status: 500 }
        );
    }
}
