import express, { Request , Response } from "express";
import userSchema from "../Model/userSchema";
import { User, IUser } from "../Model/userSchema";
import jwt, { Jwt, JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateToken from "../JWT/jwt";
import uploadImage from "../cloudinary/cloudinary";


export interface Iuser {
    id: string;
    name: string;
    email: string;
    password: string;
    mobile: string;
    profileUrl: string;
    isAdmin: Boolean;
  }
//   interface adminRequest extends Request {
//     params: {
//         id?: string;
//         userId?: string; 
//     };
//     // body: {
//     //     name?: string;
//     //     email?: string; 
//     //     mobile?: string; 
//     // };
// }
  export const verifyLogin = async (req:Request,res:Response):Promise<void> =>{
    try {
        
        const { email, password }: { email: string; password: string } = req.body;
        console.log("haii", email, password)
        const userData: Iuser | null = await User.findOne({ email: email });
  

    if (!userData) {
      res
        .status(500)
        .json({ success: false, message: "invalid email or password" });
      return;
    }
     if(userData?.isAdmin == false) {
      res
        .status(400)
        .json({ success:false, message: "user not allowded" });
      return;
    }
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      console.log("invalid email or password2");
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }
  
    const token = generateToken({ admin: userData.id.toString() });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}



export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const { page = '1', limit = '10' }: { page?: string, limit?: string } = req.query;

       
        const pageNumber: number = parseInt(page, 10);
        const limitNumber: number = parseInt(limit, 10);
        const skip: number = (pageNumber - 1) * limitNumber;

       
        const users = await User.find({isAdmin:false})
            .select('-password')
            .skip(skip)
            .limit(limitNumber);

        const totalUsers = await User.countDocuments({});

       
        res.status(200).json({
            success: true,
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limitNumber),
            currentPage: pageNumber,
        });
    } catch (error: any) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching user details',
            error: error.message,
        });
    }
};


export const addUser = async (req:Request,res:Response):Promise<void> =>{
    try {
        const {name,email,mobile,password,profileUrl} = req.body
        if(!name||!email || !mobile || !password){
             res.status(400).json({success:false,message:"All fields required"});
             return;
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
             res.status(400).json({ success: false, message: 'Email already in use' });
             return
        }
        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            mobile,
            password:hashPassword,
            
        })
        const userData = await user.save();
        console.log(userData,"thsi is the user datat");

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                name: userData.name,
                email: userData.email,
                mobile: userData.mobile,
            },
        });
    } catch (error:any) {
         console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}


export const deleteUser = async (req:Request, res: Response): Promise<void> => {
    try {
      console.log("delete user 00000000000000000")
        const { id } = req.params;
        console.log("delete user"); 
        console.log("id:", id);

        if (!id) {
             res.status(400).json({ success: false, message: 'User ID is required' });
             return
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
             res.status(404).json({ success: false, message: 'User not found' });
             return
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting user', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export const getUserToEdit = async (req:Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
             res.status(404).json({ success: false, message: 'User not found' });
             return
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                profileUrl: user.profileUrl
            }
        });
    } catch (error: any) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



export const editUser = async (req:Request, res: Response): Promise<void> => {
    try {
        const { name, email, mobile } = req.body;
        const { userId } = req.params;

        console.log("edit user...............", userId);

        const existingUserWithEmail = await User.findOne({ email });
        if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
             res.json({
                success: false,
                message: 'Email address already in use'
            });
            return
        }

        let profileUrl: string | undefined;
        if (req.file) {
            profileUrl = await uploadImage(req.file.buffer);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                email,
                mobile,
                ...(profileUrl && { profileUrl }),
            },
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

    } catch (error: any) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
