"use client";

import { useRouter } from "next/navigation";
import { Package, Calendar, MapPin, CheckCircle2, Truck, Box, Home, ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/Navbar";

export default function OrdersClient({ initialOrders, userName }) {
  const router = useRouter();

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { step: 0, text: "Order Placed", color: "text-yellow-600", bg: "bg-yellow-100" },
      confirmed: { step: 1, text: "Confirmed", color: "text-blue-600", bg: "bg-blue-100" },
      processing: { step: 2, text: "Processing", color: "text-purple-600", bg: "bg-purple-100" },
      shipped: { step: 3, text: "Shipped", color: "text-indigo-600", bg: "bg-indigo-100" },
      delivered: { step: 4, text: "Delivered", color: "text-green-600", bg: "bg-green-100" },
      cancelled: { step: -1, text: "Cancelled", color: "text-red-700", bg: "bg-red-200" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getProgressPercentage = (status) => {
    const statusInfo = getStatusInfo(status);
    if (statusInfo.step === -1) return 0;
    return (statusInfo.step / 4) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartItemCount={0} onCartClick={() => { }} onUserClick={() => { }} loggedInUserName={userName} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">{initialOrders.length} {initialOrders.length === 1 ? 'order' : 'orders'}</p>
        </div>

        {initialOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
            <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {initialOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const progress = getProgressPercentage(order.status);

              return (
                <div key={order.id} className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Order ID</p>
                          <p className="font-mono text-sm font-semibold text-gray-900">#{order.id.slice(-8)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Order Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Total</p>
                          <p className="text-lg font-bold text-gray-900">₹{order.total?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.text}
                      </div>
                    </div>

                    {order.status !== "cancelled" && (
                      <div className="mb-6">
                        <div className="relative">
                          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                          </div>

                          <div className="relative flex justify-between">
                            {[
                              { step: 0, icon: CheckCircle2, label: "Placed" },
                              { step: 1, icon: Package, label: "Confirmed" },
                              { step: 2, icon: Box, label: "Processing" },
                              { step: 3, icon: Truck, label: "Shipped" },
                              { step: 4, icon: Home, label: "Delivered" },
                            ].map(({ step, icon: Icon, label }) => (
                              <div key={step} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${statusInfo.step >= step ? 'bg-blue-600' : 'bg-gray-200'
                                  }`}>
                                  <Icon className={`w-5 h-5 ${statusInfo.step >= step ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                                <p className="text-xs font-medium text-gray-900 text-center">{label}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.estimatedDelivery && order.status !== "delivered" && (
                          <div className="mt-6 flex items-center gap-2 text-sm bg-blue-50 px-4 py-3 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-900">
                              <span className="font-semibold">Estimated Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                          </div>
                        )}

                        {order.trackingNumber && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                            <Package className="w-4 h-4" />
                            <span>Tracking: <span className="font-mono font-semibold text-gray-900">{order.trackingNumber}</span></span>
                          </div>
                        )}
                      </div>
                    )}

                    {order.shippingAddress && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">Delivery Address</p>
                            <p className="text-gray-700">{order.shippingAddress.fullName}</p>
                            <p className="text-gray-600">{order.shippingAddress.phone}</p>
                            <p className="text-gray-600">
                              {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                            </p>
                            <p className="text-gray-600">
                              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {order.items?.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <div className="flex gap-6">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{item.category}</p>

                          <div className="flex items-center gap-6 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Quantity</p>
                              <p className="text-sm font-semibold text-gray-900">{item.quantity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Price</p>
                              <p className="text-sm font-semibold text-gray-900">₹{item.price?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Total</p>
                              <p className="text-lg font-bold text-gray-900">₹{((item.price || 0) * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button onClick={() => router.push(`/product/${item.productId}`)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                              Buy Again
                            </button>
                            <button onClick={() => router.push(`/product/${item.productId}`)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                              View Product
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


