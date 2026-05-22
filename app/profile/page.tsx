"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  MapPin, Plus, Edit, Trash2, X, User as UserIcon,
  Package, Tag, CheckCircle2, Loader2, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/app/components/Navbar";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const CATEGORY_OPTIONS = [
  { label: "Smartphones", value: "smartphones", display: "SMARTPHONES" },
  { label: "Laptops",     value: "laptops",     display: "LAPTOPS" },
  { label: "Audio",       value: "audio",       display: "AUDIO" },
  { label: "Wearables",   value: "wearables",   display: "WEARABLES" },
  { label: "Cameras",     value: "cameras",     display: "CAMERAS" },
  { label: "Gaming",      value: "gaming",      display: "GAMING" },
];

const BADGE_COLOR_OPTIONS = [
  { label: "None",   value: "" },
  { label: "Blue",   value: "bg-blue-600 text-white" },
  { label: "Red",    value: "bg-red-500 text-white" },
  { label: "Orange", value: "bg-orange-400 text-white" },
  { label: "Black",  value: "bg-black text-white" },
  { label: "Green",  value: "bg-green-600 text-white" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"addresses" | "sell" | "orders">("addresses");

  /* ── Address state ── */
  const [addresses,      setAddresses]      = useState<Address[]>([]);
  const [showAddForm,    setShowAddForm]    = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addrLoading,    setAddrLoading]    = useState(false);
  const [addrForm,       setAddrForm]       = useState({
    fullName: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", zipCode: "", country: "India", isDefault: false,
  });

  /* ── Sell product state ── */
  const [sellForm, setSellForm] = useState({
    name: "", categoryId: "smartphones", price: "",
    originalPrice: "", description: "", image: "",
    badge: "", badgeColor: "", inStock: true,
  });
  const [sellLoading,   setSellLoading]   = useState(false);
  const [sellError,     setSellError]     = useState("");
  const [sellSuccess,   setSellSuccess]   = useState(false);
  // ✅ NEW: image upload state
  const [imageSource,   setImageSource]   = useState<"url" | "device">("url");
  const [imagePreview,  setImagePreview]  = useState("");

  /* ── Auth guard ── */
  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/"); return; }
    fetchAddresses();
  }, [user, loading, router]);

  const fetchAddresses = async () => {
    try {
      const res  = await fetch("/api/address");
      const data = await res.json();
      if (data.addresses) setAddresses(data.addresses);
    } catch {}
  };

  const handleAddrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrLoading(true);
    const method = editingAddress ? "PUT" : "POST";
    const body   = editingAddress
      ? { addressId: editingAddress._id, ...addrForm }
      : addrForm;
    try {
      const res  = await fetch("/api/address", {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setAddresses(data.addresses); resetAddrForm(); }
    } catch {}
    setAddrLoading(false);
  };

  const handleAddrDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    const res  = await fetch(`/api/address?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) setAddresses(data.addresses);
  };

  const handleAddrEdit = (a: Address) => {
    setEditingAddress(a);
    setAddrForm({
      fullName: a.fullName, phone: a.phone,
      addressLine1: a.addressLine1, addressLine2: a.addressLine2 || "",
      city: a.city, state: a.state, zipCode: a.zipCode,
      country: a.country, isDefault: a.isDefault,
    });
    setShowAddForm(true);
  };

  const resetAddrForm = () => {
    setAddrForm({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", zipCode: "", country: "India", isDefault: false });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSellError("");
    setSellSuccess(false);

    if (!sellForm.image) {
      setSellError("Please provide a product image.");
      return;
    }
    if (imageSource === "url" && !sellForm.image.startsWith("http")) {
      setSellError("Please enter a valid image URL starting with http/https.");
      return;
    }

    setSellLoading(true);
    try {
      const cat = CATEGORY_OPTIONS.find((c) => c.value === sellForm.categoryId);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:          sellForm.name,
          category:      cat?.display || sellForm.categoryId.toUpperCase(),
          categoryId:    sellForm.categoryId,
          price:         Number(sellForm.price),
          originalPrice: sellForm.originalPrice ? Number(sellForm.originalPrice) : undefined,
          description:   sellForm.description,
          image:         sellForm.image,
          badge:         sellForm.badge,
          badgeColor:    sellForm.badgeColor,
          inStock:       sellForm.inStock,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSellSuccess(true);
        setSellForm({ name: "", categoryId: "smartphones", price: "", originalPrice: "", description: "", image: "", badge: "", badgeColor: "", inStock: true });
        setImagePreview("");
        setImageSource("url");
      } else {
        setSellError(data.error || "Failed to list product.");
      }
    } catch {
      setSellError("Something went wrong. Please try again.");
    } finally {
      setSellLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        cartItemCount={0}
        onCartClick={() => {}}
        onUserClick={() => {}}
        loggedInUserName={profile?.name || null}
      />

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Profile header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: "addresses", label: "Addresses",      icon: MapPin },
            { id: "sell",      label: "Sell a Product", icon: Tag },
            { id: "orders",    label: "Orders",         icon: Package },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                activeTab === id
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ══ ADDRESSES ══ */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shipping Addresses</h2>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Add New Address
              </Button>
            </div>

            {showAddForm && (
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-2 border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                  <button onClick={resetAddrForm}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <form onSubmit={handleAddrSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input type="text" value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input type="tel" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <input type="text" placeholder="Address Line 1 *" value={addrForm.addressLine1} onChange={(e) => setAddrForm({ ...addrForm, addressLine1: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Address Line 2 (optional)" value={addrForm.addressLine2} onChange={(e) => setAddrForm({ ...addrForm, addressLine2: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="City *" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="State *" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} required className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="ZIP Code *" value={addrForm.zipCode} onChange={(e) => setAddrForm({ ...addrForm, zipCode: e.target.value })} required className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isDefault" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">Set as default address</label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={addrLoading} className="bg-blue-600 hover:bg-blue-700">
                      {addrLoading ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                    </Button>
                    <Button type="button" onClick={resetAddrForm} variant="outline">Cancel</Button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No saved addresses</p>
                  <p className="text-sm">Add your first shipping address to get started</p>
                </div>
              ) : (
                addresses.map((address) => (
                  <div key={address._id} className={`p-6 rounded-2xl border-2 transition ${address.isDefault ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">{address.fullName}</h3>
                          {address.isDefault && <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">Default</span>}
                        </div>
                        <p className="text-sm text-gray-700">{address.phone}</p>
                        <p className="text-sm text-gray-700">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}</p>
                        <p className="text-sm text-gray-700">{address.city}, {address.state} - {address.zipCode}</p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddrEdit(address)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleAddrDelete(address._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ══ SELL A PRODUCT ══ */}
        {activeTab === "sell" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">List a Product for Sale</h2>
                {/* ✅ Fixed: &apos; instead of ' */}
                <p className="text-sm text-gray-500">Your product appears in the store immediately after submission.</p>
              </div>
            </div>

            {sellSuccess && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-green-50 border border-green-200 p-5">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Product listed successfully!</p>
                  <p className="text-sm text-green-700 mt-0.5">It&apos;s now live in the store.</p>
                  <button onClick={() => router.push("/")} className="mt-2 text-sm text-green-700 underline font-medium">View in store →</button>
                </div>
              </div>
            )}

            {sellError && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">{sellError}</div>
            )}

            <form onSubmit={handleSellSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input type="text" placeholder="e.g. Samsung Galaxy S25" value={sellForm.name} onChange={(e) => setSellForm({ ...sellForm, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select value={sellForm.categoryId} onChange={(e) => setSellForm({ ...sellForm, categoryId: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price (₹) *</label>
                  <input type="number" placeholder="e.g. 1299" value={sellForm.price} onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })} min={1} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (₹) <span className="font-normal text-gray-400">optional</span></label>
                  <input type="number" placeholder="e.g. 1599" value={sellForm.originalPrice} onChange={(e) => setSellForm({ ...sellForm, originalPrice: e.target.value })} min={1} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="font-normal text-gray-400">optional</span></label>
                <textarea placeholder="Describe your product..." value={sellForm.description} onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              {/* ✅ NEW: Image — URL or Device Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image *</label>

                {/* Toggle */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => { setImageSource("url"); setImagePreview(""); setSellForm({ ...sellForm, image: "" }); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${imageSource === "url" ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    🔗 Paste URL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageSource("device"); setImagePreview(""); setSellForm({ ...sellForm, image: "" }); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${imageSource === "device" ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    📁 Upload from Device
                  </button>
                </div>

                {imageSource === "url" ? (
                  <>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={sellForm.image}
                      onChange={(e) => { setSellForm({ ...sellForm, image: e.target.value }); setImagePreview(e.target.value); }}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Use <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Unsplash</a> for free images.
                    </p>
                  </>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                    onClick={() => document.getElementById("deviceImageInput")?.click()}
                  >
                    <input
                      id="deviceImageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        // Check file size (max 2MB for base64 storage)
                        if (file.size > 2 * 1024 * 1024) {
                          setSellError("Image must be under 2MB.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const base64 = ev.target?.result as string;
                          setImagePreview(base64);
                          setSellForm({ ...sellForm, image: base64 });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <p className="text-4xl mb-2">📷</p>
                    <p className="text-sm font-semibold text-gray-700">Click to upload from device</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 500KB. For larger images, use a URL.</p>
                  </div>
                )}

                {/* Preview */}
                {imagePreview && (
                  <div className="mt-3 relative h-40 w-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(""); setSellForm({ ...sellForm, image: "" }); }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Badge Text <span className="font-normal text-gray-400">optional</span></label>
                  <input type="text" placeholder="e.g. NEW, SALE, HOT" value={sellForm.badge} onChange={(e) => setSellForm({ ...sellForm, badge: e.target.value.toUpperCase() })} maxLength={15} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Badge Color</label>
                  <select value={sellForm.badgeColor} onChange={(e) => setSellForm({ ...sellForm, badgeColor: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {BADGE_COLOR_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input type="checkbox" id="inStock" checked={sellForm.inStock} onChange={(e) => setSellForm({ ...sellForm, inStock: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-blue-600 cursor-pointer" />
                <label htmlFor="inStock" className="text-sm font-semibold text-gray-700 cursor-pointer">Product is in stock and ready to ship</label>
              </div>

              <Button type="submit" disabled={sellLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-semibold rounded-xl">
                {sellLoading
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Listing Product...</>
                  : <><ShoppingBag className="w-4 h-4 mr-2" />List Product for Sale</>
                }
              </Button>
            </form>
          </div>
        )}

        {/* ══ ORDERS ══ */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Orders</h2>
            <p className="text-gray-500 mb-6">View your complete order history and tracking.</p>
            <Button onClick={() => router.push("/orders")} className="bg-blue-600 hover:bg-blue-700">View All Orders</Button>
          </div>
        )}
      </div>
    </div>
  );
}