/** @format */

import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import {
  signin,
  signup,
  deleteFaculty,
  makeAdmin,
  getFacultyByCollege,
  removeAdmin,
} from "../controllers/faculty.js";

router.get("/getfaculty", getFacultyByCollege);
router.post("/signin", signin);
router.post("/signup", auth, signup);
router.put("/removefaculty", auth, deleteFaculty);
router.put("/makeAdmin", auth, makeAdmin);
router.put("/removeadmin", auth, removeAdmin);

export default router;
