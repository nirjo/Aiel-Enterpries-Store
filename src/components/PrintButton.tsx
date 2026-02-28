"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
        >
            <Printer className="h-4 w-4" />
            Print
        </button>
    );
}
