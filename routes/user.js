/** @format */

import express from "express";
const router = express.Router();

import { signin, signup, getAttendanceToStudent } from "../controllers/user.js";
import auth from "../middleware/auth.js";
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/getdatatostudent", auth, getAttendanceToStudent);

export default router;
