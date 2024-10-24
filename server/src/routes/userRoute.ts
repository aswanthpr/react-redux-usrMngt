import express ,{Router} from "express";
import {Signup ,Login, getUserData, editProfile} from "../controller/userController"
import upload from "../cloudinary/multer";
import { authenticateToken } from "../middleware/middleware";

const userRoute  = express.Router();

userRoute.post("/signup",Signup)
userRoute.post("/signin",Login)
userRoute.get("/",getUserData)
userRoute.put("/edit-profile",upload.single("profileImg"),editProfile)
export default userRoute;
