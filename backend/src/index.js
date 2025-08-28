const express = require("express")
const app = express();
require("dotenv").config(); 
const main = require("./config/db")
const cookieParser = require("cookie-parser")
const authRouter= require("./routes/userAuth")
const problemRouter = require("./routes/problemCreator")
const submitRouter = require("./routes/submit")
const cors = require("cors")
const redisClient = require("./config/redis")


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);




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