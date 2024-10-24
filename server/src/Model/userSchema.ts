import mongoose, { Schema,model,connect } from "mongoose";

export interface IUser{
    name:string;
    email:string;
    password:string;
    mobile:string;
    profileUrl:string;
    isAdmin:Boolean;
}

const userSchema:Schema<IUser> = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        default:null
        
    },
    password:{
        type:String,
        required:true,

    },
    profileUrl:{
        type:String,
        default:"empty"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }


},{
    timestamps:true
})

export const User = mongoose.model<IUser>("user",userSchema);
export default User;