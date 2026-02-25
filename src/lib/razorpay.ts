import Razorpay from "razorpay";
import crypto from "crypto";

// Server-side Razorpay instance
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Create a Razorpay order
 * @param amount - Amount in paise (₹1 = 100 paise)
 * @param receipt - Unique receipt id (our order number)
 */
export async function createRazorpayOrder(
    amount: number,
    receipt: string,
    currency: string = "INR"
) {
    const order = await razorpay.orders.create({
        amount,
        currency,
        receipt,
        payment_capture: true, // Auto-capture on successful payment
    });

    return order;
}

/**
 * Verify Razorpay payment signature (HMAC-SHA256)
 */
export function verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
): boolean {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest("hex");

    return expectedSignature === razorpaySignature;
}

/**
 * Generate a human-readable order number: ORD-2026-00001
 */
export function generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000); // 5-digit random
    return `ORD-${year}-${random}`;
}
