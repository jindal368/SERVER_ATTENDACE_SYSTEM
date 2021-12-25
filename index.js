/** @format */

import express from "express";
import { connect, disconnect } from "./utils/dbUtils.js";
import cors from "cors";
import dotenv from "dotenv";
import StudentRouter from "./routes/student.js";
import attendanceRouter from "./routes/attendance.js";
import subjectRouter from "./routes/subject.js";
import facultyRouter from "./routes/faculty.js";
import collegeRouter from "./routes/college.js";
import logger from "./utils/logger.js";

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/student", StudentRouter);
app.use("/faculty", facultyRouter);
app.use("/attendance", attendanceRouter);
app.use("/college", collegeRouter);
app.use("/subject", subjectRouter);

const PORT = process.env.PORT || 9010;

app.get("/", (req, res) => {
  res.send(`App is up and Running......${PORT}`);
});
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
