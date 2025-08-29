import mongoose from 'mongoose';

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  about:{type:String},
  startdate: { type: Date, default: Date.now },
  starttime: { type: String }, 
  enddate:{type:String},
  endtime:{type:String},
  isRegisterType: { type: Boolean, default: false },
  cost: { type: Number, default: null },
  EventBanner: { type: String},
  imageUrl:[{type:String}],
  location: { type: String },
  organizerName: { type: String },
  contactEmail: { type: String },
  about:{type:String},
  createDate:{type:Date,default:Date.now}
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
