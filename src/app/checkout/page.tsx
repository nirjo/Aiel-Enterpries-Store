"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, ShoppingBag, CreditCard, Truck, Lock } from "lucide-react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In production, this would create an order and initiate Razorpay payment
      // For demo, simulate successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      clearCart();
      router.push("/checkout/success?order=AIEL-DEMO-12345");
    } catch (error) {
      toast.error("Payment failed", "Please try again");
      router.push("/checkout/failure");
    } finally {
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
        <p className="text-text-muted mb-6">Add some items to checkout</p>
        <Link href="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-surface-300">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/cart" className="text-text-muted hover:text-primary-500 transition-colors">
                  Cart
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 text-text-muted" />
              <li className="text-text-primary font-medium">Checkout</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Form */}
            <div className="space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-2xl border border-surface-300 p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-400 text-white text-sm flex items-center justify-center">1</span>
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
                  <span className="w-6 h-6 rounded-full bg-primary-400 text-white text-sm flex items-center justify-center">2</span>
                  Shipping Address
                </h2>
                <div className="grid gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-surface-300 p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-400 text-white text-sm flex items-center justify-center">3</span>
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-primary-400 bg-primary-50 rounded-xl cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="text-primary-400" />
                    <CreditCard className="h-5 w-5 text-primary-500" />
                    <span className="font-medium">Pay with Razorpay</span>
                    <Badge variant="success" size="sm" className="ml-auto">Secure</Badge>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-surface-400 rounded-xl cursor-pointer hover:bg-surface-50 transition-colors">
                    <input type="radio" name="payment" className="text-primary-400" />
                    <Truck className="h-5 w-5 text-text-muted" />
                    <span className="text-text-secondary">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-surface-300 p-6 lg:sticky lg:top-40">
                <h2 className="text-lg font-semibold text-text-primary mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <ul className="space-y-4 mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
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
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-sm text-text-muted">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <hr className="border-surface-300 mb-6" />

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-success">FREE</span> : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tax (18% GST)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <hr className="border-surface-300" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-primary-500">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" isLoading={isProcessing}>
                  <Lock className="h-4 w-4" />
                  {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
                </Button>

                <p className="text-xs text-text-muted text-center mt-4 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
