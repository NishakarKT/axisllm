import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    token: { type: String, default: "", required: true },
    email: { type: String, default: "", required: true },
    hashedOtp: { type: String, default: "", required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    role: { type: String, default: "" },
    roleId: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Otp = new mongoose.model("otp", otpSchema);
export const User = new mongoose.model("user", userSchema);