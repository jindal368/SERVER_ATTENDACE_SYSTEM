/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import studentModal from "../models/student.js";

const secret = "test";

export const signin = async (req, res) => {
  const { latitude, longitude } = req.query;
  const { email, password } = req.body;

  try {
    const oldstudent = await studentModal.findOne({ email });

    if (!oldstudent)
      return res.status(404).json({ message: "student doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      oldstudent.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const updatedSchema = await studentModal.updateOne(
      { email: email },
      { $set: { currentLatitude: latitude, currentLongitude: longitude } }
    );

    const token = jwt.sign(
      { email: oldstudent.email, id: oldstudent._id },
      secret,
      { expiresIn: "0.1h" }
    );

    res.status(200).json({ token, updatedSchema });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { id, latitude, longitude } = req.query;
  const {
    email,
    password,
    firstName,
    lastName,
    course,
    year,
    semester,
    section,
    rollNo,
    mobile,
    fathersMobile,
  } = req.body;

  try {
    const oldstudent = await studentModal.findOne({ email });

    if (oldstudent)
      return res.status(400).json({ message: "student already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await studentModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      course,
      year,
      semester,
      section,
      rollNo,
      mobile,
      fathersMobile,
      collegeId: id,
      currentLatitude: latitude,
      currentLongitude: longitude,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "0.1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
export const getAttendanceToStudent = async (req, res) => {
  try {
    if (!req.userId)
      res.status(400).json({ message: "user must be logged in to access" });
    const attendanceSchema = await studentModal.findById(req.userId);
    if (!attendanceSchema) res.status(400).json({ message: "No Data Found" });
    const studentAttendanceData = attendanceSchema.attendance;
    res.status(200).json({ studentAttendanceData });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
