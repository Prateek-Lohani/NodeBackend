const validator=require('validator');

const signupValidation=(req)=>{
    const {email,firstName,lastName,password}=req.body;

    if(!firstName || !lastName){
        throw new Error('Please Enter Valid Name');
    }else if(!password){
        throw new Error('Password is missing');
    }else if(!validator.isEmail(email)){
        throw new Error('Please Enter Valid Email');
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Please Enter Strong Password');
    }

}

module.exports={signupValidation}