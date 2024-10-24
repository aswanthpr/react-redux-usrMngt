import express,{Router} from "express"
import upload from "../cloudinary/multer";
import {verifyLogin,
    getUserDetails,
    addUser,
    deleteUser,
    editUser,
    getUserToEdit
           } from "../controller/adminController"


const adminRoute:Router =express.Router()

adminRoute.post("/login",verifyLogin)
adminRoute.get('/dashboard',getUserDetails)
adminRoute.post("/add-user",addUser)
adminRoute.delete("/delete-user/:id",deleteUser)
adminRoute.get('/edit-user/:userId', getUserToEdit);
adminRoute.put('/edit-user/:userId', upload.single('profileImg'), editUser);

export default adminRoute;