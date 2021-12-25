/** @format */
// API to deactivate listing by making filed deactivate in schemaa...
import HttpStatus from "http-status-codes";
import AttendanceModal from "../models/attendance.js";
import studentModal from "../models/student.js";
import { isAdminById } from "./faculty.js";
import { distanceBW } from "../util/distanceBW.js";
import globalConstants from "../utils/globalConstants.js";
import logger from "../utils/logger.js";
export const postAttendanceData = async (req, res) => {
  try {
    if (req.tokenPayload.reason === globalConstants.LOGIN) {
      const { id, latitude, longitude } = req.query;
      const { facultyEmail, subject, year, semester, section, course } =
        req.body;
      const data = {
        facultyEmail,
        subject,
        year,
        semester,
        section,
        course,
        collegeId: id,
        latitude: latitude,
        longitude: longitude,
      };

      const attendanceSchema = await AttendanceModal.create(data);
      res.status(200).json({ message: "Schema Added", attendanceSchema });
      logger.debug("added attendence schema");
    } else {
      logger.error("Wrong token");
      res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    logger.debug(error);
  }
};
export const updateStudent = async (req, res) => {
  try {
    if (req.tokenPayload.reason === globalConstants.LOGIN) {
      const { _id, email } = req.query;
      if (await verfiyStudent(_id, email)) {
        const studentData = await studentModal.findOne({ email });
        const paramsForStudent = await AttendanceModal.findById(_id);
        // check for expiry of listing

        if (paramsForStudent.expire)
          res.status(400).json({
            message: "Subject listing is expired",
          });
        const distance =
          distanceBW(
            studentData.currentLatitude,
            paramsForStudent.latitude,
            studentData.currentLongitude,
            paramsForStudent.longitude
          ) * 1000;
        // check location
        if (distance > 10) {
          res.status(400).json({
            message:
              "Student is out of class network , so attendance cannot be mark",
            distance,
          });
        }
        const updatedStudentData = {
          email: studentData.email,
          name: studentData.name,
          course: studentData.course,
          year: studentData.year,
          semester: studentData.semester,
          section: studentData.section,
          rollNo: studentData.rollNo,
          mobile: studentData.mobile,
          fathersMobile: studentData.fathersMobile,
        };
        const updatedSchema = await AttendanceModal.updateOne(
          { _id: req.query._id },
          { $addToSet: { students: updatedStudentData } }
        );

        const updatedParamsForStudent = {
          facultyEmail: paramsForStudent.facultyEmail,
          subject: paramsForStudent.subject,
          year: paramsForStudent.year,
          semester: paramsForStudent.semester,
          section: paramsForStudent.section,
          course: paramsForStudent.course,
          date: paramsForStudent.date,
        };
        const updatedStudent = await studentModal.updateOne(
          { email: email },
          { $addToSet: { attendance: updatedParamsForStudent } }
        );
        res.status(200).json({
          message: "Student Added Successfully",
          updatedSchema,
          updatedStudent,
          distance,
        });
        console.log("Added Student", updatedSchema);
      } else {
        res.status(400).json({
          message:
            "Student doesn't belong to given class i.e, corrupted attendance try",
        });
      }
    } else {
      logger.error("Wrong token");
      res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
    }
  } catch (err) {
    res.json(err);
    logger.error("Error : ", err);
  }
};
export const getStudentDataToFacultyParticularSubject = async (req, res) => {
  const { id } = req.query;
  try {
    if (req.tokenPayload.reason === globalConstants.LOGIN) {
      const attendanceSchema = await AttendanceModal.findById(id);
      if (!attendanceSchema) res.status(400).json({ message: "No Data Found" });
      res.status(200).json({ attendanceSchema });
    } else {
      logger.error("Wrong token");
      res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
    }
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllTheirAttendanceFaculty = async (req, res) => {
  const { email } = req.query;
  try {
    if (req.tokenPayload.reason === globalConstants.LOGIN) {
      const attendanceSchema = await AttendanceModal.find({
        facultyEmail: email,
      });
      if (!attendanceSchema) res.status(400).json({ message: "No Data Found" });
      res.status(200).json({ attendanceSchema });
    } else {
      logger.error("Wrong token");
      res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
    }
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getAttendanceDetailToAdmin = async (req, res) => {
  const { subject, year, semester, section, course } = req.query;
  try {
    if (req.tokenPayload.reason === globalConstants.LOGIN) {
      if (await isAdminById(req.userId)) {
        const attendanceSchema = await AttendanceModal.find({
          subject,
          year,
          semester,
          section,
          course,
        });
        if (!attendanceSchema)
          res.status(400).json({ message: "No Data Found" });
        res.status(200).json({ attendanceSchema });
      } else {
        res
          .status(400)
          .json({ message: "User doesn't have privillages to access" });
      }
    } else {
      logger.error("Wrong token");
      res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
    }
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const verfiyStudent = async (id, email) => {
  try {
    const attendanceSchema = await AttendanceModal.findById(id);
    const studentData = await studentModal.findOne({ email });
    logger.debug("StudentData : ", studentData);
    logger.debug("Attendance schema : ", attendanceSchema);
    if (!studentData || !attendanceSchema) return false;
    if (
      studentData.semester === attendanceSchema.semester &&
      studentData.section === attendanceSchema.section &&
      studentData.collegeId === attendanceSchema.collegeId
    )
      return true;
    else return false;
  } catch (error) {
    return false;
  }
};

export const expireRetriveSubjectListing = async (req, res) => {
  const { id } = req.query;
  try {
    if (req.tokenPayload.reason === globalConstants.LOGIN) {
      const attendanceSchema = await AttendanceModal.findById(id);
      if (!attendanceSchema) res.status(400).json({ message: "No Data Found" });
      const updatedSchema = await AttendanceModal.updateOne(
        { _id: id },
        { $set: { expire: !attendanceSchema.expire } }
      );
      res.status(200).json({
        message: !attendanceSchema.expire
          ? "expired Successfully"
          : "retreve Successfully",
      });
    } else {
      logger.error("Wrong token");
      res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
    }
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
