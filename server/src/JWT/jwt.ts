import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload{
    userId?:string;
    adminId?:string
}

const generateToken =(payload:CustomJwtPayload)=>{
    
    return jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY??"myStrongKey",
        {expiresIn:"1h"}
    )
}
export default generateToken;