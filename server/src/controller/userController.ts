import express, { response, Response } from "express";
import userSchema from "../Model/userSchema";
import { User, IUser } from "../Model/userSchema";
import jwt, { Jwt, JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateToken from "../JWT/jwt";
import { Request } from "express";
import uploadImage from "../cloudinary/cloudinary";
import { authenticateToken } from "../middleware/middleware";

// Define a custom interface for the user payload
interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export interface Iuser {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  profileUrl: string;
  isAdmin: Boolean;
}
interface ISignupRequestBody {
  name: string;
  mobile:string
  password: string;
  email: string;
}
export const Signup = async (
  req: Request<{}, {}, ISignupRequestBody>,
  res: Response
): Promise<void> => {
  //The first {} is for URL parameters.The second {} is for res.locals.
  try {
    const { name, password,mobile, email } = req.body;

    const isUser = await User.findOne({ email: email });
    if (isUser) {
      res.status(400).json({ message: "this message is already used" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error while creating user", error });
  }
};

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userData: Iuser | null = await User.findOne({ email: email });
  

    if (!userData) {
      res
        .status(500)
        .json({ success: false, message: "invalid email or password" });
      return;
    }
     if(userData?.isAdmin == true) {
      res
        .status(400)
        .json({ success:false, message: "admin not allowded" });
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
    const token = generateToken({ userId: userData.id.toString() });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserData = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json({ success: false, message: "No token provided" });
    }

    const token: string | undefined = authHeader?.split(" ")[1];

    const decodedToken: any = jwt.verify(
      token!,
      process.env.JWT_SECRET_KEY as string
    );

    req.user = { id: decodedToken.userId };
  

    const user = await User.findOne({ _id: req.user.id });
    console.log("thsi is user", req.user);

    if (user) {
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          profileUrl: user.profileUrl,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const editProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, mobile } = req.body;
    // const { payload } = req.user;
   
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
      res.status(401).json({ success: false, message: "No token provided" });
    }

    const token:string | undefined =  authHeader?.split(" ")[1];

    const decodedToken:any = jwt.verify(token??"",process.env.JWT_SECRET_KEY??"") 

    req.user = {id:decodedToken?.userId}
  
    const userId = req.user?.id;
    console.log( name, mobile);

    console.log("thjs is the user id", userId);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    let profileUrl: string | undefined;
   
    if (req.file?.buffer.length) {
      console.log("0000000000000000000000",);
      profileUrl = await uploadImage(req.file?.buffer);

     

    }
    console.log("99999999999999999999999999999")
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        mobile,
        ...(profileUrl && { profileUrl }),
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
