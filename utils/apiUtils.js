import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transport=nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: process.env.MAIL,
        pass: process.env.PASSWD
    }
})

export const sendVerificationMail=(mail,token)=>{
    return new Promise((resolve,reject)=>{
        transport.sendMail({
            from: 'SAS noreply@smart-attendance-system',
            to: mail,
            subject: 'Account Verification',
            text: `Welcome to Smart Attendance System\nPlease paste the below token in verifyAccount request for verification of your account.\n\nAccess Token :: ${token}\n\nDon't share this token with anyone,it is confidential.`
        },(err,resp)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(resp)
            }
        })
    })
}

export const sendForgotMail=(mail,token)=>{
    return new Promise((resolve,reject)=>{
        transport.sendMail({
            from: 'SAS no-reply@innogical.com',
            to: mail,
            subject: 'Forgot Password',
            text: `You are receiving this email because you from your account on SAS request for a password change.\nSimply paste the below token in forgotPassword/setPassword request and give your new password.\n\nAccess Token :: ${token}\n\nIf this request is not made by you, please ignore this email and your password will remain unchanged.\nDon't share this token with anyone,it is confidential.`
        },(err,resp)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(resp)
            }
        })
    })
}

export const sendPasswordChangedAcknowledement=(mail)=>{
    return new Promise((resolve,reject)=>{
        transport.sendMail({
            from: 'SAS no-reply@innogical.com',
            to: mail,
            subject: 'Password Changed Successfully',
            text: `You have successfully changed your password at Smart Attendance System.\nThanks for using SAS.`
        },(err,resp)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(resp)
            }
        })
    })
}

export const verifyAccessToken=(token,token_secret)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,token_secret,(err,decoded)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(decoded);
            }
        })
    })
}