import { verifyAccessToken } from '../utils/apiUtils.js';
import dotenv from "dotenv";
dotenv.config();
import HttpStatus from "http-status-codes";
import logger from "../utils/logger.js";

const verify_email_token=(req,res,next)=>{
    logger.debug('authenticating the email token')
    if(!req.headers.authorization)
      res.status(HttpStatus.BAD_REQUEST).send({message:"auth token not found"});
    const token = req.headers.authorization.split(" ")[1];
    verifyAccessToken(token,process.env.EMAIL_SECRET)
    .then((payload)=>{
        logger.debug('Token Verified');
        req.userId=payload.id;
        next();
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`);
        res.status(HttpStatus.UNAUTHORIZED).json({message:"Token is not authorized, you have modified the token"});
    })
}

export default verify_email_token;