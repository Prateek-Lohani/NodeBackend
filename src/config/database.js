const mongoose=require('mongoose')
require('dotenv').config();

const DB_USERID=process.env.DB_USERID;
const DB_PASSWORD=process.env.DB_PASSWORD;
const DB_COLLECTION=process.env.DB_COLLECTION;
const DB_NAME=process.env.DB_NAME;

const connectDB=async()=>{
    await mongoose.connect(`mongodb+srv://${DB_USERID}:${DB_PASSWORD}@${DB_COLLECTION}.mwig8lr.mongodb.net/${DB_NAME}`)
}

module.exports=connectDB