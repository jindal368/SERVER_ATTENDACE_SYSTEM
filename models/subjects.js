/** @format */

import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
  course: { type: String, required: true },
  year: { type: Number, required: true, min: 1 },
  sem: { type: Number, required: true, min: 1 },
  stream: { type: String, required: true },
  subjects: [String],
});

export default mongoose.model("Subject", subjectSchema);
