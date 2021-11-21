import express from "express";
const router=express.Router();

import {getStudent,updateStudent,studentAttendance} from "../controllers/student.js";

//router.post("/add",addStudent);
router.get("/:rollNo",getStudent);
router.put("/update",updateStudent);
router.get("/attendance/:rollNo",studentAttendance);

export default router;