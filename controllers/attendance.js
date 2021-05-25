import AttendanceModal from '../models/attendance.js'
import QRCode  from 'qrcode'
export const postAttendanceData = async (req , res) => {
    const {email , subject} = req.body;
    try{
        const  today  =  new Date();
        const dataInQr = [];
        dataInQr.push(subject)
        dataInQr.push(Date.now)
        dataInQr.push(email)
        const data = {
            subject : subject,
            email : email,
            date : today,
            qrCode : ''
        }
        // const qrCodeURI = QRCode.toDataURL(dataInQr , {errorCorrectionLevel:'H'} ,async function(err  , url){
        //     console.log("URI In fun : ",url)
        //       data = await({...data , qrCode : url})
        // })
        // console.log("Data in fun : ",data)
        
        //  console.log("Data : ",data )
        AttendanceModal.create(data)
        res.status(200)
        console.log("added attendence schema");  
        
    }
    catch(error) {
        res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
    }

}
export const updateStudent = async (req , res) =>{
    try {
        
       const updatedSchema = await AttendanceModal.updateOne(
           {_id : req.body._id},
           {$addToSet : {students :  (req.body.data)}}
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
    const email = req.params.email
    console.log("email on backend : ",email)
      AttendanceModal.find({email})
      .then((data) =>{
          
              console.log("Data is rendering" , data)
              res.json({data})
          
      })
      .catch(err =>{
          console.log("Error : ",err);
      })
   
}