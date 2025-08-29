import mongoose from "mongoose";

const notificationsSchema=new mongoose.Schema({
    description:{type:String,required:true},
    link:{type:String,},
    postedAt: { type: Date, default: Date.now }

});
const Notifications=mongoose.model('Notifications',notificationsSchema)
export default  Notifications