/** @format */

import express from "express";
const router = express.Router();

import {
  postAttendanceData,
  getAllTheirAttendanceFaculty,
  getStudentDataToFacultyParticularSubject,
  getAttendanceDetailToAdmin,
  updateStudent,
  expireRetriveSubjectListing,
  updateTempTime,
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
router.put("/expiresubject", auth, expireRetriveSubjectListing);
router.put("/updatetemptime", auth, updateTempTime);
export default router;
