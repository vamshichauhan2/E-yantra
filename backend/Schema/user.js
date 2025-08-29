import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  Fullname: { type: String, trim: true },
  instituteemail: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  year:{type:Number},
  mobile:{type:Number,default:null},
  verified:{type:Boolean,default:false},
  role:{type:String,enum:['secretary','admin','jointSecretary']},
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;