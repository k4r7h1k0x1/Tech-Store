"use client";

import {
  Zap, Laptop, Smartphone, Search, ShoppingCart, User,
  Headphones, Watch, Camera, Gamepad2, LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface NavbarProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onCategorySelect?: (id: string) => void;
  selectedCategory?: string;
  onSearch?: (q: string) => void;
  onUserClick?: () => void;
  loggedInUserName?: string | null;
}

const navCategories = [
  { id: "all",         label: "All Products", icon: null },
  { id: "smartphones", label: "Smartphones",  icon: Smartphone },
  { id: "laptops",     label: "Laptops",      icon: Laptop },
  { id: "audio",       label: "Audio",        icon: Headphones },
  { id: "wearables",   label: "Wearables",    icon: Watch },
  { id: "cameras",     label: "Cameras",      icon: Camera },
  { id: "gaming",      label: "Gaming",       icon: Gamepad2 },
];

export default function Navbar({
  cartItemCount = 0,
  onCartClick,
  onCategorySelect,
  selectedCategory = "all",
  onSearch,
  onUserClick,
  loggedInUserName = null,
}: NavbarProps) {
  const router  = useRouter();
  const { logout } = useAuth();

  return (
    <header className="w-full border-b bg-white sticky top-0 z-30 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 font-semibold cursor-pointer shrink-0"
        >
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
              <Zap className="h-5 w-5" />
            </div>
          </motion.div>
          <span className="text-lg font-semibold">TechStore</span>
        </div>

        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search products..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full rounded-full bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          {loggedInUserName ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/orders")}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:block"
              >
                Orders
              </button>

              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-3 group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <span className="text-xs font-bold">
                    {loggedInUserName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:inline group-hover:text-slate-900 transition-colors">
                  {loggedInUserName.split(" ")[0]}
                </span>
              </button>

              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5 transition-colors duration-200 group-hover:text-red-600" />
                <span className="hidden sm:inline transition-colors duration-200 group-hover:text-red-600">
                  Logout
                </span>
              </motion.button>
            </div>
          ) : (
            <button onClick={onUserClick} className="relative">
              <User className="h-5 w-5 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors" />
            </button>
          )}

          <button onClick={onCartClick} className="relative">
            <ShoppingCart className="h-5 w-5 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors" />
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
                >
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <nav className="mx-auto max-w-7xl px-6 pb-3">
        <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
          {navCategories.map(({ id, label, icon: Icon }) => (
            <li
              key={id}
              onClick={() => onCategorySelect?.(id)}
              className={`flex cursor-pointer items-center gap-2 transition-colors font-medium ${
                selectedCategory === id
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}