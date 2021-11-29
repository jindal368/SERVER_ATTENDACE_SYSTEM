import StudentModal from "../models/student.js";
import HttpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import globalConstants from "../utils/globalConstants.js";

// export const addStudent=(req,res)=>{
//     const {course,year,semester,section,name,rollNo,email,mobile,fathersMobile} = req.body;
//     const studentObj={course,year,semester,section,name,rollNo,email,mobile,fathersMobile};
//     StudentModal.findOne({rollNo})
//     .then((student)=>{
//         if(student==null){
//             return bcrypt.hash(req.body.password,globalConstants.SALT_ROUNDS);
//         }
//         else{
//             return Promise.reject("Student already exists");
//         }
//     })
//     .then((hashedPass)=>{
//         studentObj.password=hashedPass;
//         return StudentModal.create(studentObj);
//     })
//     .then((createdStudent)=>{
//         res.status(HttpStatus.OK).send({message:"Student Registered successfully",createdStudent});
//     })
//     .catch((err)=>{
//         res.status(HttpStatus.BAD_REQUEST).send({message:err});
//     })
// }


export const getStudent=(req,res)=>{
    verifyStudent(req.userId)
    .then(()=>{
        const rollNo=req.params.rollNo;
        StudentModal.findOne({rollNo})
        .then((student)=>{
            if(student==null)
                return Promise.reject("Student does not exists");
            else
                res.status(HttpStatus.OK).send({message:"Student data fetched successfully",student});
        })
    })
    .catch((err)=>{
        res.status(HttpStatus.BAD_REQUEST).send({message:err});
    })
}

export const updateStudent=(req,res)=>{

}

export const studentAttendance=(req,res)=>{
    verifyStudent(req.userId)
    .then(()=>{
        const rollNo=req.params.rollNo;
        StudentModal.findOne({rollNo})
        .then((student)=>{
            if(student==null)
                return Promise.reject("Student does not exists");
            else
                res.status(HttpStatus.OK).send({message:"Student attendance fetched successfully",attendance:student.attendance});
        })
    })
    .catch((err)=>{
        res.status(HttpStatus.BAD_REQUEST).send({message:err});
    })
}

const verifyStudent=(id)=>{
    return new Promise((resolve,reject)=>{
        StudentModal.findById(id)
        .then((res)=>{
            if(res!=null && res.isVerified)
                resolve();
            else    
                reject("Student not verified, please verify your account");
        })
        .catch((err)=>{
            reject(err);
        })
    })
}