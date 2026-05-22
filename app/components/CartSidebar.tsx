"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [checkoutError, setCheckoutError] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (!user) {
      setCheckoutError("Please log in to checkout.");
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    router.push("/checkout");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Your Cart ({cartItems.length}{" "}
              {cartItems.length === 1 ? "item" : "items"})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Items list */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-400 text-sm">
                Add some products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="self-start p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
            {/* login warning or checkout error */}
            {checkoutError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-3">
                {checkoutError}
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold text-gray-900">
                Subtotal
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Shipping and taxes calculated at checkout
            </p>

            <Button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold rounded-xl mb-3 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </Button>
            <button
              onClick={onClose}
              className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
