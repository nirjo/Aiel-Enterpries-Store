import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    image: string | null;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (item: Omit<CartItem, "id">) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Computed
    getItemCount: () => number;
    getSubtotal: () => number;
    getItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => {
                const { items } = get();
                const existingItem = items.find((i) => i.productId === item.productId);

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.productId === item.productId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                ...item,
                                id: `${item.productId}-${Date.now()}`,
                            },
                        ],
                    });
                }

                // Open cart drawer after adding item
                set({ isOpen: true });
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((i) => i.productId !== productId),
                });
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                set({
                    items: get().items.map((i) =>
                        i.productId === productId ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            toggleCart: () => {
                set({ isOpen: !get().isOpen });
            },

            openCart: () => {
                set({ isOpen: true });
            },

            closeCart: () => {
                set({ isOpen: false });
            },

            getItemCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
            },

            getItem: (productId) => {
                return get().items.find((i) => i.productId === productId);
            },
        }),
        {
            name: "aiel-cart",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items }), // Only persist items
        }
    )
);
