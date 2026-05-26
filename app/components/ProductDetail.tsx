"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/app/components/Navbar";
import CartSidebar from "@/app/components/CartSidebar";
import ProductReviews from "@/app/components/Productreviews";
import { useAuth } from "@/app/context/AuthContext";

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

interface CartItem extends Product {
  quantity: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<"specifications" | "reviews">(
    "specifications",
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const toggleWishlist = async () => {
    if (!profile) {
      alert("Please log in to save items to your wishlist.");
      return;
    }
    if (inWishlist) {
      await fetch(`/api/wishlist?productId=${product?.id}`, {
        method: "DELETE",
      });
      setInWishlist(false);
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id }),
      });
      setInWishlist(true);
    }
  };

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const addToCart = (p: Product) => {
    if (!p.inStock) return;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing)
        return prev.map((i) =>
          i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      return [...prev, { ...p, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  };

  const removeFromCart = (id: string) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          cartItemCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
          loggedInUserName={profile?.name || null}
        />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          cartItemCount={0}
          onCartClick={() => {}}
          loggedInUserName={profile?.name || null}
        />
        <div className="flex flex-col items-center justify-center py-40 text-center px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Product not found
          </h2>
          <p className="text-gray-500 mb-6">
            This product may have been removed or doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  const isInStock = product.inStock !== false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        cartItemCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        loggedInUserName={profile?.name || null}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            {!isInStock && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-red-500 text-white px-8 py-4 rounded-2xl shadow-xl text-center">
                  <p className="text-2xl font-bold mb-1">Out of Stock</p>
                  <p className="text-sm opacity-90">Currently Unavailable</p>
                </div>
              </div>
            )}
            {product.badge && (
              <span
                className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider z-10 ${product.badgeColor}`}
              >
                {product.badge}
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {product.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <span className="text-4xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100,
                    )}
                    % off
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 text-base leading-relaxed mb-5">
                {product.description}
              </p>
            )}

            {product.sellerName && product.sellerName !== "TechStore" && (
              <p className="text-sm text-gray-500 mb-4">
                Sold by{" "}
                <span className="font-semibold text-indigo-600">
                  {product.sellerName}
                </span>
              </p>
            )}

            <div className="flex items-center gap-2 mb-6">
              <div
                className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`}
              />
              <span
                className={`text-sm font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}
              >
                {isInStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              {isInStock ? (
                <div className="flex gap-3">
                  <Button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 text-base font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleWishlist}
                    className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center transition-colors ${
                      inWishlist
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-red-200 hover:bg-red-50"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        inWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 bg-gray-100 text-gray-500 h-14 text-base font-semibold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                    <ShoppingCart className="w-5 h-5" />
                    Currently Unavailable
                  </div>
                  <Button
                    onClick={() =>
                      alert(
                        "We'll notify you when this product is back in stock!",
                      )
                    }
                    className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-12 text-sm font-semibold rounded-xl"
                  >
                    Notify Me When Available
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Truck,
                  title: "Free Shipping",
                  sub: "Orders over ₹1000",
                },
                {
                  icon: Shield,
                  title: "2 Year Warranty",
                  sub: "Full coverage",
                },
                {
                  icon: RotateCcw,
                  title: "30-Day Returns",
                  sub: "No questions asked",
                },
              ].map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  className="text-center p-4 bg-white rounded-xl border border-gray-100"
                >
                  <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900 mb-0.5">
                    {title}
                  </p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {[
              { key: "specifications", label: "Specifications" },
              {
                key: "reviews",
                label: `Reviews (${product.reviews.toLocaleString()})`,
              },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`pb-4 text-base font-semibold transition-colors relative ${
                  activeTab === key
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
                {activeTab === key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "specifications" && (
            <div className="space-y-0">
              {[
                { label: "Product Name", value: product.name },
                { label: "Category", value: product.category },
                { label: "Price", value: `₹${product.price.toLocaleString()}` },
                {
                  label: "Availability",
                  value: product.inStock ? "In Stock" : "Out of Stock",
                },
                ...(product.originalPrice
                  ? [
                      {
                        label: "Original Price",
                        value: `₹${product.originalPrice.toLocaleString()}`,
                      },
                    ]
                  : []),
                ...(product.sellerName
                  ? [{ label: "Sold By", value: product.sellerName }]
                  : []),
                ...(product.description
                  ? [{ label: "Description", value: product.description }]
                  : []),
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`grid grid-cols-3 gap-4 py-4 ${i !== 0 ? "border-t border-gray-100" : ""}`}
                >
                  <span className="text-gray-500 text-sm font-medium">
                    {label}
                  </span>
                  <span className="col-span-2 text-gray-900 text-sm font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "reviews" && <ProductReviews productId={product.id} />}
        </div>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}
