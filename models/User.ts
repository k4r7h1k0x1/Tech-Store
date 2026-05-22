import mongoose, { Model } from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city:         { type: String, required: true },
  state:        { type: String, required: true },
  zipCode:      { type: String, required: true },
  country:      { type: String, default: "India" },
  isDefault:    { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    phone:     String,
    role:      { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema],
    wishlist:  [{ type: Number }],
    avatar:    String,
  },
  { timestamps: true }
);

const User = (mongoose.models.User || mongoose.model("User", userSchema)) as Model<any>;
export default User;