/** @format */

import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
  collegeId: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true, length: 1, min: 1 },
  semester: { type: Number, required: true, min: 1 },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  facultyEmail: { type: String, required: true },
  date: { type: Date, default: Date.now },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  expire: { type: Boolean, default: false },
  students: { type: Array },
});

export default mongoose.model("Attendance", attendanceSchema);
