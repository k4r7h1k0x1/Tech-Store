/**
 * SEED SCRIPT — run once to push your 14 products into MongoDB
 *
 * How to run:
 *   npx tsx scripts/seed.ts
 *
 * Install tsx first if needed:
 *   npm install --save-dev tsx
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env.local");
  process.exit(1);
}

/* ── Inline schema so the script is self-contained ── */
const ProductSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    categoryId: String,
    price: Number,
    originalPrice: Number,
    description: { type: String, default: "" },
    image: String,
    badge: { type: String, default: "" },
    badgeColor: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    sellerId: { type: String, default: "" },
    sellerName: { type: String, default: "TechStore" },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

/* ── Your 14 products ── */
const products = [
  {
    name: "iPhone 15 Pro Max",
    category: "SMARTPHONES",
    categoryId: "smartphones",
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 2847,
    image:
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&h=500&fit=crop",
    badge: "BEST SELLER",
    badgeColor: "bg-orange-400 text-white",
    inStock: true,
    description:
      "The most powerful iPhone ever with A17 Pro chip and titanium design.",
  },
  {
    name: 'MacBook Pro 16"',
    category: "LAPTOPS",
    categoryId: "laptops",
    price: 2499,
    rating: 4.9,
    reviews: 1523,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    badge: "NEW",
    badgeColor: "bg-blue-600 text-white",
    inStock: true,
    description:
      "Apple M3 Pro chip, stunning Liquid Retina XDR display, all-day battery life.",
  },
  {
    name: "Sony WH-1000XM5",
    category: "AUDIO",
    categoryId: "audio",
    price: 349,
    originalPrice: 399,
    rating: 4.7,
    reviews: 3421,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop",
    badge: "SALE",
    badgeColor: "bg-red-500 text-white",
    inStock: true,
    description:
      "Industry-leading noise cancelling with Dual Noise Sensor technology.",
  },
  {
    name: "Apple Watch Series 9",
    category: "WEARABLES",
    categoryId: "wearables",
    price: 429,
    rating: 4.6,
    reviews: 2156,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop",
    badge: "",
    badgeColor: "",
    inStock: true,
    description:
      "Smarter, brighter, and more powerful than ever with the new S9 chip.",
  },
  {
    name: "Canon EOS R5",
    category: "CAMERAS",
    categoryId: "cameras",
    price: 3899,
    rating: 4.9,
    reviews: 876,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop",
    badge: "BESTSELLER",
    badgeColor: "bg-white text-black border border-gray-300",
    inStock: true,
    description:
      "45MP full-frame CMOS sensor with up to 8K RAW video recording.",
  },
  {
    name: "PlayStation 5",
    category: "GAMING",
    categoryId: "gaming",
    price: 499,
    rating: 4.8,
    reviews: 5234,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
    badge: "",
    badgeColor: "",
    inStock: false,
    description: "Experience lightning-fast loading with the PS5 custom SSD.",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "SMARTPHONES",
    categoryId: "smartphones",
    price: 1299,
    rating: 4.7,
    reviews: 1892,
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop",
    badge: "",
    badgeColor: "",
    inStock: true,
    description: "200MP camera, built-in S Pen, titanium frame.",
  },
  {
    name: "Dell XPS 15",
    category: "LAPTOPS",
    categoryId: "laptops",
    price: 1899,
    rating: 4.6,
    reviews: 1234,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop",
    badge: "",
    badgeColor: "",
    inStock: true,
    description: "15.6-inch OLED display, Intel Core i9, GeForce RTX 4060.",
  },
  {
    name: "iPhone 17 Pro Max",
    category: "SMARTPHONES",
    categoryId: "smartphones",
    price: 2999,
    rating: 4.9,
    reviews: 1892,
    image:
      "https://images.unsplash.com/photo-1763891378295-5d9bd5c48745?q=80&w=627&auto=format&fit=crop",
    badge: "PREMIUM",
    badgeColor: "bg-black text-white",
    inStock: true,
    description:
      "Next-generation iPhone with A19 chip and advanced camera system.",
  },
  {
    name: "Joy-Stick Pro X",
    category: "GAMING",
    categoryId: "gaming",
    price: 299,
    rating: 4.8,
    reviews: 5234,
    image:
      "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?q=80&w=1470&auto=format&fit=crop",
    badge: "",
    badgeColor: "",
    inStock: true,
    description:
      "Professional gaming controller with haptic feedback and 40-hour battery.",
  },
  {
    name: "Vintage Camera ZX-5",
    category: "CAMERAS",
    categoryId: "cameras",
    price: 2000,
    rating: 4.7,
    reviews: 1400,
    image:
      "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?q=80&w=681&auto=format&fit=crop",
    badge: "",
    badgeColor: "",
    inStock: true,
    description: "Classic film-style camera with modern digital sensor.",
  },
  {
    name: "Sony WH-1200XM8",
    category: "AUDIO",
    categoryId: "audio",
    price: 349,
    originalPrice: 599,
    rating: 4.8,
    reviews: 3421,
    image:
      "https://plus.unsplash.com/premium_photo-1677158265072-5d15db9e23b2?q=80&w=764&auto=format&fit=crop",
    badge: "NEW",
    badgeColor: "bg-red-500 text-white",
    inStock: true,
    description: "Next-gen noise cancellation with 30-hour battery life.",
  },
  {
    name: "Apple Watch Series 10",
    category: "WEARABLES",
    categoryId: "wearables",
    price: 429,
    rating: 4.6,
    reviews: 2156,
    image:
      "https://images.unsplash.com/photo-1656053209629-8bdf3e494f91?q=80&w=1470&auto=format&fit=crop",
    badge: "BEST SALE",
    badgeColor: "bg-blue-600 text-white",
    inStock: true,
    description: "Thinnest Apple Watch ever with health monitoring features.",
  },
  {
    name: "Rolex Series X",
    category: "WEARABLES",
    categoryId: "wearables",
    price: 999,
    rating: 4.9,
    reviews: 2156,
    image:
      "https://images.unsplash.com/photo-1671119720870-df45dcaf81c1?w=500&auto=format&fit=crop",
    badge: "BEST SALE",
    badgeColor: "bg-blue-600 text-white",
    inStock: true,
    description: "Luxury smartwatch with premium stainless steel build.",
  },
];

async function seed() {
  try {
    console.log("🔌  Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅  Connected!");

    // Check if already seeded
    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(
        `⚠️   Products collection already has ${existing} documents.`,
      );
      console.log("     Delete them first if you want to re-seed:");
      console.log("     db.products.deleteMany({})");
      await mongoose.disconnect();
      return;
    }

    console.log("🌱  Seeding 14 products...");
    await Product.insertMany(
      products.map((p) => ({
        ...p,
        sellerId: "",
        sellerName: "TechStore",
      })) as any,
    );
    console.log("✅  14 products inserted successfully!");
  } catch (err) {
    console.error("❌  Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected.");
  }
}

seed();
