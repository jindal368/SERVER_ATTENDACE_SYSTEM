/** @format */

import express from "express";
const router = express.Router();

import {
  addCollege,
  addInitialAdmin,
  getCollegeData,
  fetchAllCollege,
} from "../controllers/collegeData.js";
import auth from "../middleware/auth.js";

router.post("/addcollege", addCollege);
router.post("/addinitialadmin", addInitialAdmin);
router.get("/getdata", getCollegeData);
router.get("/fetchcollege", fetchAllCollege);

export default router;
