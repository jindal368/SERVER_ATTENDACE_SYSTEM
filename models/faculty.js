/** @format */

import mongoose from "mongoose";
import globalConstants from "../utils/globalConstants.js";

var validateEmail = function (email) {
  var re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email);
};

var validateName = function (name) {
  return isNaN(parseInt(name, globalConstants.RADIX));
};

const facultySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: [validateName, "Enter a valid Name"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, "Enter a valid email"],
  },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  mobile: { type: Number, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  collegeId: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model("Faculty", facultySchema);
