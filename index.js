/** @format */

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import attendanceRouter from "./routes/attendance.js";
import facultyRouter from "./routes/faculty.js";

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRouter);
app.use("/faculty", facultyRouter);
app.use("/attendance", attendanceRouter);

const CONNECTION_URL = process.env.MONGO_URI;
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
