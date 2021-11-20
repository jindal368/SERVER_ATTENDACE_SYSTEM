import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  course:{type: String,required: true},
  year:{type: Number, required:true,length:1, min:1},
  semester:{type: Number,required:true, min:1},
  section:{type: String,required:true},
  name: { type: String, required:  true },
  rollNo:{type: Number, required:true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile:{type:Number,required:true},
  fathersMobile:{type:Number},
  attendance:[studentAttendance]
});

const studentAttendance = mongoose.Schema({
  semester:{type: Number,required:true},
  dateTime:{type: Date, required:true},
  subject:{type: String,required:true}
});



export default mongoose.model("Student", studentSchema);