/** @format */

import express from "express";
const router = express.Router();

import {
  postAttendanceData,
  getStudentData,
  updateStudent,
} from "../controllers/attendance.js";
import auth from "../middleware/auth.js";

router.post("/postattendancedata", auth, postAttendanceData);
router.get("/getstudentdata/:email", auth, getStudentData);
router.patch("/updatestudent", auth, updateStudent);

export default router;
