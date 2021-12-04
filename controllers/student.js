/** @format */
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import {
  sendVerificationMail,
  sendForgotMail,
  sendPasswordChangedAcknowledement,
} from "../utils/apiUtils.js";
import StudentModal from "../models/student.js";
import HttpStatus from "http-status-codes";
import globalConstants from "../utils/globalConstants.js";

const secret = process.env.TOKEN_SECRET;

export const signin = async (req, res) => {
  logger.debug("Inside student signin api");
  const { latitude, longitude } = req.query;
  const { email, password } = req.body;

  try {
    const oldstudent = await StudentModal.findOne({ email });

    if (!oldstudent) {
      logger.debug("student not exists");
      return res.status(404).json({ message: "student doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      oldstudent.password
    );

    if (!isPasswordCorrect) {
      logger.debug("password not matched");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const updatedSchema = await studentModal.updateOne(
      { email: email },
      { $set: { currentLatitude: latitude, currentLongitude: longitude } }
    );
    const payload = {
      id: oldstudent._id,
      email: oldstudent.email,
      reason: globalConstants.LOGIN,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    logger.debug("student verified, token generated");
    res.status(200).json({ result: updatedSchema, token });
  } catch (err) {
    logger.error(`Error occured ${err.message}`);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  logger.debug("inside signup api");
  const { latitude, longtiude } = req.query;
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
    const oldstudent = await StudentModal.findOne({ email });

    if (oldstudent) {
      logger.debug("Student already exists");
      return res.status(400).json({ message: "student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await StudentModal.create({
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
      currentLatitude: latitude,
      currentLongitude: longtiude,
    });

    const payload = {
      id: result._id,
      email: result.email,
      reason: globalConstants.VERIFY_EMAIL,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1d" });
    logger.debug("token for email verification of student generated");

    const response = await sendVerificationMail(result.email, token);
    logger.debug(`verification mail sent to ${email}.`);

    res.status(201).json({
      result,
      message: `If your email is genuine then you will receive a verification mail. Please go and verify the account to enjoy services.`,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: `Something went wrong. ${error.message}` });
  }
};

export const getStudent = (req, res) => {
  logger.debug("inside get student details api");
  if (req.tokenPayload.reason === globalConstants.LOGIN) {
    verifyStudent(req.tokenPayload.id)
      .then(() => {
        const rollNo = req.params.rollNo;
        return StudentModal.findOne({ rollNo });
      })
      .then((student) => {
        if (student == null) {
          logger.debug("student not exists");
          return Promise.reject("Student does not exists");
        } else {
          logger.debug("Student data fetched successfully");
          res
            .status(HttpStatus.OK)
            .send({ message: "Student data fetched successfully", student });
        }
      })
      .catch((err) => {
        logger.error(err);
        res.status(HttpStatus.BAD_REQUEST).send({ message: err });
      });
  } else {
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
  }
};

export const updateStudent = (req, res) => {};

export const studentAttendance = (req, res) => {
  logger.debug("inside student attendance api");
  if (req.tokenPayload.reason === globalConstants.LOGIN) {
    verifyStudent(req.tokenPayload.id)
      .then(() => {
        const rollNo = req.params.rollNo;
        return StudentModal.findOne({ rollNo });
      })
      .then((student) => {
        if (student == null) {
          logger.debug("student not exists");
          return Promise.reject("Student does not exists");
        } else
          res.status(HttpStatus.OK).send({
            message: "Student attendance fetched successfully",
            attendance: student.attendance,
          });
      })
      .catch((err) => {
        logger.error(err);
        res.status(HttpStatus.BAD_REQUEST).send({ message: err });
      });
  } else {
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
  }
};

const verifyStudent = (id) => {
  return new Promise((resolve, reject) => {
    StudentModal.findById(id)
      .then((res) => {
        if (res != null && res.isVerified) resolve();
        else reject("Student not verified, please verify your account");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const verifyEmail = (req, res) => {
  logger.debug("verifying the user, inside verifyEmail");
  if (req.tokenPayload.reason === globalConstants.VERIFY_EMAIL) {
    StudentModal.findByIdAndUpdate(
      req.tokenPayload.id,
      { $set: { isVerified: true } },
      { new: true }
    )
      .then((resp) => {
        logger.debug(`Account of ${resp.name} is verified`);
        res.status(201).json({ message: `Account verified successfully` });
      })
      .catch((err) => {
        logger.error(err);
        res
          .status(500)
          .json({ message: `Something went wrong. ${err.message}` });
      });
  } else {
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
  }
};

export const forgotPasswordSendLink = (req, res) => {
  logger.debug("initiating a forgot password request for student...");
  const email = req.query.email;
  StudentModal.findOne({ email })
    .then((result) => {
      if (!result) {
        return Promise.reject(new Error("student not exist"));
      } else {
        logger.debug("student found");
        if (!result.isVerified)
          return Promise.reject(new Error("Please verify the account first"));
        const payload = {
          id: result._id,
          email: result.email,
          reason: globalConstants.FORGOT_PASSWORD,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "1d" });
        return sendForgotMail(email, token);
      }
    })
    .then(() => {
      logger.debug(`forgot mail sent to ${email}.`);
      res.status(HttpStatus.OK).json({
        message: `forgot mail sent to ${email}, if this mail id is correct then you will receive the mail shortly.`,
      });
    })
    .catch((err) => {
      logger.debug(err.message);
      res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    });
};

export const forgotPasswordChangePassword = (req, res) => {
  const payload = req.tokenPayload;
  const pass = req.body.password;
  var studentFromDB;
  if (payload.reason === globalConstants.FORGOT_PASSWORD) {
    StudentModal.findById(payload.id)
      .then((student) => {
        if (student == null)
          return Promise.reject(new Error("Student does not exists"));
        else {
          studentFromDB = student;
          return bcrypt.hash(pass, globalConstants.SALT_ROUNDS);
        }
      })
      .then((hashedPass) => {
        return StudentModal.findByIdAndUpdate(
          payload.id,
          { $set: { password: hashedPass } },
          { new: true }
        );
      })
      .then(() => {
        logger.debug("Password of student updated Successfully");
        return sendPasswordChangedAcknowledement(studentFromDB.email);
      })
      .then(() => {
        logger.debug("Passowrd change acknowledement sended to user");
        res
          .status(HttpStatus.OK)
          .json({ message: "Password updated Successfully" });
      })
      .catch((err) => {
        logger.debug(`Error :: ${err.message}`);
        res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
      });
  } else {
    logger.debug(`wrong token`);
    res.status(HttpStatus.BAD_REQUEST).json({ message: "wrong token" });
  }
};
