/** @format */

import AttendanceModal from "../models/attendance.js";
import studentModal from "../models/student.js";
import globalConstants from "../utils/globalConstants.js";
import logger from "../utils/logger.js";

export const postAttendanceData = async (req, res) => {
  if(req.tokenPayload.reason===globalConstants.LOGIN){
    const { faculty, subject, year, semester, section, course } = req.body;
    try {
      const data = {
        faculty,
        subject,
        year,
        semester,
        section,
        course,
      };

      const attendanceSchema = await AttendanceModal.create(data);
      res.status(200).json({ message: "Schema Added", attendanceSchema });
      logger.debug("added attendence schema");
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      logger.debug(error);
    }
  }
  else{
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({message:"wrong token"});
  }
};
export const updateStudent = async (req, res) => {
  if(req.tokenPayload.reason===globalConstants.LOGIN){
    try {
      const { _id, email } = req.query;
      if (await verfiyStudent(_id, email)) {
        const studentData = await studentModal.findOne({ email });
        const updatedSchema = await AttendanceModal.updateOne({ _id: req.query._id },{ $addToSet: { students: studentData } });
        const paramsForStudent = await AttendanceModal.findById(_id);
        const updatedStudent = await studentModal.updateOne({ email: email },{ $addToSet: { attendance: paramsForStudent } });
        res.status(200).json({ message: "Student Added Successfully", updatedSchema });
        logger.debug("Added Student", updatedSchema);
      } else {
        res.status(400).json({message:"Student doesn't belong to given class i.e, corrupted attendance try",});
      }
    } catch (err) {
      res.json(err);
      logger.error("Error : ", err);
    }
  }
  else{
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({message:"wrong token"});
  }
};
export const getStudentData = async (req, res) => {
  if(req.tokenPayload.reason===globalConstants.LOGIN){
    const email = req.params.email;
    logger.debug("email on backend : ", email);
    AttendanceModal.find({ email })
      .then((data) => {
        logger.debug("Data is rendering", data);
        res.json({ data });
      })
      .catch((err) => {
        logger.error("Error : ", err);
      });
  }
  else{
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({message:"wrong token"});
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
      studentData.section === attendanceSchema.section
    )
      return true;
    else return false;
  } catch (error) {
    return false;
  }
};
