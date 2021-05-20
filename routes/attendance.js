import express from "express";
const router = express.Router();

import { postAttendanceData , getStudentData , updateStudent } from "../controllers/attendance.js";

router.post("/postattendancedata", postAttendanceData);
router.get("/getstudentdata", getStudentData);
router.patch('/updatestudent',updateStudent)

export default router;