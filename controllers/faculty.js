/** @format */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import facultyModal from "../models/faculty.js";

const secret = "test";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldFaculty = await facultyModal.findOne({ email });

    if (!oldFaculty)
      return res.status(404).json({ message: "faculty doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      oldFaculty.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!oldFaculty.isActive)
      return res
        .status(404)
        .json({ message: "faculty exist but currently inactive" });
    const token = jwt.sign(
      { email: oldFaculty.email, id: oldFaculty._id },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: oldFaculty, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, mobile, address, department } =
    req.body;

  try {
    const oldFaculty = await facultyModal.findOne({ email });

    if (oldFaculty)
      return res.status(400).json({ message: "faculty already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await facultyModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      mobile,
      address,
      department,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
export const deleteFaculty = async (req, res) => {
  try {
    console.log("Req : ", req.userId);
    if (await isAdminById(req.userId)) {
      const updatedSchema = await facultyModal.updateOne(
        { email: req.query.email },
        { $set: { isActive: false, isAdmin: false } }
      );
      res.status(201).json({ message: "Removed Successfully", updatedSchema });
    } else {
      res.status(400).json({
        message: "Logged in user doesn't have privillages to remove faculty",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

const isAdminById = async (id) => {
  return await facultyModal
    .findById(id)
    .then((res) => res.isAdmin)
    .catch((err) => false);
};

export const makeAdmin = async (req, res) => {
  try {
    const { email } = req.query;

    if (await isAdminById(req.userId)) {
      const faculty = await facultyModal.findOne({ email });
      if (!faculty) res.status(400).json({ message: "Faculty doesn't exists" });
      if (faculty.isAdmin)
        res.status(400).json({ message: "Faculty already an admin" });
      const updatedSchema = await facultyModal.updateOne(
        { email: email },
        { $set: { isAdmin: true } }
      );
      res
        .status(201)
        .json({ message: "added as admin Successfully", updatedSchema });
    } else {
      res.status(400).json({
        message: "Logged in user doesn't have privillages to make admin",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.query;

    if (await isAdminById(req.userId)) {
      const faculty = await facultyModal.findOne({ email });
      if (!faculty) res.status(400).json({ message: "Faculty doesn't exists" });
      if (!faculty.isAdmin)
        res.status(400).json({ message: "Faculty already not an admin" });
      const updatedSchema = await facultyModal.updateOne(
        { email: email },
        { $set: { isAdmin: false } }
      );
      res
        .status(201)
        .json({ message: "removed from admin Successfully", updatedSchema });
    } else {
      res.status(400).json({
        message:
          "Logged in user doesn't have privillages to remove as an admin",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
