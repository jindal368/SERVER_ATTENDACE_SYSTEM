/** @format */
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import facultyModal from "../models/faculty.js";
import globalConstants from "../utils/globalConstants.js";
import logger from "../utils/logger.js";
import { sendVerificationMail, sendForgotMail, sendPasswordChangedAcknowledement } from "../utils/apiUtils.js";
import HttpStatus from "http-status-codes";

const secret = process.env.TOKEN_SECRET;

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
      return res.status(404).json({ message: "faculty exist but currently inactive" });
    
      const payload={
        email:oldFaculty.email,
        id: oldFaculty._id,
        reason: globalConstants.LOGIN
      }
      const token = jwt.sign(payload,secret,{ expiresIn: "1d" });

    res.status(200).json({ result: oldFaculty, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, mobile, address, department } =req.body;
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

    const payload={
      id:result._id,
      email:result.email,
      reason: globalConstants.VERIFY_EMAIL
    }
    const token = jwt.sign(payload, secret, {expiresIn: "1d",});
    logger.debug("token for email verification of faculty generated");

    const response = await sendVerificationMail(result.email, token);
    logger.debug(`verification mail sent to ${email}.`);

    res.status(201).json({ result, message: `If your email is genuine then you will receive a verification mail. Please go and verify the account to enjoy services.` });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const id=req.tokenPayload.id;
    logger.debug(`Req : ${id}`);
    if (req.tokenPayload.reason===globalConstants.LOGIN && await isAdminById(id) && await isFacultyVerified(id)){
      const updatedSchema = await facultyModal.updateOne(
        { email: req.query.email },
        { $set: { isActive: false, isAdmin: false } }
      );
      if(updatedSchema.n==0)
        res.status(HttpStatus.BAD_REQUEST).json({message: "Faculty does not exists"});
      else
        res.status(201).json({ message: "Removed Successfully", updatedSchema });
    } else {
      res.status(400).json({message: "Logged in user doesn't have privillages to remove faculty",});
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: `Something went wrong or ${err}` });
  }
};

export const isAdminById = async (id) => {
  return await facultyModal
    .findById(id)
    .then((res) => res.isAdmin)
    .catch((err) => false);
};

export const isFacultyVerified = async (id) => {
  return await facultyModal
    .findById(id)
    .then((res) => res.isVerified)
    .catch((err) => false);
};

export const makeAdmin = async (req, res) => {
  try {
    const { email } = req.query;
    const id=req.tokenPayload.id;
    if (req.tokenPayload.reason===globalConstants.LOGIN && await isAdminById(id)&& await isFacultyVerified(id)) {
      const faculty = await facultyModal.findOne({ email });
      if (!faculty) res.status(400).json({ message: "Faculty doesn't exists" });
      if (faculty.isAdmin)
        res.status(400).json({ message: "Faculty already an admin" });

      const updatedSchema = await facultyModal.updateOne({ email: email },{ $set: { isAdmin: true } });
      res.status(201).json({ message: "added as admin Successfully", updatedSchema });
    } else {
      res.status(400).json({message: "Logged in user doesn't have privillages to make admin",});
    }
  } catch (error) {
    logger.debug(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.query;
    const id=req.tokenPayload.id;
    if (req.tokenPayload.reason===globalConstants.LOGIN && await isAdminById(id) && await isFacultyVerified(id)) {
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

    logger.debug(error);
  }
};

export const verifyEmail=(req,res)=>{
  logger.debug('verifying the faculty, inside verifyEmail')
  if(req.tokenPayload.reason===globalConstants.VERIFY_EMAIL){
    facultyModal.findByIdAndUpdate(req.tokenPayload.id,{$set:{isVerified:true}},{new:true})
    .then((resp)=>{
      logger.debug(`Account of ${resp.name} is verified`);
      res.status(201).json({message: `Account verified successfully` });
    })
    .catch((err)=>{
      logger.error(err);
      res.status(500).json({ message: `Something went wrong. ${err.message}` });
    })
  }
  else{
    logger.error("Wrong token");
    res.status(HttpStatus.BAD_REQUEST).send({message:"wrong token"});
  }
}

export const forgotPasswordSendLink=(req,res)=>{
  logger.debug('initiating a forgot password request for faculty...');
  const email=req.query.email;
  facultyModal.findOne({email})
  .then((result)=>{
      if(!result){
          return Promise.reject(new Error('faculty not exist'))
      }
      else{
          logger.debug('faculty found')
          if(!result.isVerified)
            return Promise.reject(new Error('Please verify the account first'))
          const payload={
              id:result._id,
              email:result.email,
              reason: globalConstants.FORGOT_PASSWORD
          }
          const token=jwt.sign(payload,secret,{expiresIn:"1d"});
          return sendForgotMail(email,token);
      }
  })
  .then(()=>{
      logger.debug(`forgot mail sent to ${email}.`);
      res.status(HttpStatus.OK).json({message: `forgot mail sent to ${email}, if this mail id is correct then you will receive the mail shortly.`});
  })
  .catch((err)=>{
      logger.debug(err.message)
      res.status(HttpStatus.BAD_REQUEST).json({message : err.message});
  })
}

export const forgotPasswordChangePassword=(req,res)=>{
  const payload=req.tokenPayload;
  const pass=req.body.password;
  var facultyFromDB;
  if(payload.reason === globalConstants.FORGOT_PASSWORD){
      facultyModal.findById(payload.id)
      .then((faculty)=>{
        if(faculty==null)
          return Promise.reject(new Error("Faculty does not exists"));
        else{
          facultyFromDB=faculty;
          return bcrypt.hash(pass,globalConstants.SALT_ROUNDS);
        }
      })
      .then((hashedPass)=>{
          return facultyModal.findByIdAndUpdate(payload.id,{$set:{password:hashedPass}},{new:true})
      })
      .then(()=>{
          logger.debug('Password of faculty updated Successfully')
          return sendPasswordChangedAcknowledement(facultyFromDB.email);
      })
      .then(()=>{
          logger.debug("Passowrd change acknowledement sended to user");
          res.status(HttpStatus.OK).json({message:'Password updated Successfully'})
      })
      .catch((err)=>{
          logger.debug(`Error :: ${err.message}`);
          res.status(HttpStatus.BAD_REQUEST).json({message : err.message});
      })
  }
  else{
      logger.debug(`wrong token`);
      res.status(HttpStatus.BAD_REQUEST).json({message : "wrong token"});
  }
}
