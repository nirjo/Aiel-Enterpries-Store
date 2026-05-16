import { Loader2 } from "lucide-react";

export default function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-surface-100 py-8">
            <div className="container mx-auto px-4 flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
                    <p className="text-text-muted">Loading checkout...</p>
                </div>
            </div>
        </div>
    );
}
