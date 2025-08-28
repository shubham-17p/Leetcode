const User = require("../models/user")
const validate = require("../utils/validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const redisClient = require("../config/redis")
const Submission = require("../models/submission")

//register
const register = async(req, res)=>{

    try{
        // Step 1: Validate incoming data
        validate(req.body)

        // Step 2: Extract data
        const {firstName, emailId, password} = req.body;

         // Step 3: Hash password
        req.body.password = await bcrypt.hash(password, 10)
        req.body.role ="user"
        
        // Step 4: Create user
        const user = await User.create(req.body)

        // Step 5: Generate JWT token
        const token = jwt.sign(
            {_id:user._id ,role:"user", emailId:emailId},
            process.env.JWT_KEY ,
            {expiresIn:60*60}
        );
        const reply ={
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

         // Step 6: Send token as cookie
        res.cookie("token",token,{maxAge:60*60*1000})

        // Step 7: Send response
        res.status(201).json({
            user:reply,
            message:"Register Successfully"
        })


    }
    catch(err){
        res.status(400).send("Error:"+err.message)
        console.log(err.message)

    }
}

//login
const login = async(req, res)=>{
    try{
        const{emailId, password} = req.body;

        if(!emailId){
            throw new Error("Invalid Credential")
        }
        
        if(!password){
            throw new Error("Invalid Credential")
        }

        const user = await User.findOne({emailId})

        const match = await bcrypt.compare(password,user.password);
        if(!match){
            throw  new Error("Invalid Credential")
        }
        const reply ={
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }


        const token = jwt.sign({_id:user._id ,role:user.role, emailId:emailId},process.env.JWT_KEY ,{expiresIn:60*60});
        res.cookie("token",token,{maxAge:60*60*1000})
        res.status(201).json({
            user:reply,
            message:"Login Successfully"
        })


    }
    catch(err){
        res.status(401).send("Error:"+err.message)

    }
}

//logout
const logout = async(req, res)=>{
    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token)

        await redisClient.set(`token:${token}`,"Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null,{expires: new Date(Date.now())})
        res.send("Logged out Successfully")

    }
    catch(err){  
        res.status(503).send("error:"+err.message)    
    }
}
//admin register
const adminRegister = async(req, res)=>{

    try{
        // Step 1: Validate incoming data
        validate(req.body)

        // Step 2: Extract data
        const {firstName, emailId, password} = req.body;

         // Step 3: Hash password
        req.body.password = await bcrypt.hash(password, 10)
        
        // Step 4: Create user
        const user = await User.create(req.body)

        // Step 5: Generate JWT token
        const token = jwt.sign(
            {_id:user._id ,role:user.role, emailId:emailId},
            process.env.JWT_KEY ,
            {expiresIn:60*60}
        );

         // Step 6: Send token as cookie
        res.cookie("token",token,{maxAge:60*60*1000})

        // Step 7: Send response
        res.status(201).send("user registered successfully")


    }
    catch(err){
        res.status(400).send("Error:"+err)

    }
}

const deleteProfile= async(req, res)=>{
    try{
    const userId = req.result._id;
    await User.findByIdAndDelete(userId)
    //await Submission.deleteMany({userId})
    }
    catch(err){
        res.status(500).send("Internal error:"+ err)
    }
}


module.exports = {register, login, logout, adminRegister, deleteProfile}