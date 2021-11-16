import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
  subject :{type : String ,required: true},
  email : {type : String , required : true},
  date:{type: Date,  default: Date.now },
  students : {type : Array},
 
});

export default mongoose.model("attendance", attendanceSchema);