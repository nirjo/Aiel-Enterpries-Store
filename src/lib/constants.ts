export const APP_NAME = "Aiel Enterprises";
export const APP_DESCRIPTION = "Toys, home essentials, electronics & gifts — your one-stop family store";
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

// Subcategory type
export interface Subcategory {
    label: string;
    slug: string;
    image: string;
    description: string;
}

export interface NavLink {
    label: string;
    href: string;
    subcategories?: Subcategory[];
}

// Navigation Links — Main Categories
export const NAV_LINKS: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    { label: "Home & Kitchen", href: "/products?category=home-kitchen" },
    { label: "Home Decor", href: "/products?category=home-decor" },
    { label: "Gardening", href: "/products?category=gardening" },
    { label: "Gift Items", href: "/products?category=gift-items" },
    { label: "Electronics", href: "/products?category=electronics" },
    { label: "Sport & Exercise", href: "/products?category=sport-exercise" },
];

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
