/** @format */
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { sendVerificationMail } from "../utils/apiUtils.js";

import studentModal from "../models/student.js";

const loginsecret = process.env.LOGIN_SECRET;
const emailsecret = process.env.EMAIL_SECRET;

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
      loginsecret,
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

    const token = jwt.sign({ email: result.email, id: result._id }, emailsecret, {
      expiresIn: "1d",
    });

    const response = await sendVerificationMail(result.email, token);
    logger.debug(`verification mail sent to ${email}.`)
    res.status(201).json({ result, message: `verification mail sent to ${email}. Please go and verify the account to enjoy services.` });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: `Something went wrong. ${error.message}` });
  }
};


export const verifyEmail=(req,res)=>{
  logger.debug('verifying the user, inside verifyEmail')
  studentModal.findByIdAndUpdate(req.userId,{$set:{isVerified:true}},{new:true})
  .then((resp)=>{
    logger.debug(`Account of ${resp.name} is verified`);
    res.status(201).json({message: `Account verified successfully` });
  })
  .catch((err)=>{
    logger.error(err);
    res.status(500).json({ message: `Something went wrong. ${err.message}` });
  })
}