import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }
});
const Otp = mongoose.model('Otp', otpSchema);
export default Otp
