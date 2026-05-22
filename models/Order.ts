import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrderItem {
  productId: string; 
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  shippingAddress: IShippingAddress;
  trackingNumber: string;
  estimatedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true }, 
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true },
  image:     { type: String, default: "" },
  category:  { type: String, default: "" },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, default: "" },
  city:         { type: String, required: true },
  state:        { type: String, required: true },
  zipCode:      { type: String, required: true },
  country:      { type: String, default: "India" },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: "User", required: true },
    items:            { type: [OrderItemSchema], required: true },
    subtotal:         { type: Number, required: true },
    tax:              { type: Number, required: true },
    shippingCost:     { type: Number, required: true },
    total:            { type: Number, required: true },
    status:           { type: String, enum: ["pending","confirmed","processing","shipped","delivered","cancelled"], default: "confirmed" },
    paymentMethod:    { type: String, default: "cod" },
    paymentStatus:    { type: String, enum: ["pending","paid","failed"], default: "pending" },
    shippingAddress:  { type: ShippingAddressSchema, required: true },
    trackingNumber:   { type: String, default: "" },
    estimatedDelivery:{ type: Date },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;