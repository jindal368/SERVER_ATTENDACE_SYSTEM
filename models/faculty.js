import mongoose from "mongoose";

const facultySchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isActive:{ type: Boolean, default:true},
  mobile:{type:Number,required:true},
  address:{type: String, required:true},
  department:{type:String, required:true},
  fathersMobile:{type:Number},
  isAdmin:{type : Boolean, default:false}
});



export default mongoose.model("Faculty", facultySchema);