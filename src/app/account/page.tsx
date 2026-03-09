"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Mail,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Star,
  Phone,
  Home,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button, Card, Skeleton } from "@/components/ui";
import { useAuth } from "@/components/providers";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Order, Address } from "@/types/database";

// ─── Google Logo ─────────────────────────────────────────────────────────────
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ─── Address form initial state ───────────────────────────────────────────────
const EMPTY_FORM = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  type: "shipping" as "shipping" | "billing",
  is_default: false,
};

type AddressForm = typeof EMPTY_FORM;

// ─── Build Google Maps embed URL from address ────────────────────────────────
function mapEmbedUrl(address: Address) {
  const q = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=15`;
}

// ─── Address Modal ────────────────────────────────────────────────────────────
interface AddressModalProps {
  isOpen: boolean;
  editAddress: Address | null;
  onClose: () => void;
  onSave: (form: AddressForm) => Promise<void>;
  isSaving: boolean;
}

function AddressModal({ isOpen, editAddress, onClose, onSave, isSaving }: AddressModalProps) {
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);

  useEffect(() => {
    if (editAddress) {
      setForm({
        full_name: editAddress.full_name,
        phone: editAddress.phone,
        address_line1: editAddress.address_line1,
        address_line2: editAddress.address_line2 || "",
        city: editAddress.city,
        state: editAddress.state,
        postal_code: editAddress.postal_code,
        country: editAddress.country,
        type: editAddress.type,
        is_default: editAddress.is_default,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editAddress, isOpen]);

  if (!isOpen) return null;

  const set = (field: keyof AddressForm, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors text-text-primary placeholder:text-text-muted text-sm";

  const labelCls = "block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-500" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">
              {editAddress ? "Edit Address" : "Add New Address"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSave(form); }}
          className="px-6 py-5 space-y-4"
        >
          {/* Address type */}
          <div>
            <p className={labelCls}>Address Type</p>
            <div className="flex gap-3">
              {(["shipping", "billing"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("type", t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.type === t
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-text-secondary hover:border-gray-300"
                  }`}
                >
                  {t === "shipping" ? <Home className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Full name + phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Address line 1 */}
          <div>
            <label className={labelCls}>Address Line 1 *</label>
            <input
              type="text"
              required
              value={form.address_line1}
              onChange={(e) => set("address_line1", e.target.value)}
              placeholder="House/Flat no., Street name"
              className={inputCls}
            />
          </div>

          {/* Address line 2 */}
          <div>
            <label className={labelCls}>Address Line 2 (optional)</label>
            <input
              type="text"
              value={form.address_line2}
              onChange={(e) => set("address_line2", e.target.value)}
              placeholder="Landmark, area, etc."
              className={inputCls}
            />
          </div>

          {/* City, State, Pincode */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Mumbai"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>State *</label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="Maharashtra"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>PIN Code *</label>
              <input
                type="text"
                required
                pattern="\d{6}"
                maxLength={6}
                value={form.postal_code}
                onChange={(e) => set("postal_code", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="400001"
                className={inputCls}
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className={labelCls}>Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              placeholder="India"
              className={inputCls}
            />
          </div>

          {/* Set as default */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                form.is_default
                  ? "bg-primary-500 border-primary-500"
                  : "border-gray-300 group-hover:border-primary-400"
              }`}
              onClick={() => set("is_default", !form.is_default)}
            >
              {form.is_default && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
            </div>
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              Set as default address
            </span>
          </label>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              {editAddress ? "Save Changes" : "Add Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────
interface AddressCardProps {
  address: Address;
  onEdit: (a: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

function AddressCard({ address, onEdit, onDelete, onSetDefault, isDeleting, isSettingDefault }: AddressCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const fullAddress = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="overflow-hidden group transition-shadow hover:shadow-medium">
      {/* Map preview */}
      {showMap && (
        <div className="w-full h-44 bg-gray-100 relative">
          <iframe
            src={mapEmbedUrl(address)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map for ${fullAddress}`}
            className="absolute inset-0"
          />
        </div>
      )}

      <div className="p-4">
        {/* Top row: type badge + actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                address.type === "billing"
                  ? "bg-accent-50 text-accent-700"
                  : "bg-primary-50 text-primary-700"
              }`}
            >
              {address.type === "billing" ? (
                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> Billing</span>
              ) : (
                <span className="flex items-center gap-1"><Home className="h-3 w-3" /> Shipping</span>
              )}
            </span>
            {address.is_default && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Default
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Toggle map */}
            <button
              onClick={() => setShowMap((s) => !s)}
              title={showMap ? "Hide map" : "Show on map"}
              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-text-muted hover:text-primary-500"
            >
              <MapPin className="h-4 w-4" />
            </button>
            {/* Edit */}
            <button
              onClick={() => onEdit(address)}
              title="Edit address"
              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-text-muted hover:text-primary-500"
            >
              <Pencil className="h-4 w-4" />
            </button>
            {/* Delete */}
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isDeleting}
              title="Delete address"
              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-error/10 transition-colors text-text-muted hover:text-error"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Address info */}
        <p className="font-semibold text-text-primary text-sm">{address.full_name}</p>
        <p className="text-sm text-text-secondary mt-0.5">{address.address_line1}</p>
        {address.address_line2 && (
          <p className="text-sm text-text-secondary">{address.address_line2}</p>
        )}
        <p className="text-sm text-text-muted">
          {address.city}, {address.state} – {address.postal_code}
        </p>
        <p className="text-sm text-text-muted">{address.country}</p>
        <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
          <Phone className="h-3.5 w-3.5" />
          {address.phone}
        </p>

        {/* Footer actions */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          {/* View on map full link */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:text-primary-700 hover:underline flex items-center gap-1"
          >
            <MapPin className="h-3.5 w-3.5" /> View on Google Maps
          </a>

          {!address.is_default && (
            <button
              onClick={() => onSetDefault(address.id)}
              disabled={isSettingDefault}
              className="ml-auto text-xs text-text-muted hover:text-primary-500 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {isSettingDefault ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Star className="h-3.5 w-3.5" />
              )}
              Set as Default
            </button>
          )}
        </div>

        {/* Delete confirmation */}
        {confirmDelete && (
          <div className="mt-3 p-3 rounded-xl bg-error/5 border border-error/20">
            <p className="text-sm text-error font-medium mb-2">Delete this address?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-text-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(address.id); setConfirmDelete(false); }}
                className="flex-1 text-xs py-1.5 rounded-lg bg-error text-white hover:bg-error/90 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const router = useRouter();
  const { user, profile, isLoading, signInWithGoogle, signInWithEmail, verifyOtp, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Email OTP state
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Address modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Auto-send OTP after 2s of no typing
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.trim()) && !isOtpSent && !isSendingOtp) {
      debounceTimerRef.current = setTimeout(async () => {
        setIsSendingOtp(true);
        setAuthError(null);
        try {
          await signInWithEmail(email.trim());
          setIsOtpSent(true);
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Failed to send OTP. Please try again.");
        } finally {
          setIsSendingOtp(false);
        }
      }, 2000);
    }
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [email, isOtpSent, isSendingOtp, signInWithEmail]);

  // Fetch orders + addresses
  const fetchUserData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    const supabase = getSupabaseClient();
    try {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (ordersData) setOrders(ordersData);

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
  }, [user]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // ── Auth handlers ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try { await signInWithGoogle("/account"); } catch { setIsSigningIn(false); }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try { await signOut(); router.push("/"); } catch { } finally { setIsSigningOut(false); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSendingOtp(true); setAuthError(null);
    try { await signInWithEmail(email.trim()); setIsOtpSent(true); }
    catch (error) { setAuthError(error instanceof Error ? error.message : "Failed to send OTP."); }
    finally { setIsSendingOtp(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) return;
    setIsVerifyingOtp(true); setAuthError(null);
    try { 
        await verifyOtp(email.trim(), otpCode.trim()); 
        // Force reload so auth state properly initializes from cookies
        window.location.reload();
    }
    catch (error) { setAuthError(error instanceof Error ? error.message : "Invalid OTP code."); setIsVerifyingOtp(false); }
  };

  // ── Address handlers ───────────────────────────────────────────────────────
  const openAddModal = () => { setEditAddress(null); setAddressError(null); setModalOpen(true); };
  const openEditModal = (address: Address) => { setEditAddress(address); setAddressError(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditAddress(null); };

  const handleSaveAddress = async (form: typeof EMPTY_FORM) => {
    if (!user) return;
    setIsSavingAddress(true);
    setAddressError(null);
    const supabase = getSupabaseClient();

    try {
      if (form.is_default) {
        // Clear existing defaults of same type
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .eq("type", form.type);
      }

      if (editAddress) {
        const { error } = await supabase
          .from("addresses")
          .update({
            full_name: form.full_name,
            phone: form.phone,
            address_line1: form.address_line1,
            address_line2: form.address_line2 || null,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
            country: form.country,
            type: form.type,
            is_default: form.is_default,
          })
          .eq("id", editAddress.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("addresses").insert({
          user_id: user.id,
          full_name: form.full_name,
          phone: form.phone,
          address_line1: form.address_line1,
          address_line2: form.address_line2 || null,
          city: form.city,
          state: form.state,
          postal_code: form.postal_code,
          country: form.country,
          type: form.type,
          is_default: form.is_default,
        });
        if (error) throw error;
      }

      await fetchUserData();
      closeModal();
    } catch (error) {
      console.error("Error saving address:", error);
      setAddressError(error instanceof Error ? error.message : "Failed to save address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    setDeletingId(id);
    const supabase = getSupabaseClient();
    try {
      await supabase.from("addresses").delete().eq("id", id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    setSettingDefaultId(id);
    const supabase = getSupabaseClient();
    try {
      const target = addresses.find((a) => a.id === id);
      if (!target) return;
      // Clear all defaults of same type
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id).eq("type", target.type);
      // Set new default
      await supabase.from("addresses").update({ is_default: true }).eq("id", id);
      await fetchUserData();
    } catch (error) {
      console.error("Error setting default address:", error);
    } finally {
      setSettingDefaultId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-3xl">A</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-3">Welcome to Aiel Enterprises</h1>
          <p className="text-text-secondary mb-8">
            Sign in to access your account, track orders, and manage your preferences
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{authError}</div>
          )}

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="mb-6">
              <div className="relative mb-4">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors text-text-primary placeholder:text-text-muted"
                  required
                />
              </div>
              <Button type="submit" isLoading={isSendingOtp} size="lg" fullWidth
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                Send OTP Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mb-6">
              <button type="button" onClick={() => { setIsOtpSent(false); setOtpCode(""); setAuthError(null); }}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 mx-auto transition-colors">
                <ArrowLeft className="h-4 w-4" /> Change email
              </button>
              <p className="text-sm text-text-secondary mb-4">
                We sent a 6-digit code to <br /><span className="font-medium text-text-primary">{email}</span>
              </p>
              <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm text-left">
                <p className="font-medium mb-1">✓ OTP request sent successfully!</p>
                <p className="text-xs text-text-secondary">Check your inbox and spam folder.</p>
              </div>
              <div className="mb-4">
                <input type="text" value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full text-center text-2xl tracking-widest py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors text-text-primary placeholder:text-text-muted placeholder:text-base placeholder:tracking-normal"
                  maxLength={6} required />
              </div>
              <Button type="submit" isLoading={isVerifyingOtp} disabled={otpCode.length !== 6} size="lg" fullWidth
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                Verify & Sign In
              </Button>
              <button type="button" onClick={handleSendOtp} disabled={isSendingOtp}
                className="mt-4 text-sm text-primary-500 hover:text-primary-600 transition-colors disabled:opacity-50">
                Resend code
              </button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-primary text-text-muted">or continue with</span>
            </div>
          </div>

          <Button onClick={handleGoogleSignIn} isLoading={isSigningIn} size="lg" variant="outline" fullWidth
            className="relative bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium">
            {!isSigningIn && <GoogleLogo className="h-5 w-5 mr-3" />}
            Continue with Google
          </Button>

          <p className="text-xs text-text-muted mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-text-primary">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-text-primary">Privacy Policy</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Logged-in dashboard ────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Address modal */}
      <AddressModal
        isOpen={modalOpen}
        editAddress={editAddress}
        onClose={closeModal}
        onSave={handleSaveAddress}
        isSaving={isSavingAddress}
      />

      {/* Profile Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center flex-shrink-0">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.full_name || "User"} fill className="object-cover" />
            ) : (
              <User className="h-8 w-8 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-text-primary truncate">{profile?.full_name || "Welcome!"}</h1>
            <p className="text-text-secondary truncate">{profile?.email || user.email}</p>
            {profile?.phone && <p className="text-sm text-text-muted">{profile.phone}</p>}
          </div>
          <Button onClick={handleSignOut} isLoading={isSigningOut} variant="ghost" size="sm" className="text-error hover:bg-error/10">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
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
                <h3 className="font-semibold text-text-primary">Continue Shopping</h3>
                <p className="text-sm text-text-muted">Browse our latest products</p>
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
                <p className="text-sm text-text-muted">View items in your cart</p>
              </div>
              <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-text-primary transition-colors" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Orders</h2>
          {orders.length > 0 && (
            <Link href="/orders" className="text-sm text-primary-500 hover:underline">View All</Link>
          )}
        </div>
        {dataLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">Order #{order.order_number}</p>
                    <p className="text-sm text-text-muted">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">₹{order.total.toLocaleString("en-IN")}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "delivered" ? "bg-success/10 text-success"
                      : order.status === "shipped" ? "bg-info/10 text-info"
                      : order.status === "cancelled" ? "bg-error/10 text-error"
                      : "bg-warning/10 text-warning"
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
            <Link href="/products"><Button variant="outline" size="sm" className="mt-4">Start Shopping</Button></Link>
          </Card>
        )}
      </section>

      {/* Saved Addresses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Saved Addresses</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {addresses.length === 0 ? "No addresses saved yet" : `${addresses.length} address${addresses.length > 1 ? "es" : ""} saved`}
            </p>
          </div>
          <Button
            onClick={openAddModal}
            size="sm"
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>

        {/* Error banner */}
        {addressError && (
          <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm flex items-center justify-between">
            {addressError}
            <button onClick={() => setAddressError(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        {dataLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={openEditModal}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
                isDeleting={deletingId === address.id}
                isSettingDefault={settingDefaultId === address.id}
              />
            ))}
          </div>
        ) : (
          <Card className="p-10 text-center border-2 border-dashed border-gray-200 bg-gray-50/50">
            <div className="h-16 w-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary-400" />
            </div>
            <p className="text-text-secondary font-medium">No saved addresses yet</p>
            <p className="text-sm text-text-muted mt-1 mb-4">Add an address for faster checkout</p>
            <Button onClick={openAddModal} size="sm"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add First Address
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
}
