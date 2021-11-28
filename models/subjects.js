/** @format */

import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
  collegeId: { type: String, required: true },
  course: { type: Number, required: true },
  year: { type: Number, required: true, min: 1 },
  sem: { type: Number, required: true, min: 1 },
  subjects: [String],
});

export default mongoose.model("Subject", subjectSchema);
