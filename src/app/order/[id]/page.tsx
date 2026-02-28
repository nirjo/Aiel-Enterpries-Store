import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ShoppingBag,
    CheckCircle,
    Clock,
    MapPin,
    CreditCard,
} from "lucide-react";
import PrintButton from "@/components/PrintButton";
import { Button } from "@/components/ui";
import { createClient } from "@supabase/supabase-js";
import InvoicePDFButton from "@/components/InvoicePDF";

async function getOrderWithDetails(orderId: string) {
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
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

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

function formatDate(date: string): string {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const order = await getOrderWithDetails(id);

    if (!order) {
        notFound();
    }

    const shippingAddress = order.shipping_address as {
        full_name?: string;
        phone?: string;
        address_line1?: string;
        address_line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
    } | null;

    const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
        pending: { label: "Pending", color: "text-amber-600 bg-amber-50", icon: Clock },
        confirmed: { label: "Confirmed", color: "text-blue-600 bg-blue-50", icon: CheckCircle },
        processing: { label: "Processing", color: "text-indigo-600 bg-indigo-50", icon: Clock },
        shipped: { label: "Shipped", color: "text-purple-600 bg-purple-50", icon: CheckCircle },
        delivered: { label: "Delivered", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
        cancelled: { label: "Cancelled", color: "text-red-600 bg-red-50", icon: Clock },
        refunded: { label: "Refunded", color: "text-gray-600 bg-gray-50", icon: Clock },
    };

    const status = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    // Serialize order data for client-side PDF
    const orderForPDF = {
        order_number: order.order_number,
        created_at: order.created_at,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        status: order.status,
        subtotal: Number(order.subtotal),
        shipping_cost: Number(order.shipping_cost),
        tax: Number(order.tax),
        total: Number(order.total),
        shipping_address: shippingAddress,
        items: order.items.map((item: any) => ({
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: Number(item.unit_price),
            total_price: Number(item.total_price),
        })),
        payment: order.payment
            ? {
                  provider: order.payment.provider,
                  status: order.payment.status,
                  provider_payment_id: order.payment.provider_payment_id,
              }
            : null,
    };

    return (
        <div className="min-h-screen bg-surface-100">
            {/* Header */}
            <div className="bg-white border-b border-surface-300 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/products"
                                className="text-text-muted hover:text-primary-500 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-text-primary">
                                    Order Details
                                </h1>
                                <p className="text-sm text-text-muted font-mono">
                                    {order.order_number}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <InvoicePDFButton order={orderForPDF} />
                            <PrintButton />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
                {/* Invoice */}
                <div
                    id="invoice-content"
                    className="bg-white rounded-2xl border border-surface-300 shadow-sm overflow-hidden"
                >
                    {/* Company Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-8 text-white">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">
                                    Aiel Enterprises
                                </h2>
                                <p className="text-indigo-200 text-sm">
                                    Your one-stop family store
                                </p>
                                <div className="mt-3 text-xs text-indigo-200 space-y-0.5">
                                    <p>GSTIN: 34XXXXX1234X1ZX</p>
                                    <p>Puducherry, India — 605001</p>
                                    <p>contact@aielenterprises.com</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">
                                    Invoice
                                </p>
                                <p className="text-xl font-bold font-mono">
                                    {order.order_number}
                                </p>
                                <p className="text-indigo-200 text-sm mt-1">
                                    {formatDate(order.created_at)}
                                </p>
                                <div
                                    className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                                >
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {status.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill To / Ship To */}
                    <div className="px-8 py-6 bg-surface-50 border-b border-surface-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                Bill To
                            </h3>
                            <p className="font-medium text-text-primary">
                                {order.customer_name || "Customer"}
                            </p>
                            <p className="text-sm text-text-secondary mt-0.5">
                                {order.customer_email}
                            </p>
                        </div>
                        {shippingAddress && (
                            <div>
                                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                                    Ship To
                                </h3>
                                <p className="font-medium text-text-primary">
                                    {shippingAddress.full_name}
                                </p>
                                <p className="text-sm text-text-secondary mt-0.5">
                                    {shippingAddress.address_line1}
                                    {shippingAddress.address_line2
                                        ? `, ${shippingAddress.address_line2}`
                                        : ""}
                                    <br />
                                    {shippingAddress.city},{" "}
                                    {shippingAddress.state} —{" "}
                                    {shippingAddress.postal_code}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    <div className="px-8 py-6">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-surface-200">
                                    <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider pb-3">
                                        Product
                                    </th>
                                    <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider pb-3 hidden sm:table-cell">
                                        Qty
                                    </th>
                                    <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider pb-3 hidden sm:table-cell">
                                        Unit Price
                                    </th>
                                    <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider pb-3">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-surface-100"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0 hidden sm:block">
                                                    {item.product_image ? (
                                                        <Image
                                                            src={
                                                                item.product_image
                                                            }
                                                            alt={
                                                                item.product_name
                                                            }
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingBag className="h-4 w-4 text-text-muted" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-text-primary text-sm">
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-xs text-text-muted sm:hidden">
                                                        {item.quantity} ×{" "}
                                                        {formatCurrency(
                                                            Number(
                                                                item.unit_price
                                                            )
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center text-sm hidden sm:table-cell">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 text-right text-sm hidden sm:table-cell">
                                            {formatCurrency(
                                                Number(item.unit_price)
                                            )}
                                        </td>
                                        <td className="py-4 text-right font-medium text-sm">
                                            {formatCurrency(
                                                Number(item.total_price)
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-full sm:w-72 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">
                                        Subtotal
                                    </span>
                                    <span>
                                        {formatCurrency(
                                            Number(order.subtotal)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">
                                        Shipping
                                    </span>
                                    <span>
                                        {Number(order.shipping_cost) === 0 ? (
                                            <span className="text-emerald-600 font-medium">
                                                FREE
                                            </span>
                                        ) : (
                                            formatCurrency(
                                                Number(order.shipping_cost)
                                            )
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">
                                        CGST (9%)
                                    </span>
                                    <span>
                                        {formatCurrency(
                                            Math.round(Number(order.tax) / 2)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">
                                        SGST (9%)
                                    </span>
                                    <span>
                                        {formatCurrency(
                                            Math.round(Number(order.tax) / 2)
                                        )}
                                    </span>
                                </div>
                                <hr className="border-surface-200 my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-500">
                                        {formatCurrency(Number(order.total))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    {order.payment && (
                        <div className="px-8 py-5 bg-surface-50 border-t border-surface-200">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-text-muted" />
                                <div className="text-sm">
                                    <span className="text-text-secondary">
                                        Payment:{" "}
                                    </span>
                                    <span className="font-medium capitalize">
                                        {order.payment.provider}
                                    </span>
                                    {order.payment.provider_payment_id && (
                                        <span className="text-text-muted ml-2 font-mono text-xs">
                                            {order.payment.provider_payment_id}
                                        </span>
                                    )}
                                    <span
                                        className={`ml-3 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            order.payment.status === "captured"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {order.payment.status === "captured"
                                            ? "Paid"
                                            : order.payment.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-8 py-6 text-center border-t border-surface-200">
                        <p className="text-lg font-semibold text-indigo-600 mb-1">
                            Thank you{order.customer_name ? `, ${order.customer_name}` : ""}! 🎉
                        </p>
                        <p className="text-sm text-text-muted">
                            Welcome back anytime — Aiel Enterprises
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-muted">
                            <MapPin className="h-4 w-4" />
                            <span>
                                Estimated delivery: 3–5 business days
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link href="/products" className="flex-1">
                        <Button variant="outline" fullWidth size="lg">
                            Continue Shopping
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button fullWidth size="lg">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
