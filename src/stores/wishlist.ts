import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
    productId: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    image: string | null;
    addedAt: string;
}

interface WishlistState {
    items: WishlistItem[];

    // Actions
    addItem: (item: Omit<WishlistItem, "addedAt">) => void;
    removeItem: (productId: string) => void;
    toggleItem: (item: Omit<WishlistItem, "addedAt">) => void;
    clearWishlist: () => void;

    // Computed
    isInWishlist: (productId: string) => boolean;
    getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const { items } = get();
                if (!items.find((i) => i.productId === item.productId)) {
                    set({
                        items: [
                            ...items,
                            { ...item, addedAt: new Date().toISOString() },
                        ],
                    });
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((i) => i.productId !== productId),
                });
            },

            toggleItem: (item) => {
                const { items } = get();
                if (items.find((i) => i.productId === item.productId)) {
                    get().removeItem(item.productId);
                } else {
                    get().addItem(item);
                }
            },

            clearWishlist: () => {
                set({ items: [] });
            },

            isInWishlist: (productId) => {
                return get().items.some((i) => i.productId === productId);
            },

            getItemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: "aiel-wishlist",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
