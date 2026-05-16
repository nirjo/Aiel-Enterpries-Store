"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                        background: "#fff",
                    }}
                >
                    <div style={{ maxWidth: "28rem", textAlign: "center" }}>
                        <div
                            style={{
                                width: "5rem",
                                height: "5rem",
                                borderRadius: "50%",
                                background: "#fef3c7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1.5rem",
                                fontSize: "2rem",
                            }}
                        >
                            ⚠️
                        </div>
                        <h1
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                color: "#1a1a1a",
                                marginBottom: "0.75rem",
                            }}
                        >
                            Something went wrong
                        </h1>
                        <p
                            style={{
                                color: "#666",
                                marginBottom: "2rem",
                                lineHeight: 1.6,
                            }}
                        >
                            We encountered an unexpected error. Please try again.
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                padding: "0.75rem 2rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                background: "#8f189d",
                                color: "white",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: "1rem",
                                marginRight: "0.5rem",
                            }}
                        >
                            Try Again
                        </button>
                        <a
                            href="/"
                            style={{
                                display: "inline-block",
                                padding: "0.75rem 2rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #ddd",
                                color: "#333",
                                fontWeight: 600,
                                textDecoration: "none",
                                fontSize: "1rem",
                            }}
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
