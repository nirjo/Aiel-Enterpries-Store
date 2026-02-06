import Link from "next/link";
import { XCircle, RefreshCw, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui";

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-error" />
        </div>

        <h1 className="text-3xl font-display font-bold text-text-primary mb-3">
          Payment Failed
        </h1>

        <p className="text-text-secondary mb-8">
          We couldn&apos;t process your payment. Please try again or use a different payment method.
        </p>

        <div className="space-y-3">
          <Link href="/checkout">
            <Button fullWidth size="lg">
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" fullWidth size="lg">
              Return to Cart
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-surface-100 rounded-xl">
          <p className="text-sm text-text-secondary flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            Need help? Call us at +91 98765 43210
          </p>
        </div>
      </div>
    </div>
  );
}
