import express from "express";
const router=express.Router();
import auth from "../middleware/auth.js";

import { addSubject, createSubjectList, deleteSubject, getSubjects } from "../controllers/subject.js";

router.post("/create",auth,createSubjectList);
router.put("/add",auth,addSubject);
router.put("/delete",auth,deleteSubject);
router.put("/list",getSubjects);

export default router;