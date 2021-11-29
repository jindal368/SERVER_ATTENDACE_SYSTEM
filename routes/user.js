import express from "express";
const router = express.Router();

import { signin, signup, verifyEmail } from "../controllers/user.js";
import verifyEmailToken from "../middleware/verifyEmailToken.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.put("/verifyAccount",verifyEmailToken ,verifyEmail);

export default router;