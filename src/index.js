const express = require("express")
const app = express();
require("dotenv").config(); 
const main = require("./config/db")
const cookieParser = require("cookie-parser")
const authRouter= require("./routes/userAuth")
const problemRouter = require("./routes/problemCreator")
const redisClient = require("./config/redis")




app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);



const InitalizeConnection = async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()])
        console.log("DB Connected");

        app.listen(process.env.PORT, ()=>{
            console.log("server is listening at port number :"+ process.env.PORT)
    })

    }
    catch(err){
        console.log("Error:"+err)

    }
}


InitalizeConnection();