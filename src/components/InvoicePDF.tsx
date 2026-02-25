"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface OrderData {
    order_number: string;
    created_at: string;
    customer_name: string | null;
    customer_email: string | null;
    status: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
    shipping_address: {
        full_name?: string;
        phone?: string;
        address_line1?: string;
        address_line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
    } | null;
    items: {
        product_name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }[];
    payment: {
        provider: string;
        status: string;
        provider_payment_id: string | null;
    } | null;
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

/**
 * Generate PDF from HTML string using jsPDF's html method.
 * We dynamically import jsPDF + html2canvas to keep bundle size small.
 */
async function generateInvoicePDF(order: OrderData): Promise<void> {
    // Dynamically import libraries
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
    ]);

    // Build invoice HTML
    const invoiceHTML = buildInvoiceHTML(order);

    // Create a temporary container
    const container = document.createElement("div");
    container.innerHTML = invoiceHTML;
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "794px"; // A4 width in px @96dpi
    document.body.appendChild(container);

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${order.order_number}-invoice.pdf`);
    } finally {
        document.body.removeChild(container);
    }
}

function buildInvoiceHTML(order: OrderData): string {
    const itemsRows = order.items
        .map(
            (item, index) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 8px; font-size: 13px; color: #374151;">${index + 1}</td>
            <td style="padding: 12px 8px; font-size: 13px; color: #111827; font-weight: 500;">${item.product_name}</td>
            <td style="padding: 12px 8px; font-size: 13px; color: #374151; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 8px; font-size: 13px; color: #374151; text-align: right;">${formatCurrency(item.unit_price)}</td>
            <td style="padding: 12px 8px; font-size: 13px; color: #111827; font-weight: 600; text-align: right;">${formatCurrency(item.total_price)}</td>
        </tr>
    `
        )
        .join("");

    const addr = order.shipping_address;

    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 794px; margin: 0 auto; background: #fff; padding: 40px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 3px solid #4f46e5; padding-bottom: 24px;">
            <div>
                <h1 style="margin: 0; font-size: 28px; color: #1a1a2e; font-weight: 700;">Aiel Enterprises</h1>
                <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Your one-stop family store</p>
                <p style="margin: 12px 0 0; color: #6b7280; font-size: 11px; line-height: 1.5;">
                    GSTIN: 34XXXXX1234X1ZX<br/>
                    Puducherry, India — 605001<br/>
                    contact@aielenterprises.com
                </p>
            </div>
            <div style="text-align: right;">
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 2px;">Invoice</p>
                <p style="margin: 8px 0 0; font-size: 16px; font-weight: 600; color: #111827; font-family: monospace;">${order.order_number}</p>
                <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Date: ${formatDate(order.created_at)}</p>
                <p style="margin: 8px 0 0; display: inline-block; background: ${order.status === "confirmed" || order.status === "delivered" ? "#dcfce7" : "#fef3c7"}; color: ${order.status === "confirmed" || order.status === "delivered" ? "#166534" : "#92400e"}; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 12px; text-transform: uppercase;">${order.status}</p>
            </div>
        </div>

        <!-- Bill To / Ship To -->
        <div style="display: flex; gap: 40px; margin-bottom: 32px;">
            <div style="flex: 1;">
                <p style="margin: 0 0 8px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Bill To</p>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${order.customer_name || "Customer"}</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #6b7280;">${order.customer_email || ""}</p>
            </div>
            ${
                addr
                    ? `<div style="flex: 1;">
                <p style="margin: 0 0 8px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Ship To</p>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${addr.full_name || ""}</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
                    ${addr.address_line1 || ""}${addr.address_line2 ? ", " + addr.address_line2 : ""}<br/>
                    ${addr.city || ""}, ${addr.state || ""} — ${addr.postal_code || ""}
                </p>
            </div>`
                    : ""
            }
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
                <tr style="border-bottom: 2px solid #e5e7eb;">
                    <th style="padding: 10px 8px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; text-align: left;">#</th>
                    <th style="padding: 10px 8px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; text-align: left;">Product</th>
                    <th style="padding: 10px 8px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Qty</th>
                    <th style="padding: 10px 8px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Unit Price</th>
                    <th style="padding: 10px 8px; font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
            </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end;">
            <div style="width: 280px;">
                <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px;">
                    <span style="color: #6b7280;">Subtotal</span>
                    <span style="color: #111827;">${formatCurrency(order.subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px;">
                    <span style="color: #6b7280;">Shipping</span>
                    <span style="color: ${order.shipping_cost === 0 ? "#059669" : "#111827"};">${order.shipping_cost === 0 ? "FREE" : formatCurrency(order.shipping_cost)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px;">
                    <span style="color: #6b7280;">CGST (9%)</span>
                    <span style="color: #111827;">${formatCurrency(Math.round(order.tax / 2))}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px;">
                    <span style="color: #6b7280;">SGST (9%)</span>
                    <span style="color: #111827;">${formatCurrency(Math.round(order.tax / 2))}</span>
                </div>
                <div style="border-top: 2px solid #e5e7eb; margin-top: 8px; padding-top: 12px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 700;">
                    <span style="color: #111827;">Total</span>
                    <span style="color: #4f46e5;">${formatCurrency(order.total)}</span>
                </div>
            </div>
        </div>

        <!-- Payment Info -->
        ${
            order.payment
                ? `<div style="margin-top: 24px; padding: 12px 16px; background: #f9fafb; border-radius: 8px; font-size: 12px; color: #6b7280;">
            Payment: <strong style="color: #111827; text-transform: capitalize;">${order.payment.provider}</strong>
            ${order.payment.provider_payment_id ? ` — <span style="font-family: monospace;">${order.payment.provider_payment_id}</span>` : ""}
            <span style="display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; background: ${order.payment.status === "captured" ? "#dcfce7" : "#fef3c7"}; color: ${order.payment.status === "captured" ? "#166534" : "#92400e"};">${order.payment.status === "captured" ? "Paid" : order.payment.status}</span>
        </div>`
                : ""
        }

        <!-- Thank You -->
        <div style="margin-top: 40px; text-align: center; padding: 24px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #4f46e5;">Thank you${order.customer_name ? ", " + order.customer_name : ""}! 🎉</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">Welcome back anytime — Aiel Enterprises</p>
        </div>
    </div>
    `;
}

export default function InvoicePDFButton({ order }: { order: OrderData }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            await generateInvoicePDF(order);
        } catch (err) {
            console.error("PDF generation error:", err);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isGenerating ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Download PDF
                </>
            )}
        </button>
    );
}
