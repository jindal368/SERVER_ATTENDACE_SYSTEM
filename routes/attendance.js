/** @format */

import express from "express";
const router = express.Router();

import {
  postAttendanceData,
  getAllTheirAttendanceFaculty,
  getStudentDataToFacultyParticularSubject,
  getAttendanceDetailToAdmin,
  updateStudent,
} from "../controllers/attendance.js";
import auth from "../middleware/auth.js";

router.post("/postattendancedata", auth, postAttendanceData);
router.get(
  "/getattendancebyid",
  auth,
  getStudentDataToFacultyParticularSubject
);
router.get("/getdetailtoadmin", auth, getAttendanceDetailToAdmin);
router.get("/fetchalllistbyfaculty", auth, getAllTheirAttendanceFaculty);
router.patch("/updatestudent", auth, updateStudent);

export default router;
