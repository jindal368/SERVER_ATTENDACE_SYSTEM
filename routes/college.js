/** @format */

import express from "express";
const router = express.Router();

import {
  addCollege,
  addInitialAdmin,
  getCollegeData,
} from "../controllers/collegeData.js";
import auth from "../middleware/auth.js";

router.post("/addcollege", addCollege);
router.post("/addinitialadmin", addInitialAdmin);
router.get("/getdata", getCollegeData);

export default router;
