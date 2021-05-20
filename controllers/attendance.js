import AttendanceModal from '../models/attendance.js'

export const postAttendanceData = async (req , res) => {
    const {email , subject} = req.body;
    try{
        const  today  =  new Date();
      const data = {
          subject : subject,
          email : email,
          date : today
      }
      AttendanceModal.create(data)
      res.status(200)
      console.log("added attendence schema");
    }
    catch {
        res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
    }

}
export const updateStudent = async (req , res) =>{
    try {
       const updatedSchema = await AttendanceModal.updateOne(
           {_id : req.body._id},
           {$set : {students : students.push(req.body.data)}}
       );
       res.json("Student addeed");
       console.log("Added Student" , updatedSchema);
    }
    catch(err) {
        res.json(err)
        console.log("Error : ",err);
    }

}
export const getStudentData = async (req , res) => {
    console.log("email on backend : ",req.body.email)
      AttendanceModal.find()
      .then((data) =>{
          if(data){
              console.log("Data is rendering" , data)
              res.json({data})
          }
      })
      .catch(err =>{
          console.log("Error : ",err);
      })
   
}