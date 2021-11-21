import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const CONNECTION_URL = process.env.MONGO_URI;

mongoose.set('useFindAndModify', false);
export function connect(){
    return new Promise((resolve,reject)=>{
        mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((res,err) =>{
            if(err)
                return reject("Connection failed")
            resolve();
        })
    })
}

export function disconnect(){
    return mongoose.disconnect();
}