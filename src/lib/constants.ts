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

// Navigation Links with subcategories
export const NAV_LINKS: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    {
        label: "Toy Paradise",
        href: "/products?category=toy-paradise",
        subcategories: [
            { label: "Sensory Toys", slug: "sensory-toys", image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop", description: "Tactile, visual & auditory exploration" },
            { label: "Montessori Toys", slug: "montessori-toys", image: "https://images.unsplash.com/photo-1615715616181-6ba85d724137?w=400&h=300&fit=crop", description: "Self-directed learning toys" },
            { label: "Educational Toys", slug: "educational-toys", image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=300&fit=crop", description: "Learn while playing" },
            { label: "STEM Toys", slug: "stem-toys", image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400&h=300&fit=crop", description: "Science, tech, engineering & math" },
            { label: "Action Figures", slug: "action-figures", image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=300&fit=crop", description: "Heroes & characters collectibles" },
            { label: "Musical Toys", slug: "musical-toys", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop", description: "Instruments & musical fun" },
            { label: "Board/Card Games", slug: "board-card-games", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop", description: "Family game night favorites" },
            { label: "Wooden Toys", slug: "wooden-toys", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop", description: "Classic handcrafted playthings" },
        ],
    },
    {
        label: "Home Decor",
        href: "/products?category=home-decor",
        subcategories: [
            { label: "Wall Art", slug: "wall-art", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=300&fit=crop", description: "Paintings, prints & wall hangings" },
            { label: "Candles & Holders", slug: "candles-holders", image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&h=300&fit=crop", description: "Aromatic candles & elegant holders" },
            { label: "Cushions & Throws", slug: "cushions-throws", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", description: "Cozy textiles for every room" },
            { label: "Vases & Plants", slug: "vases-plants", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop", description: "Decorative vases & greenery" },
            { label: "Photo Frames", slug: "photo-frames", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop", description: "Display your favorite memories" },
            { label: "Mirrors", slug: "mirrors", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop", description: "Decorative & functional mirrors" },
            { label: "Clocks", slug: "clocks", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=300&fit=crop", description: "Stylish wall & table clocks" },
            { label: "Figurines", slug: "figurines", image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop", description: "Decorative sculptures & figures" },
        ],
    },
    {
        label: "Kitchen Items",
        href: "/products?category=kitchen-items",
        subcategories: [
            { label: "Cookware", slug: "cookware", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", description: "Pots, pans & cooking essentials" },
            { label: "Bakeware", slug: "bakeware", image: "https://images.unsplash.com/photo-1556217477-d325251ece38?w=400&h=300&fit=crop", description: "Baking trays, molds & more" },
            { label: "Kitchen Tools", slug: "kitchen-tools", image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&h=300&fit=crop", description: "Utensils & gadgets" },
            { label: "Storage & Organization", slug: "storage-organization", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop", description: "Containers & organizers" },
            { label: "Drinkware", slug: "drinkware", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop", description: "Cups, mugs & glasses" },
            { label: "Dinnerware", slug: "dinnerware", image: "https://images.unsplash.com/photo-1603199506016-5f36e6d3de5b?w=400&h=300&fit=crop", description: "Plates, bowls & dining sets" },
            { label: "Cutting Boards", slug: "cutting-boards", image: "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=400&h=300&fit=crop", description: "Wood & bamboo boards" },
            { label: "Spice Racks", slug: "spice-racks", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop", description: "Organize your spices beautifully" },
        ],
    },
    {
        label: "Gardening",
        href: "/products?category=gardening",
        subcategories: [
            { label: "Seeds & Bulbs", slug: "seeds-bulbs", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop", description: "Flower & vegetable seeds" },
            { label: "Garden Tools", slug: "garden-tools", image: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=400&h=300&fit=crop", description: "Essential gardening equipment" },
            { label: "Pots & Planters", slug: "pots-planters", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop", description: "Ceramic, terracotta & modern pots" },
            { label: "Watering", slug: "watering", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop", description: "Watering cans & sprinklers" },
            { label: "Soil & Fertilizer", slug: "soil-fertilizer", image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop", description: "Potting mix & plant nutrition" },
            { label: "Plant Care", slug: "plant-care", image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop", description: "Pruning, support & protection" },
            { label: "Outdoor Decor", slug: "outdoor-decor", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", description: "Garden ornaments & lighting" },
            { label: "Gloves & Accessories", slug: "gloves-accessories", image: "https://images.unsplash.com/photo-1599629954294-14df9ec13f7c?w=400&h=300&fit=crop", description: "Gloves, kneelers & aprons" },
        ],
    },
    {
        label: "Gift Items",
        href: "/products?category=gift-items",
        subcategories: [
            { label: "Gift Boxes", slug: "gift-boxes", image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400&h=300&fit=crop", description: "Beautifully packaged gift sets" },
            { label: "Personalized Gifts", slug: "personalized-gifts", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop", description: "Custom engraved & printed items" },
            { label: "Greeting Cards", slug: "greeting-cards", image: "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=400&h=300&fit=crop", description: "Handmade & printed cards" },
            { label: "Wrapping Paper", slug: "wrapping-paper", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&h=300&fit=crop", description: "Decorative gift wrapping" },
            { label: "Hampers", slug: "hampers", image: "https://images.unsplash.com/photo-1543255006-d6395b6f1171?w=400&h=300&fit=crop", description: "Curated gift hampers & baskets" },
            { label: "Keychains & Accessories", slug: "keychains-accessories", image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=300&fit=crop", description: "Stylish trinkets & tokens" },
            { label: "Scented Candles", slug: "scented-candles", image: "https://images.unsplash.com/photo-1603905179938-b1bf964a44d6?w=400&h=300&fit=crop", description: "Aromatic luxury candles" },
            { label: "Photo Albums", slug: "photo-albums", image: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76cb?w=400&h=300&fit=crop", description: "Preserve precious memories" },
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
