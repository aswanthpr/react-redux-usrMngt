import express,{Application} from "express";
import dotenv from "dotenv";
import cors from "cors"
import morgan from "morgan";

import userRoute from "./routes/userRoute";
import adminRoute from "./routes/adminRoute"
import connectDB from "./config/dbconfig"
 
const app:Application = express();
dotenv.config();
connectDB()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}));



const corsOption = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH","DELETE"],
    credentials: true

};
app.use(cors(corsOption));

app.use("/",userRoute);
app.use("/admin",adminRoute);
const PORT:number = parseInt(process.env.PORT||"3000",10)


// app.get("/",(req:Request,res:Response)=>{
//     res.send("hello with typescript ")


app.listen(3000,()=>{
    console.log('\x1b[35m%s\x1b[0m',"server is running on http://localhost:3000") 
})
 