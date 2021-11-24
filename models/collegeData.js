/** @format */

import mongoose from "mongoose";

const collegeSchema = mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  collegeNo: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  AdminMobile: { type: Number, required: true },
  address: { type: String, required: true },
  initialAdmin: { type: Array, required: true },
});

export default mongoose.model("College", collegeSchema);
