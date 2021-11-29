/** @format */
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import HttpStatus from "http-status-codes";

const secret = process.env.LOGIN_SECRET;

const auth = async (req, res, next) => {
  try {
    if(!req.headers.authorization)
      res.status(HttpStatus.BAD_REQUEST).send({message:"auth token not found"});
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }
    console.log("middle : ", req.userId);
    next();
  } catch (error) {
    console.log(error.message);
    res.status(HttpStatus.BAD_REQUEST).send({message:error.message});
  }
};

export default auth;
