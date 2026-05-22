"use client";

import dynamic from "next/dynamic";

const ProductList = dynamic(() => import("@/app/components/ProductList"), {
  loading: () => (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500 font-medium">Loading products...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function Home() {
  return <ProductList />;
}