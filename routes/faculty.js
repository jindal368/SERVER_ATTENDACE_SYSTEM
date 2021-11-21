/** @format */

import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import {
  signin,
  signup,
  deleteFaculty,
  makeAdmin,
} from "../controllers/faculty.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.put("/removefaculty", auth, deleteFaculty);
router.put("/makeAdmin", auth, makeAdmin);

export default router;
