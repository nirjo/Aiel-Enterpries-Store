import Razorpay from "razorpay";
import crypto from "crypto";

// Lazy-initialised Razorpay instance
// Avoids creating a broken client when env vars aren't available at import time
let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
    if (_razorpay) return _razorpay;

    const key_id = process.env.RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_secret) {
        throw new Error(
            "Missing Razorpay credentials. Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set."
        );
    }

    _razorpay = new Razorpay({ key_id, key_secret });
    return _razorpay;
}

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
    const rzp = getRazorpay();

    const order = await rzp.orders.create({
        amount,
        currency,
        receipt,
        payment_capture: 1, // 1 = auto-capture (Razorpay expects 0 or 1, not boolean)
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
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        throw new Error("RAZORPAY_KEY_SECRET is not set");
    }

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
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
