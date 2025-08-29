import mongoose from 'mongoose';

const { Schema } = mongoose;

const projectSchema = new Schema({
 
  name: { type: String, required: true },           // Project name
  description: { type: String, required: true },    // Project description
  startDate: { type: Date, default: Date.now },     // When project started
  endDate: { type: Date },  
                           // Project end date (optional)
  status: {                                         
    type: String, 
    enum: ['planned', 'in-progress', 'completed', 'on-hold'], 
    default: 'planned' 
  },
  
  teamMembers: [{ type: String }],                   // Optional list of team member names or IDs
  budget: { type: Number, default: 0 },              // Budget allocated
  createdAt: { type: Date, default: Date.now },      // Document creation timestamp
  updatedAt: { type: Date, default: Date.now }, 
   projectposterUrl:{type:String},     // Document update timestamp
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
