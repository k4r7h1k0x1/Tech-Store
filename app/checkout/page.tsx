"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  MapPin,
  CreditCard,
  Truck,
  Plus,
  Check,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showUPIScanner, setShowUPIScanner] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);

    if (!user) {
      router.push("/");
      return;
    }

    fetch("/api/address")
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data.addresses || []);
        const defaultAddr = data.addresses?.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
      });
  }, [user, router]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    });
    const data = await res.json();
    if (data.success) {
      setAddresses(data.addresses);
      setSelectedAddress(data.addresses[data.addresses.length - 1]);
      setShowAddAddress(false);
      setNewAddress({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }
    if (paymentMethod === "upi") {
      setShowUPIScanner(true);
      return;
    }

    if (paymentMethod === "card") {
      setShowCardForm(true);
      return;
    }
    await processOrder();
  };

  const processOrder = async () => {
    setProcessing(true);

    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: selectedAddress,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("cart");
        setOrderId(data.order.id);
        setShowSuccessModal(true);
      } else {
        alert(data.error || "Order failed. Please try again.");
      }
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleUPIPayment = async () => {
    if (!upiId) {
      alert("Please enter your UPI ID");
      return;
    }
    setShowUPIScanner(false);
    await processOrder();
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    if (cardDetails.cardNumber.length < 16) {
      alert("Please enter a valid card number");
      return;
    }
    if (!cardDetails.expiryDate || !cardDetails.cvv) {
      alert("Please fill all card details");
      return;
    }
    setShowCardForm(false);
    await processOrder();
  };

  if (!user) return null;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">Back to Shopping</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Shipping Address
                </h2>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="text-blue-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                )}
              </div>

              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddress.fullName}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          fullName: e.target.value,
                        })
                      }
                      required
                      className="px-4 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      required
                      className="px-4 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={newAddress.addressLine1}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        addressLine1: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    value={newAddress.addressLine2}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        addressLine2: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg text-sm"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      required
                      className="px-4 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      required
                      className="px-4 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={newAddress.zipCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          zipCode: e.target.value,
                        })
                      }
                      required
                      className="px-4 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Save Address
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddAddress(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition ${selectedAddress?._id === addr._id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {addr.fullName}
                        </p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.addressLine1}, {addr.addressLine2}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.state} - {addr.zipCode}
                        </p>
                      </div>
                      {selectedAddress?._id === addr._id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && !showAddAddress && (
                  <p className="text-gray-500 text-center py-8">
                    No saved addresses. Add one to continue.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { id: "cod", label: "Cash on Delivery", icon: "💵" },
                  { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  { id: "upi", label: "UPI", icon: "📱" },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-3 transition ${paymentMethod === method.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium text-gray-900">
                      {method.label}
                    </span>
                    {paymentMethod === method.id && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={processing || !selectedAddress}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12"
              >
                {processing ? "Processing..." : "Place Order"}
              </Button>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Estimated delivery in 4 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. You will receive a
              confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-mono font-bold text-gray-900">
                {orderId.slice(-8)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/orders")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                View Orders
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}

      {showUPIScanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">UPI Payment</h2>
              <button
                onClick={() => setShowUPIScanner(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="bg-white border-4 border-gray-200 rounded-2xl p-4 inline-block mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=TechStore&am=${total.toFixed(2)}`}
                  alt="UPI QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with any UPI app
              </p>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ₹{total.toFixed(2)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center text-gray-500 text-sm">OR</div>
              <input
                type="text"
                placeholder="Enter your UPI ID (e.g., name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleUPIPayment}
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {processing ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCardForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Card Payment</h2>
              <button
                onClick={() => setShowCardForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCardPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16);
                    setCardDetails({ ...cardDetails, cardNumber: value });
                  }}
                  maxLength={16}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + "/" + value.slice(2, 4);
                      }
                      setCardDetails({ ...cardDetails, expiryDate: value });
                    }}
                    maxLength={5}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 3);
                      setCardDetails({ ...cardDetails, cvv: value });
                    }}
                    maxLength={3}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Amount to Pay</span>
                  <span className="font-bold text-gray-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                {processing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
