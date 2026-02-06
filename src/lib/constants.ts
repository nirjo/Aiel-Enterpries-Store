export const APP_NAME = "Aiel Enterprises";
export const APP_DESCRIPTION = "Premium quality products at affordable prices";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Currency
export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;

// Order Statuses
export const ORDER_STATUSES = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
    processing: { label: "Processing", color: "bg-indigo-100 text-indigo-800" },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
} as const;

// Payment Statuses
export const PAYMENT_STATUSES = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    authorized: { label: "Authorized", color: "bg-blue-100 text-blue-800" },
    captured: { label: "Paid", color: "bg-green-100 text-green-800" },
    failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
} as const;

// Navigation Links
export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
] as const;

// Footer Links
export const FOOTER_LINKS = {
    shop: [
        { label: "All Products", href: "/products" },
        { label: "Categories", href: "/categories" },
        { label: "New Arrivals", href: "/products?sort=newest" },
        { label: "Best Sellers", href: "/products?sort=popular" },
    ],
    support: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/faq" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns", href: "/returns" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ],
} as const;

// Social Links
export const SOCIAL_LINKS = {
    instagram: "https://instagram.com/aielenterprises",
    facebook: "https://facebook.com/aielenterprises",
    twitter: "https://twitter.com/aielenterprises",
} as const;
