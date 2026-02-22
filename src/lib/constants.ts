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
    {
        label: "Aiel Toy Paradise",
        href: "/products?category=aiel-toy-paradise",
        subcategories: [
            { label: "Sensory Toys", slug: "sensory-toys", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop", description: "Fidget spinners, pop-its & tactile play" },
            { label: "Montessori Toys", slug: "montessori-toys", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop", description: "Wooden puzzles & learning materials" },
            { label: "Educational Toys", slug: "educational-toys", image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=300&fit=crop", description: "Interactive learning & discovery" },
            { label: "STEM Toys", slug: "stem-toys", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop", description: "Robotics, coding & science kits" },
            { label: "Action Figures", slug: "action-figures", image: "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=400&h=300&fit=crop", description: "Superheroes, vehicles & collectibles" },
            { label: "Musical Toys", slug: "musical-toys", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop", description: "Instruments & music makers for kids" },
            { label: "Board & Card Games", slug: "board-card-games", image: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&h=300&fit=crop", description: "Family strategy & party games" },
            { label: "Wooden Toys", slug: "wooden-toys", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop", description: "Classic handcrafted wooden play" },
        ],
    },
    { label: "Home & Kitchen", href: "/products?category=home-kitchen" },
    { label: "Home Decor", href: "/products?category=home-decor" },
    { label: "Gardening", href: "/products?category=gardening" },
    { label: "Electronics", href: "/products?category=electronics" },
    { label: "Stationery Items", href: "/products?category=stationery-items" },
    { label: "Sport & Exercise", href: "/products?category=sport-exercise" },
    { label: "Gift Items", href: "/products?category=gift-items" },
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
