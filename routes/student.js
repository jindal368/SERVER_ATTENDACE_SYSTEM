import express from "express";
const router=express.Router();
import auth from "../middleware/auth.js";

import {getStudent,updateStudent,studentAttendance} from "../controllers/student.js";

//router.post("/add",addStudent);
router.get("/:rollNo",auth,getStudent);
router.put("/update",auth,updateStudent);
router.get("/attendance/:rollNo",auth,studentAttendance);

export default router;