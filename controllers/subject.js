import SubjectModal from "../models/subjects.js";
import HttpStatus from "http-status-codes";
import FacultyModal from "../models/faculty.js";
import globalConstants from "../utils/globalConstants.js";

//first time adding subjects
export const createSubjectList = (req, res) => {
  let { course, year, sem, stream, subjects } = req.body;
  course = course.toLowerCase();
  stream = stream.toLowerCase();
  const subjectObj = { course, year, sem, stream, subjects };
  if (req.tokenPayload.reason === globalConstants.LOGIN) {
    isAdminFaculty(req.tokenPayload.id)
      .then(() => {
        return SubjectModal.findOne({ course, year, sem, stream });
      })
      .then((entry) => {
        if (entry == null) return SubjectModal.create(subjectObj);
        else
          return Promise.reject(
            "Subjects for this sem and stream already exists, Please update it."
          );
      })
      .then((createdSubject) => {
        res
          .status(HttpStatus.OK)
          .send({ message: "Subjects added successfully", createdSubject });
      })
      .catch((err) => {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: `error occured:: ${err}` });
      });
  } else {
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
  }
};

//updating existing subjects list
export const addSubject = (req, res) => {
  if (req.tokenPayload.reason === globalConstants.LOGIN) {
    isAdminFaculty(req.tokenPayload.id)
      .then(() => {
        let { course, year, sem, stream, subject } = req.body;
        course = course.toLowerCase();
        stream = stream.toLowerCase();
        return SubjectModal.findOneAndUpdate(
          { course, year, sem, stream },
          { $push: { subjects: subject } },
          { new: true }
        );
      })
      .then((result) => {
        if (result == null)
          return Promise.reject(
            "Subjects for this sem and stream not exists, create it first."
          );
        else
          res
            .status(HttpStatus.OK)
            .send({ message: "Subject added successfully", result });
      })
      .catch((err) => {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: `error occured:: ${err}` });
      });
  } else {
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
  }
};

//deleting a subject from existing list of subjects
export const deleteSubject = (req, res) => {
  if (req.tokenPayload.reason === globalConstants.LOGIN) {
    isAdminFaculty(req.tokenPayload.id)
      .then(() => {
        let { course, year, sem, stream, subject } = req.body;
        course = course.toLowerCase();
        stream = stream.toLowerCase();
        return SubjectModal.findOneAndUpdate(
          { course, year, sem, stream },
          { $pull: { subjects: subject } },
          { new: true }
        );
      })
      .then((result) => {
        if (result == null)
          return Promise.reject(
            "Subjects for this sem and stream not exists, create it first."
          );
        else
          res
            .status(HttpStatus.OK)
            .send({ message: "Subject deleted successfully", result });
      })
      .catch((err) => {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: `error occured:: ${err}` });
      });
  } else {
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({ message: "wrong token" });
  }
};

//get subject list on the basis of course year and sem
export const getSubjects = (req, res) => {
  let { course, year, sem, stream } = req.body;
  course = course.toLowerCase();
  stream = stream.toLowerCase();
  SubjectModal.findOne({ course, year, sem, stream })
    .then((result) => {
      if (result == null) return Promise.reject("Subjects not exists");
      else
        res
          .status(HttpStatus.OK)
          .send({ message: "subject list fetched", result });
    })
    .catch((err) => {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: `error occured:: ${err}` });
    });
};

const isAdminFaculty = (id) => {
  return new Promise((resolve, reject) => {
    FacultyModal.findById(id)
      .then((result) => {
        if (result != null && result.isAdmin) resolve();
        reject("You don't have access to perform this operation");
      })
      .catch((err) => {
        reject(err);
      });
  });
};
