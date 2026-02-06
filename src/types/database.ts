export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    phone: string | null;
                    role: "customer" | "admin";
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    phone?: string | null;
                    role?: "customer" | "admin";
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    phone?: string | null;
                    role?: "customer" | "admin";
                    avatar_url?: string | null;
                    updated_at?: string;
                };
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    image_url: string | null;
                    parent_id: string | null;
                    sort_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    image_url?: string | null;
                    parent_id?: string | null;
                    sort_order?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    image_url?: string | null;
                    parent_id?: string | null;
                    sort_order?: number;
                    is_active?: boolean;
                    updated_at?: string;
                };
            };
            products: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    short_description: string | null;
                    price: number;
                    compare_at_price: number | null;
                    cost_price: number | null;
                    sku: string | null;
                    barcode: string | null;
                    category_id: string | null;
                    images: string[];
                    thumbnail_url: string | null;
                    is_active: boolean;
                    is_featured: boolean;
                    tags: string[];
                    metadata: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    short_description?: string | null;
                    price: number;
                    compare_at_price?: number | null;
                    cost_price?: number | null;
                    sku?: string | null;
                    barcode?: string | null;
                    category_id?: string | null;
                    images?: string[];
                    thumbnail_url?: string | null;
                    is_active?: boolean;
                    is_featured?: boolean;
                    tags?: string[];
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    short_description?: string | null;
                    price?: number;
                    compare_at_price?: number | null;
                    cost_price?: number | null;
                    sku?: string | null;
                    barcode?: string | null;
                    category_id?: string | null;
                    images?: string[];
                    thumbnail_url?: string | null;
                    is_active?: boolean;
                    is_featured?: boolean;
                    tags?: string[];
                    metadata?: Json;
                    updated_at?: string;
                };
            };
            inventory: {
                Row: {
                    id: string;
                    product_id: string;
                    quantity: number;
                    reserved_quantity: number;
                    low_stock_threshold: number;
                    warehouse_location: string | null;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    product_id: string;
                    quantity?: number;
                    reserved_quantity?: number;
                    low_stock_threshold?: number;
                    warehouse_location?: string | null;
                    updated_at?: string;
                };
                Update: {
                    quantity?: number;
                    reserved_quantity?: number;
                    low_stock_threshold?: number;
                    warehouse_location?: string | null;
                    updated_at?: string;
                };
            };
            addresses: {
                Row: {
                    id: string;
                    user_id: string;
                    type: "shipping" | "billing";
                    full_name: string;
                    phone: string;
                    address_line1: string;
                    address_line2: string | null;
                    city: string;
                    state: string;
                    postal_code: string;
                    country: string;
                    is_default: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    type?: "shipping" | "billing";
                    full_name: string;
                    phone: string;
                    address_line1: string;
                    address_line2?: string | null;
                    city: string;
                    state: string;
                    postal_code: string;
                    country?: string;
                    is_default?: boolean;
                    created_at?: string;
                };
                Update: {
                    type?: "shipping" | "billing";
                    full_name?: string;
                    phone?: string;
                    address_line1?: string;
                    address_line2?: string | null;
                    city?: string;
                    state?: string;
                    postal_code?: string;
                    country?: string;
                    is_default?: boolean;
                };
            };
            orders: {
                Row: {
                    id: string;
                    order_number: string;
                    user_id: string | null;
                    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
                    subtotal: number;
                    discount: number;
                    shipping_cost: number;
                    tax: number;
                    total: number;
                    currency: string;
                    shipping_address: Json;
                    billing_address: Json | null;
                    notes: string | null;
                    metadata: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_number: string;
                    user_id?: string | null;
                    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
                    subtotal: number;
                    discount?: number;
                    shipping_cost?: number;
                    tax?: number;
                    total: number;
                    currency?: string;
                    shipping_address: Json;
                    billing_address?: Json | null;
                    notes?: string | null;
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
                    discount?: number;
                    shipping_cost?: number;
                    tax?: number;
                    total?: number;
                    shipping_address?: Json;
                    billing_address?: Json | null;
                    notes?: string | null;
                    metadata?: Json;
                    updated_at?: string;
                };
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    product_name: string;
                    product_image: string | null;
                    quantity: number;
                    unit_price: number;
                    total_price: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    product_id?: string | null;
                    product_name: string;
                    product_image?: string | null;
                    quantity: number;
                    unit_price: number;
                    total_price: number;
                    created_at?: string;
                };
                Update: {
                    quantity?: number;
                    unit_price?: number;
                    total_price?: number;
                };
            };
            payments: {
                Row: {
                    id: string;
                    order_id: string;
                    provider: "razorpay" | "stripe" | "cod";
                    provider_order_id: string | null;
                    provider_payment_id: string | null;
                    provider_signature: string | null;
                    amount: number;
                    currency: string;
                    status: "pending" | "authorized" | "captured" | "failed" | "refunded";
                    method: string | null;
                    metadata: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    provider: "razorpay" | "stripe" | "cod";
                    provider_order_id?: string | null;
                    provider_payment_id?: string | null;
                    provider_signature?: string | null;
                    amount: number;
                    currency?: string;
                    status?: "pending" | "authorized" | "captured" | "failed" | "refunded";
                    method?: string | null;
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    provider_order_id?: string | null;
                    provider_payment_id?: string | null;
                    provider_signature?: string | null;
                    status?: "pending" | "authorized" | "captured" | "failed" | "refunded";
                    method?: string | null;
                    metadata?: Json;
                    updated_at?: string;
                };
            };
            carts: {
                Row: {
                    id: string;
                    user_id: string | null;
                    session_id: string | null;
                    items: Json;
                    created_at: string;
                    updated_at: string;
                    expires_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    session_id?: string | null;
                    items?: Json;
                    created_at?: string;
                    updated_at?: string;
                    expires_at?: string;
                };
                Update: {
                    user_id?: string | null;
                    session_id?: string | null;
                    items?: Json;
                    updated_at?: string;
                    expires_at?: string;
                };
            };
        };
    };
}

// Derived types for convenience
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Inventory = Database["public"]["Tables"]["inventory"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Cart = Database["public"]["Tables"]["carts"]["Row"];

// Product with inventory
export type ProductWithInventory = Product & {
    inventory: Inventory | null;
    category: Category | null;
};

// Order with items
export type OrderWithItems = Order & {
    items: OrderItem[];
    payment: Payment | null;
};
