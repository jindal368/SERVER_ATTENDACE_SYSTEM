/** @format */

import CollegeData from "../models/collegeData.js";
import globalConstants from "../utils/globalConstants.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import facultyModal from "../models/faculty.js";
import collegeData from "../models/collegeData.js";
import logger from "../utils/logger.js";
const secret = "test";
export const addCollege = async (req, res) => {
  try {
    const { name, university, collegeNo, AdminMobile, address } = req.body;
    const collegeSchema = await CollegeData.create({
      name,
      university,
      collegeNo,
      AdminMobile,
      address,
    });
    res
      .status(200)
      .json({ message: "College registered successfully ", collegeSchema });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Something Went wrong" });
  }
};
export const addInitialAdmin = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      email,
      password,
      firstName,
      lastName,
      mobile,
      address,
      department,
    } = req.body;
    const collegeSchema = await CollegeData.findById(id);
    if (!collegeSchema)
      res.status(400).json({
        Message: "No college Found With that Id",
      });
    if (collegeSchema.initialAdmin.length)
      res.status(400).json({ message: "Admin Already Assigned" });

    const oldFaculty = await facultyModal.findOne({ email });

    if (oldFaculty)
      return res.status(400).json({ message: "faculty already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await facultyModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      mobile,
      address,
      department,
      collegeId: id,
      isAdmin: "true",
    });

    // const token = jwt.sign({ email: result.email, id: result._id }, secret, {
    //   expiresIn: "1h",
    // });
    const updatedSchema = await CollegeData.updateOne(
      { _id: id },
      { $addToSet: { initialAdmin: result } }
    );
    // res.status(200).json({
    //   message: "Faculty Registered as initial admin",
    //   token,
    //   updatedSchema,
    // });
    const payload = {
      id: result._id,
      email: result.email,
      reason: globalConstants.VERIFY_EMAIL,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1d" });
    logger.debug("token for email verification of faculty generated");

    const response = await sendVerificationMail(result.email, token);
    logger.debug(`verification mail sent to ${email}.`);

    res.status(201).json({
      result,
      message: `If your email is genuine then you will receive a verification mail. Please go and verify the account to enjoy services.`,
    });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};
export const getCollegeData = async (req, res) => {
  try {
    const { id } = req.query;
    const collegeSchema = await collegeData.findById(id);
    if (!collegeSchema) res.status(400).json({ message: "No College Found" });
    res.status(200).json({ collegeSchema });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500), json({ message: "Something Wrong Happened" });
  }
};
export const fetchAllCollege = async (req, res) => {
  try {
    const collegeSchema = await collegeData.find();
    if (!collegeSchema) res.status(400).json({ message: "No College Found" });
    res.status(200).json({ collegeSchema });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500), json({ message: "Something Wrong Happened" });
  }
};
