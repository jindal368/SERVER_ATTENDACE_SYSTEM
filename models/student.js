/** @format */

import mongoose from "mongoose";
import globalConatants from "../utils/globalConstants.js";

var validateEmail = function (email) {
  var re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email);
};

var validateName = function (name) {
  return isNaN(parseInt(name, globalConatants.RADIX));
};

const studentAttendance = mongoose.Schema({
  semester: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  subject: { type: String, required: true },
});

const studentSchema = mongoose.Schema({
  collegeId: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true, length: 1, min: 1 },
  semester: { type: Number, required: true, min: 1 },
  section: { type: String, required: true },
  name: {
    type: String,
    required: true,
    validate: [validateName, "Enter a valid Name"],
  },
  rollNo: { type: Number, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Enter a valid email"],
  },
  password: { type: String, required: true },
  mobile: { type: Number, required: true },
  fathersMobile: { type: Number },
  attendance: { type: Array },
  currentLatitude: { type: Number, required: true },
  currentLongitude: { type: Number, required: true },
  isVerified: { type: Boolean, required: true, default: false },
});

export default mongoose.model("Student", studentSchema);
