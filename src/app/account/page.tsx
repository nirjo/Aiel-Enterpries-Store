"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Button, Card, Skeleton } from "@/components/ui";
import { useAuth } from "@/components/providers";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Order, Address } from "@/types/database";

// Google logo SVG component
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, isLoading, signInWithGoogle, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch user orders and addresses
  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;

      setDataLoading(true);
      const supabase = getSupabaseClient();

      try {
        // Fetch recent orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (ordersData) setOrders(ordersData);

        // Fetch addresses
        const { data: addressesData } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        if (addressesData) setAddresses(addressesData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setDataLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle("/account");
    } catch (error) {
      console.error("Sign in error:", error);
      setIsSigningIn(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Not logged in - show sign in options
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-3xl">A</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-text-primary mb-3">
            Welcome to Aiel Enterprises
          </h1>
          <p className="text-text-secondary mb-8">
            Sign in to access your account, track orders, and manage your
            preferences
          </p>

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            isLoading={isSigningIn}
            size="lg"
            variant="outline"
            fullWidth
            className="relative bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium"
          >
            {!isSigningIn && <GoogleLogo className="h-5 w-5 mr-3" />}
            Continue with Google
          </Button>

          <p className="text-xs text-text-muted mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Logged in - show account dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center flex-shrink-0">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-white" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-text-primary truncate">
              {profile?.full_name || "Welcome!"}
            </h1>
            <p className="text-text-secondary truncate">
              {profile?.email || user.email}
            </p>
            {profile?.phone && (
              <p className="text-sm text-text-muted">{profile.phone}</p>
            )}
          </div>

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            isLoading={isSigningOut}
            variant="ghost"
            size="sm"
            className="text-error hover:bg-error/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/products">
          <Card className="p-4 hover:shadow-medium transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <ShoppingBag className="h-6 w-6 text-primary-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">
                  Continue Shopping
                </h3>
                <p className="text-sm text-text-muted">
                  Browse our latest products
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-text-primary transition-colors" />
            </div>
          </Card>
        </Link>

        <Link href="/cart">
          <Card className="p-4 hover:shadow-medium transition-shadow cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent-50 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                <Package className="h-6 w-6 text-accent-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">Your Cart</h3>
                <p className="text-sm text-text-muted">
                  View items in your cart
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-text-primary transition-colors" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Orders
          </h2>
          {orders.length > 0 && (
            <Link
              href="/orders"
              className="text-sm text-primary-500 hover:underline"
            >
              View All
            </Link>
          )}
        </div>

        {dataLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">
                      Order #{order.order_number}
                    </p>
                    <p className="text-sm text-text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-success/10 text-success"
                          : order.status === "shipped"
                            ? "bg-info/10 text-info"
                            : order.status === "cancelled"
                              ? "bg-error/10 text-error"
                              : "bg-warning/10 text-warning"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No orders yet</p>
            <Link href="/products">
              <Button variant="outline" size="sm" className="mt-4">
                Start Shopping
              </Button>
            </Link>
          </Card>
        )}
      </section>

      {/* Saved Addresses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Saved Addresses
          </h2>
          <Button variant="ghost" size="sm" className="text-primary-500">
            Add New
          </Button>
        </div>

        {dataLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-text-muted mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary">
                      {address.full_name}
                      {address.is_default && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                    </p>
                    <p className="text-sm text-text-muted">
                      {address.city}, {address.state} - {address.postal_code}
                    </p>
                    <p className="text-sm text-text-muted">{address.phone}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <MapPin className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No saved addresses</p>
            <p className="text-sm text-text-muted mt-1">
              Add an address during checkout
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
