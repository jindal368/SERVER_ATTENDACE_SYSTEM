/** @format */

import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import verifyToken from "../middleware/verifyToken.js";
import {
  signin,
  signup,
  deleteFaculty,
  makeAdmin,
  verifyEmail,
  forgotPasswordSendLink,
  forgotPasswordChangePassword,
} from "../controllers/faculty.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.put("/removefaculty", auth, deleteFaculty);
router.put("/makeAdmin", auth, makeAdmin);
router.put("/verifyAccount", verifyToken, verifyEmail);
router.get("/forgotPassword/sendMail", forgotPasswordSendLink);
router.put("/forgotPassword/changePassword",verifyToken, forgotPasswordChangePassword);

export default router;
