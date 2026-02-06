import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order || "AIEL-XXXX-XXXX";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>

        <h1 className="text-3xl font-display font-bold text-text-primary mb-3">
          Order Confirmed!
        </h1>

        <p className="text-text-secondary mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="bg-surface-100 rounded-2xl p-6 mb-8">
          <p className="text-sm text-text-muted mb-1">Order Number</p>
          <p className="text-xl font-semibold text-text-primary font-mono">
            {orderNumber}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-text-secondary mb-8">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary-500" />
            <span>Shipping in 3-5 days</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/orders">
            <Button fullWidth size="lg">
              View Order Details
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" fullWidth size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <p className="text-xs text-text-muted mt-6">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
