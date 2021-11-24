/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import studentModal from "../models/student.js";

const secret = "test";

export const signin = async (req, res) => {
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

    const token = jwt.sign(
      { email: oldstudent.email, id: oldstudent._id },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).json({ result: oldstudent, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
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
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1d",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
