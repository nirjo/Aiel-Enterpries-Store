export const APP_NAME = "Aiel Enterprises";
export const APP_DESCRIPTION = "Anti-gravity toys, magnetic levitation gadgets & STEM skill toys";
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

// Navigation Links — Anti-Gravity Toy Categories
export const NAV_LINKS: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
        label: "Levitation Toys",
        href: "/products?category=levitation-toys",
        subcategories: [
            { label: "Magnetic Levitation Globes", slug: "lev-globes", image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop", description: "Floating globe displays with LED lights" },
            { label: "Levitating Speakers", slug: "lev-speakers", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop", description: "Bluetooth speakers that hover in mid-air" },
            { label: "Floating Photo Frames", slug: "lev-frames", image: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=400&h=300&fit=crop", description: "Magnetic frames that defy gravity" },
            { label: "Hover UFO Toys", slug: "hover-ufo", image: "https://images.unsplash.com/photo-1601892782225-e7a4a27d0e5c?w=400&h=300&fit=crop", description: "Hand-controlled hovering UFO drones" },
            { label: "Levitating Lamps", slug: "lev-lamps", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", description: "Zero-gravity desk lamps with LED" },
            { label: "Floating Bonsai", slug: "lev-bonsai", image: "https://images.unsplash.com/photo-1567331711402-509c12c41959?w=400&h=300&fit=crop", description: "Magnetic levitation plant displays" },
            { label: "Anti-Gravity Pen Sets", slug: "anti-gravity-pens", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop", description: "Pens that write in zero-gravity" },
            { label: "Magnetic Sculptures", slug: "mag-sculptures", image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400&h=300&fit=crop", description: "Ferrofluid & magnetic art pieces" },
        ],
    },
    {
        label: "Gyroscopes & Spinners",
        href: "/products?category=gyroscopes",
        subcategories: [
            { label: "Precision Gyroscopes", slug: "precision-gyros", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", description: "High-speed metal gyroscopes" },
            { label: "Fidget Spinners", slug: "fidget-spinners", image: "https://images.unsplash.com/photo-1559827291-bdd57d67c38b?w=400&h=300&fit=crop", description: "Premium bearings, mesmerizing spin" },
            { label: "Spinning Tops", slug: "spinning-tops", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop", description: "Forever-spinning precision tops" },
            { label: "Gyro Wheels", slug: "gyro-wheels", image: "https://images.unsplash.com/photo-1611329532992-0b7ba27d85fb?w=400&h=300&fit=crop", description: "Motorized gyroscope wheels" },
            { label: "Euler's Disks", slug: "eulers-disk", image: "https://images.unsplash.com/photo-1504610926078-a1611562236f?w=400&h=300&fit=crop", description: "Hypnotic spinning metal disks" },
            { label: "Kinetic Desk Toys", slug: "kinetic-desk", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop", description: "Perpetual motion desktop gadgets" },
            { label: "Balance Eagles", slug: "balance-eagles", image: "https://images.unsplash.com/photo-1617714651331-02407c1e94d1?w=400&h=300&fit=crop", description: "Gravity-defying balance birds" },
            { label: "Tornado Vortex", slug: "tornado-vortex", image: "https://images.unsplash.com/photo-1527176930608-09cb256ab504?w=400&h=300&fit=crop", description: "Mesmerizing vortex chamber toys" },
        ],
    },
    {
        label: "STEM Kits",
        href: "/products?category=stem-kits",
        subcategories: [
            { label: "Feel Flux Toys", slug: "feel-flux", image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&h=300&fit=crop", description: "Magnet gravity tube experience" },
            { label: "Magnet Science Kits", slug: "magnet-kits", image: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop", description: "Explore magnetic fields & forces" },
            { label: "Electricity Kits", slug: "electricity-kits", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", description: "Build circuits & light LEDs" },
            { label: "Robotics Starter", slug: "robotics-starter", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop", description: "Build & program your first robot" },
            { label: "Physics Lab Sets", slug: "physics-lab", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", description: "Gravity, motion & force experiments" },
            { label: "Space Exploration", slug: "space-exploration", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop", description: "Rocket kits, star projectors & more" },
            { label: "Coding Toys", slug: "coding-toys", image: "https://images.unsplash.com/photo-1515879218367-8466d910auj9?w=400&h=300&fit=crop", description: "Screen-free coding for kids" },
            { label: "Chemistry Sets", slug: "chemistry-sets", image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop", description: "Safe & fun chemistry experiments" },
        ],
    },
    {
        label: "Magnetic Gadgets",
        href: "/products?category=magnetic-gadgets",
        subcategories: [
            { label: "Ferrofluid Displays", slug: "ferrofluid", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop", description: "Liquid magnet art in sealed bottles" },
            { label: "Magnetic Putty", slug: "magnetic-putty", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop", description: "Thinking putty that swallows magnets" },
            { label: "Magnetic Building Tiles", slug: "mag-tiles", image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=300&fit=crop", description: "3D magnetic construction sets" },
            { label: "Neodymium Sets", slug: "neodymium", image: "https://images.unsplash.com/photo-1504610926078-a1611562236f?w=400&h=300&fit=crop", description: "Super-strong rare earth magnets" },
            { label: "Magnetic Sand", slug: "magnetic-sand", image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&h=300&fit=crop", description: "Iron-enriched kinetic sand" },
            { label: "Mag-Lev Train Kits", slug: "maglev-train", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop", description: "Build your own magnetic train" },
            { label: "Magnetic Chess", slug: "magnetic-chess", image: "https://images.unsplash.com/photo-1586165368502-1bad9cc116e3?w=400&h=300&fit=crop", description: "Travel chess with magnetic pieces" },
            { label: "Magnet Fishing Kits", slug: "magnet-fishing", image: "https://images.unsplash.com/photo-1528402671071-7c68e0f75e8d?w=400&h=300&fit=crop", description: "Treasure hunting with magnets" },
        ],
    },
    {
        label: "Space & Gravity",
        href: "/products?category=space-gravity",
        subcategories: [
            { label: "Planetarium Projectors", slug: "planetarium", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop", description: "Project the cosmos on your ceiling" },
            { label: "Anti-Gravity Sand", slug: "anti-gravity-sand", image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&h=300&fit=crop", description: "Hydrophobic sand that stays dry" },
            { label: "Newton's Cradles", slug: "newtons-cradle", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", description: "Classic momentum demonstration" },
            { label: "Plasma Balls", slug: "plasma-balls", image: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=400&h=300&fit=crop", description: "Touch-reactive electric globes" },
            { label: "Astronaut Models", slug: "astronaut-models", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop", description: "Detailed spaceman figurines" },
            { label: "Telescope Kits", slug: "telescope-kits", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", description: "Explore the night sky with clarity" },
            { label: "Rocket Launchers", slug: "rocket-launchers", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&h=300&fit=crop", description: "Water & air-powered rockets" },
            { label: "Solar System Models", slug: "solar-system", image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop", description: "Motorized orbiting planet models" },
        ],
    },
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
