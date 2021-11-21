/** @format */

import AttendanceModal from "../models/attendance.js";
import studentModal from "../models/student.js";

export const postAttendanceData = async (req, res) => {
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
    console.log("added attendence schema");
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
export const updateStudent = async (req, res) => {
  try {
    const { _id, email } = req.query;
    if (await verfiyStudent(_id, email)) {
      const studentData = await studentModal.findOne({ email });
      const updatedSchema = await AttendanceModal.updateOne(
        { _id: req.query._id },
        { $addToSet: { students: studentData } }
      );
      const paramsForStudent = await AttendanceModal.findById(_id);
      const updatedStudent = await studentModal.updateOne(
        { email: email },
        { $addToSet: { attendance: paramsForStudent } }
      );
      res
        .status(200)
        .json({ message: "Student Added Successfully", updatedSchema });
      console.log("Added Student", updatedSchema);
    } else {
      res.status(400).json({
        message:
          "Student doesn't belong to given class i.e, corrupted attendance try",
      });
    }
  } catch (err) {
    res.json(err);
    console.log("Error : ", err);
  }
};
export const getStudentData = async (req, res) => {
  const email = req.params.email;
  console.log("email on backend : ", email);
  AttendanceModal.find({ email })
    .then((data) => {
      console.log("Data is rendering", data);
      res.json({ data });
    })
    .catch((err) => {
      console.log("Error : ", err);
    });
};

const verfiyStudent = async (id, email) => {
  try {
    const attendanceSchema = await AttendanceModal.findById(id);
    const studentData = await studentModal.findOne({ email });
    console.log("StudentData : ", studentData);
    console.log("Attendance schema : ", attendanceSchema);
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
