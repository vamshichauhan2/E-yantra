import mongoose from "mongoose";
const resourceSchema = new mongoose.Schema({

    title:{type:String,required:true},
    description:{type:String,required:true},
    sharedOn:{type:Date,default:Date.now},
    resourcetype:{type:String,required:true},
    link:{type:String},
    videoUrl:{type:String},
  
});
const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
