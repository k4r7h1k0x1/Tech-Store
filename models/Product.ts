import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  description?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  sellerId?: string;
  sellerName?: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:          { type: String, required: true, trim: true },
    category:      { type: String, required: true },
    categoryId:    { type: String, required: true },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    description:   { type: String, default: "" },
    image:         { type: String, required: true },
    badge:         { type: String, default: "" },
    badgeColor:    { type: String, default: "" },
    inStock:       { type: Boolean, default: true },
    rating:        { type: Number, default: 0 },
    reviews:       { type: Number, default: 0 },
    sellerId:      { type: String, default: "" },
    sellerName:    { type: String, default: "TechStore" },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;