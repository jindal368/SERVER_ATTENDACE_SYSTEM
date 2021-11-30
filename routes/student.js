import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import { signin, signup, verifyEmail, getStudent, updateStudent, studentAttendance, forgotPasswordChangePassword, forgotPasswordSendLink } from "../controllers/student.js";
import verifyToken from "../middleware/verifyToken.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.put("/verifyAccount",verifyToken ,verifyEmail);
router.get("/:rollNo",auth,getStudent);
router.put("/update",auth,updateStudent);
router.get("/attendance/:rollNo",auth,studentAttendance);
router.put("/forgotPassword/sendLink",forgotPasswordSendLink);
router.put("/forgotPassword/changePassword",verifyToken,forgotPasswordChangePassword);

export default router;