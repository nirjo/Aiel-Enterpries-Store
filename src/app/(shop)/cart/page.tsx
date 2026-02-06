"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

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
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/products">
          <Button size="lg">
            Start Shopping
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface-100 py-4 border-b border-surface-300">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-text-muted">/</li>
              <li className="text-text-primary font-medium">Shopping Cart</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-surface-300 overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-100 border-b border-surface-300">
                <div className="col-span-6 text-sm font-medium text-text-secondary">Product</div>
                <div className="col-span-2 text-sm font-medium text-text-secondary text-center">Price</div>
                <div className="col-span-2 text-sm font-medium text-text-secondary text-center">Quantity</div>
                <div className="col-span-2 text-sm font-medium text-text-secondary text-right">Total</div>
              </div>

              {/* Items */}
              <ul className="divide-y divide-surface-300">
                {items.map((item) => (
                  <li key={item.id} className="p-4 md:p-6">
                    <div className="md:grid md:grid-cols-12 md:gap-4 flex flex-col gap-4">
                      {/* Product */}
                      <div className="md:col-span-6 flex gap-4">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <ShoppingBag className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium text-text-primary hover:text-primary-500 line-clamp-2 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="flex items-center gap-1 mt-2 text-sm text-text-muted hover:text-error transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 flex md:items-center md:justify-center">
                        <div className="flex items-center gap-2 md:flex-col md:gap-0">
                          <span className="font-semibold text-text-primary">
                            {formatCurrency(item.price)}
                          </span>
                          {item.compareAtPrice && (
                            <span className="text-sm text-text-muted line-through">
                              {formatCurrency(item.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex items-center md:justify-center">
                        <div className="flex items-center border border-surface-400 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-surface-100 transition-colors rounded-l-lg"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-surface-100 transition-colors rounded-r-lg"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-2 flex items-center md:justify-end">
                        <span className="font-semibold text-lg text-primary-500">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clear cart */}
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={clearCart} className="text-text-muted">
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-surface-300 p-6 lg:sticky lg:top-40">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 999 && (
                  <p className="text-xs text-text-muted bg-primary-50 rounded-lg p-3">
                    Add {formatCurrency(999 - subtotal)} more to get free shipping!
                  </p>
                )}
                <hr className="border-surface-300" />
                <div className="flex justify-between">
                  <span className="font-semibold text-text-primary">Total</span>
                  <span className="font-bold text-xl text-primary-500">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <Button fullWidth size="lg">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <p className="text-xs text-text-muted text-center mt-4">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
