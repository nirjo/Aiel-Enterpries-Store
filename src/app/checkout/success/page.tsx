import Link from "next/link";
import Image from "next/image";
import {
    CheckCircle,
    Package,
    ArrowRight,
    Clock,
    ShoppingBag,
    MapPin,
} from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@supabase/supabase-js";

async function getOrderDetails(orderId: string) {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
    const supabase = createClient(url, key);

    const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (!order) return null;

    const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

    const { data: payment } = await supabase
        .from("payments")
        .select("*")
        .eq("order_id", orderId)
        .single();

    return { ...order, items: items || [], payment };
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId?: string; order?: string }>;
}) {
    const params = await searchParams;
    const orderId = params.orderId;
    const orderNumber = params.order || "ORD-XXXX-XXXXX";

    // Fetch full order if orderId provided
    const orderDetails = orderId ? await getOrderDetails(orderId) : null;

    const shippingAddress = orderDetails?.shipping_address as {
        full_name?: string;
        city?: string;
        state?: string;
        postal_code?: string;
    } | null;

    return (
        <div className="min-h-screen bg-surface-100">
            <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 animate-bounce-once">
                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
                        Order Confirmed! 🎉
                    </h1>

                    <p className="text-text-secondary text-lg">
                        Thank you
                        {orderDetails?.customer_name
                            ? `, ${orderDetails.customer_name}`
                            : ""}{" "}
                        for your purchase!
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl border border-surface-300 shadow-sm overflow-hidden mb-6">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
                                    Order Number
                                </p>
                                <p className="text-2xl font-bold font-mono mt-1">
                                    {orderDetails?.order_number || orderNumber}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-semibold">
                                    Confirmed & Processing
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    {orderDetails?.items && orderDetails.items.length > 0 && (
                        <div className="px-6 py-5 border-b border-surface-200">
                            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                                Items Ordered
                            </h3>
                            <ul className="space-y-4">
                                {orderDetails.items.map((item: any) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                                            {item.product_image ? (
                                                <Image
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="h-5 w-5 text-text-muted" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-text-primary line-clamp-1">
                                                {item.product_name}
                                            </p>
                                            <p className="text-sm text-text-muted">
                                                Qty: {item.quantity} ×{" "}
                                                {formatCurrency(
                                                    Number(item.unit_price)
                                                )}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-text-primary">
                                            {formatCurrency(
                                                Number(item.total_price)
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Pricing Breakdown */}
                    {orderDetails && (
                        <div className="px-6 py-5 border-b border-surface-200">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">
                                        Subtotal
                                    </span>
                                    <span>
                                        {formatCurrency(
                                            Number(orderDetails.subtotal)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">
                                        Shipping
                                    </span>
                                    <span>
                                        {Number(orderDetails.shipping_cost) ===
                                        0 ? (
                                            <span className="text-emerald-600 font-medium">
                                                FREE
                                            </span>
                                        ) : (
                                            formatCurrency(
                                                Number(
                                                    orderDetails.shipping_cost
                                                )
                                            )
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">
                                        Tax (GST)
                                    </span>
                                    <span>
                                        {formatCurrency(
                                            Number(orderDetails.tax)
                                        )}
                                    </span>
                                </div>
                                <hr className="border-surface-200 my-2" />
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total Paid</span>
                                    <span className="text-primary-500 text-lg">
                                        {formatCurrency(
                                            Number(orderDetails.total)
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delivery & Shipping */}
                    <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Clock className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-medium text-text-primary text-sm">
                                    Estimated Delivery
                                </p>
                                <p className="text-text-muted text-sm">
                                    3–5 business days
                                </p>
                            </div>
                        </div>
                        {shippingAddress && (
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-text-primary text-sm">
                                        Shipping To
                                    </p>
                                    <p className="text-text-muted text-sm">
                                        {shippingAddress.full_name},{" "}
                                        {shippingAddress.city},{" "}
                                        {shippingAddress.state}{" "}
                                        {shippingAddress.postal_code}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {orderId && (
                        <Link href={`/order/${orderId}`} className="flex-1">
                            <Button fullWidth size="lg">
                                View Order Details
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}
                    <Link href="/products" className="flex-1">
                        <Button variant="outline" fullWidth size="lg">
                            <Package className="h-5 w-5" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {/* Email notice */}
                <p className="text-sm text-text-muted text-center mt-6">
                    📧 A confirmation email has been sent to{" "}
                    {orderDetails?.customer_email || "your email address"}.
                </p>

                {/* Welcome Back */}
                <div className="text-center mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                    <p className="text-lg font-semibold text-indigo-700 mb-1">
                        Welcome back anytime! 🛒
                    </p>
                    <p className="text-sm text-indigo-500">
                        We appreciate your trust in Aiel Enterprises
                    </p>
                </div>
            </div>
        </div>
    );
}
