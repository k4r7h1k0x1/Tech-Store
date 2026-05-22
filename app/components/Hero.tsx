"use client";

import { ArrowRight, Zap, Laptop, Smartphone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroProps {
  onCategorySelect?: (id: string) => void;
  onScrollToProducts?: () => void;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

function CategoryCard({ icon: Icon, title, desc, onClick }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="flex flex-col items-center p-5 text-center">
        <Icon className="h-10 w-10 text-blue-600" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function Hero({ onCategorySelect, onScrollToProducts }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600"
        >
          <Zap className="h-4 w-4" />
          New Arrivals Available
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          Premium Tech,{" "}
          <span className="text-blue-600">Exceptional Prices</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-slate-600"
        >
          Discover the latest smartphones, laptops, and gadgets from top brands.
          Free shipping on orders over ₹1000.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={onScrollToProducts}
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onCategorySelect?.("laptops")}
          >
            Browse Laptops
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full max-w-4xl"
        >
          <CategoryCard
            icon={Laptop}
            title="Laptops"
            desc="High performance machines"
            onClick={() => onCategorySelect?.("laptops")}
          />
          <CategoryCard
            icon={Smartphone}
            title="Smartphones"
            desc="Latest flagship devices"
            onClick={() => onCategorySelect?.("smartphones")}
          />
          <CategoryCard
            icon={Star}
            title="Top Rated"
            desc="Customer favorites"
            onClick={() => onScrollToProducts?.()}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3"
        >
          <Stat value="50K+" label="Happy Customers" />
          <Stat value="500+"  label="Products" />
          <Stat value="4.9"   label="Average Rating" />
        </motion.div>

      </div>
    </section>
  );
}