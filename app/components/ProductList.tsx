"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Star, Smartphone, Headphones,
  Watch, Gamepad2, Laptop, Camera, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CartSidebar from "@/app/components/CartSidebar";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number | null;
  description?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  sellerName?: string;
}
interface CartItem extends Product { quantity: number; }

const categories = [
  { id: "all",         name: "All Products", Icon: null,       color: null },
  { id: "smartphones", name: "Smartphones",  Icon: Smartphone, color: "text-purple-600" },
  { id: "laptops",     name: "Laptops",      Icon: Laptop,     color: "text-cyan-500" },
  { id: "audio",       name: "Audio",        Icon: Headphones, color: "text-gray-400" },
  { id: "wearables",   name: "Wearables",    Icon: Watch,      color: "text-purple-600" },
  { id: "cameras",     name: "Cameras",      Icon: Camera,     color: "text-gray-600" },
  { id: "gaming",      name: "Gaming",       Icon: Gamepad2,   color: "text-purple-600" },
];

const MAX_PRICE = 10000;
const CART_KEY = "cart";

function ColorSlider({
  min, max, value, onChange,
}: {
  min: number; max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const leftPct  = ((value[0] - min) / (max - min)) * 100;
  const rightPct = ((value[1] - min) / (max - min)) * 100;
  return (
    <div className="pt-3 pb-1">
      <div className="relative h-2 rounded-full bg-gray-200">
        <div
          className="absolute h-full rounded-full"
          style={{
            left: `${leftPct}%`,
            width: `${rightPct - leftPct}%`,
            background: "linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6)",
          }}
        />
        <input
          type="range" min={min} max={max} step={100} value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1] - 100), value[1]])}
          className="absolute inset-0 w-full h-full cursor-pointer"
          style={{ appearance:"none", WebkitAppearance:"none", background:"transparent", zIndex: value[0] > max - 200 ? 5 : 3 }}
        />
        <input
          type="range" min={min} max={max} step={100} value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0] + 100)])}
          className="absolute inset-0 w-full h-full cursor-pointer"
          style={{ appearance:"none", WebkitAppearance:"none", background:"transparent", zIndex:4 }}
        />
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:white;border:2.5px solid #6366f1;box-shadow:0 1px 4px rgba(99,102,241,0.3);cursor:pointer;}
        input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:white;border:2.5px solid #6366f1;box-shadow:0 1px 4px rgba(99,102,241,0.3);cursor:pointer;}
      `}</style>
      <div className="flex justify-between mt-3">
        <span className="text-sm font-semibold text-blue-600">₹{value[0].toLocaleString()}</span>
        <span className="text-sm font-semibold text-purple-600">₹{value[1].toLocaleString()}</span>
      </div>
    </div>
  );
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ProductList() {
  const router = useRouter();
  const { profile } = useAuth();
  const productsRef = useRef<HTMLDivElement>(null);

  const [products,           setProducts]           = useState<Product[]>([]);
  const [loading,            setLoading]            = useState(true);
  const [selectedCategory,   setSelectedCategory]   = useState("all");
  const [priceRange,         setPriceRange]         = useState<[number, number]>([0, MAX_PRICE]);
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "inStock">("all");
  const [isCartOpen,         setIsCartOpen]         = useState(false);
  const [isAuthOpen,         setIsAuthOpen]         = useState(false);
  const [searchQuery,        setSearchQuery]        = useState("");

  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCart());
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const scrollToProducts = () =>
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    scrollToProducts();
  };

  const addToCart = (product: Product) => {
    if (!product.inStock) return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing)
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const removeFromCart = (id: string) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const filteredProducts = products.filter((p) => {
    const matchCat    = selectedCategory === "all" || p.categoryId === selectedCategory;
    const matchPrice  = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchAvail  = availabilityFilter === "all" || p.inStock === true;
    const matchSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchPrice && matchAvail && matchSearch;
  });

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        cartItemCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        onSearch={setSearchQuery}
        onUserClick={() => setIsAuthOpen(true)}
        loggedInUserName={profile?.name || null}
      />

      <Hero
        onScrollToProducts={scrollToProducts}
        onCategorySelect={handleCategorySelect}
      />

      <div ref={productsRef} className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex gap-8">
          <aside className="w-60 shrink-0 space-y-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-gray-900">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); scrollToProducts(); }}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors text-left ${
                        active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {cat.Icon && (
                        <cat.Icon className={`h-4 w-4 ${active ? "text-blue-600" : cat.color || "text-gray-400"}`} />
                      )}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Price Range</h3>
              <ColorSlider min={0} max={MAX_PRICE} value={priceRange} onChange={setPriceRange} />
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Availability</h3>
              <div className="space-y-1">
                {[
                  { value: "all",     label: "All Products" },
                  { value: "inStock", label: "In Stock Only" },
                ].map(({ value, label }) => {
                  const active = availabilityFilter === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setAvailabilityFilter(value as "all" | "inStock")}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors text-left ${
                        active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        active ? "border-blue-600" : "border-gray-300"
                      }`}>
                        {active && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                      </span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {filteredProducts.length} Products
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                      {product.badge && (
                        <div className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${product.badgeColor}`}>
                          {product.badge}
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900">Out of Stock</span>
                        </div>
                      )}
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-5">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">{product.category}</p>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} className={`h-4 w-4 ${idx < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                        </div>
                        <div className="mb-4 flex items-baseline gap-2">
                          <span className="text-2xl font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {product.sellerName && product.sellerName !== "TechStore" && (
                          <p className="mb-3 text-xs text-gray-400">
                            Sold by <span className="font-medium text-indigo-600">{product.sellerName}</span>
                          </p>
                        )}
                        <Button
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          disabled={!product.inStock}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-lg text-gray-500">No products found.</p>
                    <button
                      onClick={() => { setPriceRange([0, MAX_PRICE]); setSelectedCategory("all"); setAvailabilityFilter("all"); }}
                      className="mt-4 text-blue-600 font-medium hover:underline text-sm"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSignupSuccess={() => {
          setCartItems([]);
          saveCart([]);
        }}
      />
    </div>
  );
}