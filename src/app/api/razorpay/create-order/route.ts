import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder, generateOrderNumber } from "@/lib/razorpay";
import { createClient } from "@supabase/supabase-js";

// Force Node.js runtime (razorpay SDK uses Node crypto)
export const runtime = "nodejs";

// Use service-role client for server-side DB operations
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

interface CartItemPayload {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
}

interface CreateOrderBody {
    items: CartItemPayload[];
    customer: {
        email: string;
        fullName: string;
        phone: string;
    };
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: CreateOrderBody = await request.json();
        const { items, customer, shippingAddress } = body;

        // Validate
        if (!items?.length) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        if (!customer?.email || !customer?.fullName) {
            return NextResponse.json(
                { error: "Customer info is required" },
                { status: 400 }
            );
        }

        // Server-side price calculation
        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const shipping = subtotal > 999 ? 0 : 99;
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + shipping + tax;

        // Amount in paise for Razorpay
        const amountInPaise = Math.round(total * 100);

        // Generate order number
        const orderNumber = generateOrderNumber();

        // Create Razorpay order
        let razorpayOrder;
        try {
            razorpayOrder = await createRazorpayOrder(
                amountInPaise,
                orderNumber
            );
        } catch (rzpError: any) {
            console.error("Razorpay order creation failed:", {
                message: rzpError.message,
                statusCode: rzpError.statusCode,
                error: rzpError.error,
                hasKeyId: !!process.env.RAZORPAY_KEY_ID,
                hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
            });
            return NextResponse.json(
                { error: `Razorpay error: ${rzpError.message || "Order creation failed"}` },
                { status: 502 }
            );
        }

        // Store order in Supabase
        const supabase = getSupabaseAdmin();

        // Insert order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                order_number: orderNumber,
                status: "pending",
                subtotal,
                discount: 0,
                shipping_cost: shipping,
                tax,
                total,
                currency: "INR",
                customer_email: customer.email,
                customer_name: customer.fullName,
                shipping_address: {
                    full_name: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                    address_line1: shippingAddress.addressLine1,
                    address_line2: shippingAddress.addressLine2 || "",
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postal_code: shippingAddress.postalCode,
                    country: "IN",
                },
                metadata: {
                    razorpay_order_id: razorpayOrder.id,
                    customer_phone: customer.phone,
                },
            })
            .select("id")
            .single();

        if (orderError) {
            console.error("Order insert error:", orderError);
            return NextResponse.json(
                { error: "Failed to create order" },
                { status: 500 }
            );
        }

        // Insert order items
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.productId,
            product_name: item.name,
            product_image: item.image,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) {
            console.error("Order items insert error:", itemsError);
        }

        // Insert payment record
        const { error: paymentError } = await supabase
            .from("payments")
            .insert({
                order_id: order.id,
                provider: "razorpay",
                provider_order_id: razorpayOrder.id,
                amount: total,
                currency: "INR",
                status: "pending",
            });

        if (paymentError) {
            console.error("Payment insert error:", paymentError);
        }

        return NextResponse.json({
            success: true,
            razorpayOrderId: razorpayOrder.id,
            orderId: order.id,
            orderNumber,
            amount: amountInPaise,
            currency: "INR",
            customer: {
                name: customer.fullName,
                email: customer.email,
                phone: customer.phone,
            },
        });
    } catch (error: any) {
        console.error("Create order error:", {
            name: error.name,
            message: error.message,
            stack: error.stack?.split("\n").slice(0, 3).join("\n"),
        });
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
