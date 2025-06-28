const validator = require("validator")
const validate = (data)=>{
    
    const mandatoryField = ["firstName", "emailId","password"]

    // Check if all required fields are present
    const IsAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));
    if(!IsAllowed){
        throw new Error("Some Field Missing")
    }

     // ✅ Check if email is valid (corrected logic and casing)
    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid Email")
    }

     // ✅ Check if password is strong
    if(!validator.isStrongPassword(data.password)){
        throw new Error('week password')
    }


}

module.exports = validate