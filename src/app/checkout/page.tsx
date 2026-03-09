"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    ShoppingBag,
    CreditCard,
    Truck,
    Lock,
    Loader2,
} from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils/format";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCartStore();
    const toast = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
        "razorpay"
    );
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
    });

    const subtotal = getSubtotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-surface-100 py-8">
                <div className="container mx-auto px-4 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = (): boolean => {
        if (!formData.email || !formData.fullName || !formData.phone) {
            toast.error("Missing info", "Please fill in all contact details");
            return false;
        }
        if (
            !formData.addressLine1 ||
            !formData.city ||
            !formData.state ||
            !formData.postalCode
        ) {
            toast.error("Missing address", "Please fill in your shipping address");
            return false;
        }
        return true;
    };

    const openRazorpayCheckout = useCallback(
        async (orderData: {
            razorpayOrderId: string;
            orderId: string;
            orderNumber: string;
            amount: number;
            currency: string;
            customer: { name: string; email: string; phone: string };
        }) => {
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim(),
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Aiel Enterprises",
                description: `Order ${orderData.orderNumber}`,
                order_id: orderData.razorpayOrderId,
                prefill: {
                    name: orderData.customer.name,
                    email: orderData.customer.email,
                    contact: orderData.customer.phone,
                },
                theme: {
                    color: "#4f46e5",
                    backdrop_color: "rgba(0,0,0,0.6)",
                },
                handler: async function (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) {
                    // Verify payment on server
                    try {
                        const verifyRes = await fetch(
                            "/api/razorpay/verify-payment",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                    orderId: orderData.orderId,
                                }),
                            }
                        );

                        const result = await verifyRes.json();

                        if (result.success) {
                            clearCart();
                            router.push(
                                `/checkout/success?orderId=${orderData.orderId}&order=${orderData.orderNumber}`
                            );
                        } else {
                            toast.error(
                                "Verification failed",
                                "Payment could not be verified. Contact support."
                            );
                            router.push("/checkout/failure");
                        }
                    } catch (err) {
                        console.error("Verify error:", err);
                        toast.error("Error", "Something went wrong during verification");
                        router.push("/checkout/failure");
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.error(
                            "Payment cancelled",
                            "You closed the payment window"
                        );
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on(
                "payment.failed",
                function (response: { error: { description: string } }) {
                    setIsProcessing(false);
                    toast.error(
                        "Payment failed",
                        response.error.description || "Please try again"
                    );
                    router.push("/checkout/failure");
                }
            );
            rzp.open();
        },
        [clearCart, router, toast]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsProcessing(true);

        try {
            // Step 1: Create order on server
            const createRes = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    customer: {
                        email: formData.email,
                        fullName: formData.fullName,
                        phone: formData.phone,
                    },
                    shippingAddress: {
                        fullName: formData.fullName,
                        phone: formData.phone,
                        addressLine1: formData.addressLine1,
                        addressLine2: formData.addressLine2,
                        city: formData.city,
                        state: formData.state,
                        postalCode: formData.postalCode,
                    },
                }),
            });

            const orderData = await createRes.json();

            if (!createRes.ok || !orderData.success) {
                throw new Error(orderData.error || "Failed to create order");
            }

            if (paymentMethod === "razorpay") {
                // Step 2: Open Razorpay checkout
                if (!window.Razorpay) {
                    toast.error(
                        "Loading error",
                        "Payment gateway is loading. Please try again."
                    );
                    setIsProcessing(false);
                    return;
                }
                openRazorpayCheckout(orderData);
            } else {
                // COD flow — mark as confirmed directly
                clearCart();
                router.push(
                    `/checkout/success?orderId=${orderData.orderId}&order=${orderData.orderNumber}`
                );
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(
                "Order failed",
                error.message || "Please try again"
            );
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 rounded-full bg-surface-200 flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-text-muted" />
                </div>
                <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
                    Your cart is empty
                </h1>
                <p className="text-text-muted mb-6">
                    Add some items to checkout
                </p>
                <Link href="/products">
                    <Button size="lg">Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-100">
            {/* Load Razorpay script */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
                strategy="lazyOnload"
            />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-surface-300 pt-6 pb-4 shadow-sm">
                <div className="container mx-auto px-4">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-text-muted hover:text-primary-500 transition-colors font-medium"
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="text-text-muted">›</li>
                            <li>
                                <Link
                                    href="/cart"
                                    className="text-text-muted hover:text-primary-500 transition-colors font-medium"
                                >
                                    Cart
                                </Link>
                            </li>
                            <ChevronRight className="h-3 w-3 text-text-muted" />
                            <li className="text-text-primary font-semibold">
                                Checkout
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Left - Form */}
                        <div className="space-y-5 order-2 lg:order-1">
                            {/* Contact */}
                            <div className="bg-white rounded-2xl border border-surface-300 p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-400 text-white text-sm flex items-center justify-center">
                                        1
                                    </span>
                                    Contact Information
                                </h2>
                                <div className="grid gap-4">
                                    <Input
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                    <Input
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Nirmalraj Joseph"
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="bg-white rounded-2xl border border-surface-300 p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-400 text-white text-sm flex items-center justify-center">
                                        2
                                    </span>
                                    Shipping Address
                                </h2>
                                <div className="grid gap-4">
                                    <Input
                                        label="Address Line 1"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleInputChange}
                                        placeholder="123 Main Street"
                                        required
                                    />
                                    <Input
                                        label="Address Line 2 (Optional)"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleInputChange}
                                        placeholder="Apartment, suite, etc."
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Puducherry"
                                            required
                                        />
                                        <Input
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Puducherry"
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="Postal Code"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="605001"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl border border-surface-300 p-6">
                                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-400 text-white text-sm flex items-center justify-center">
                                        3
                                    </span>
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center gap-3 p-4 min-h-[56px] border rounded-xl cursor-pointer transition-all ${
                                            paymentMethod === "razorpay"
                                                ? "border-primary-400 bg-primary-50 shadow-sm"
                                                : "border-surface-400 hover:bg-surface-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={
                                                paymentMethod === "razorpay"
                                            }
                                            onChange={() =>
                                                setPaymentMethod("razorpay")
                                            }
                                            className="text-primary-400"
                                        />
                                        <CreditCard className="h-5 w-5 text-primary-500" />
                                        <div className="flex-1">
                                            <span className="font-medium">
                                                Pay with Razorpay
                                            </span>
                                            <p className="text-xs text-text-muted mt-0.5">
                                                UPI · Cards · Netbanking ·
                                                Wallets
                                            </p>
                                        </div>
                                        <Badge
                                            variant="success"
                                            size="sm"
                                            className="ml-auto"
                                        >
                                            Secure
                                        </Badge>
                                    </label>
                                    <label
                                        className={`flex items-center gap-3 p-4 min-h-[56px] border rounded-xl cursor-pointer transition-all ${
                                            paymentMethod === "cod"
                                                ? "border-primary-400 bg-primary-50 shadow-sm"
                                                : "border-surface-400 hover:bg-surface-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "cod"}
                                            onChange={() =>
                                                setPaymentMethod("cod")
                                            }
                                            className="text-primary-400"
                                        />
                                        <Truck className="h-5 w-5 text-text-muted" />
                                        <span className="text-text-secondary">
                                            Cash on Delivery
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right - Order Summary */}
                        <div className="order-1 lg:order-2">
                            <div className="bg-white rounded-2xl border border-surface-300 p-6 lg:sticky lg:top-40">
                                <h2 className="text-lg font-semibold text-text-primary mb-6">
                                    Order Summary
                                </h2>

                                {/* Items */}
                                <ul className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex gap-3"
                                        >
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="h-6 w-6 text-text-muted" />
                                                    </div>
                                                )}
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-400 text-white text-xs rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-text-muted">
                                                    {formatCurrency(item.price)}{" "}
                                                    × {item.quantity}
                                                </p>
                                            </div>
                                            <span className="font-medium text-sm">
                                                {formatCurrency(
                                                    item.price * item.quantity
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <hr className="border-surface-300 mb-6" />

                                {/* Totals */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">
                                            Subtotal
                                        </span>
                                        <span>
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">
                                            Shipping
                                        </span>
                                        <span>
                                            {shipping === 0 ? (
                                                <span className="text-success">
                                                    FREE
                                                </span>
                                            ) : (
                                                formatCurrency(shipping)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">
                                            Tax (18% GST)
                                        </span>
                                        <span>{formatCurrency(tax)}</span>
                                    </div>
                                    <hr className="border-surface-300" />
                                    <div className="flex justify-between">
                                        <span className="font-semibold">
                                            Total
                                        </span>
                                        <span className="font-bold text-xl text-primary-500">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    isLoading={isProcessing}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4" />
                                            {paymentMethod === "razorpay"
                                                ? `Pay ${formatCurrency(total)}`
                                                : `Place Order — ${formatCurrency(total)}`}
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-text-muted text-center mt-4 flex items-center justify-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    {paymentMethod === "razorpay"
                                        ? "Secure checkout powered by Razorpay"
                                        : "Pay when your order arrives"}
                                </p>

                                {/* Test card info */}
                                {paymentMethod === "razorpay" && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                        <p className="text-xs font-medium text-amber-800 mb-1">
                                            🧪 Test Mode
                                        </p>
                                        <p className="text-xs text-amber-700">
                                            Card: 4111 1111 1111 1111
                                            <br />
                                            Expiry: Any future date · CVV: Any 3
                                            digits
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
