const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        min:18
    },
    pfp:{
        type:String,
        default:'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
    }
},{
    timestamps:true
})

const userModel=mongoose.model('user',userSchema)

module.exports=userModel