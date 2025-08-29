import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
     FullName:{type:String,required:true},
     Gender:{type:String,required:true},
     InstituteEmail:{type:String,required:true},
     role:{type:String,required:true},
     studyyear:{type:Number,required:true},
     mobile:{type:String,required:true},
     bio:{type:String,required:true},
     imageUrl:{type:String,},
     from:{type:Date,default:Date.now()},
     to:{type:Date},
     isActive:{type:Boolean,default:true},
     batch:{type:String,default:true},




});

const Team= mongoose.model("Team", teamSchema);
export default Team
