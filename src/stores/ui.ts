import { create } from "zustand";

interface UIState {
    // Mobile menu
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;

    // Search
    isSearchOpen: boolean;
    searchQuery: string;
    openSearch: () => void;
    closeSearch: () => void;
    setSearchQuery: (query: string) => void;

    // Toast notifications
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;

    // Loading states
    isLoading: boolean;
    setLoading: (loading: boolean) => void;

    // Filter drawer (mobile)
    isFilterOpen: boolean;
    toggleFilter: () => void;
    closeFilter: () => void;
}

export interface Toast {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
    duration?: number;
}

export const useUIStore = create<UIState>((set, get) => ({
    // Mobile menu
    isMobileMenuOpen: false,
    toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),

    // Search
    isSearchOpen: false,
    searchQuery: "",
    openSearch: () => set({ isSearchOpen: true }),
    closeSearch: () => set({ isSearchOpen: false, searchQuery: "" }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    // Toast notifications
    toasts: [],
    addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        set({ toasts: [...get().toasts, { ...toast, id }] });

        // Auto-remove after duration (default 5 seconds)
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                get().removeToast(id);
            }, duration);
        }
    },
    removeToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
    },

    // Loading states
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),

    // Filter drawer
    isFilterOpen: false,
    toggleFilter: () => set({ isFilterOpen: !get().isFilterOpen }),
    closeFilter: () => set({ isFilterOpen: false }),
}));
