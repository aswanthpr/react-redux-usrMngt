import React ,{useState} from 'react';
import "./signup.css";
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import API from "../../../../config/axiogCongig"
interface IUser{
  name:string;
  email:string;
  password:string;
  mobile:string;
}
const Signup:React.FC = () => {

  const [formData,setFormData] = useState<IUser>(
    {name:"",
      email:"",
      password:"",
      mobile:""}
  )
  const [errors,setErrors] = useState(
    {name:"",
      email:"",
      password:"",
      mobile:""
    }
  )


  const navigate = useNavigate();

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]:value.trim()
    });
  }

  // console.log(formData);
  const validate = () => {
   
    let valid = true;

    if (!formData.name) {
      errors.name = "Username is required";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address";
      valid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      valid = false;
    } else {
      if (formData.password.length < 6) {
        errors.password = 'Min 6 characters'
        valid = false;
      }
      if (!/[A-Za-z]/.test(formData.password)) {
        errors.password = 'At least 1 letter'
        valid = false;
      }
      if (!/\d/.test(formData.password)) {
        errors.password = 'At least 1 number'
        valid = false;
      }
      if (!/[@$!%*?&]/.test(formData.password)) {
        errors.password = 'At least 1 special character'
        valid = false;
      }
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      errors.mobile = "Mobile number is required";
      valid = false;
    } else if (!mobileRegex.test(formData.mobile)) {
      errors.mobile = "Mobile number must be 10 digits long";
      valid = false;
    }

    setErrors(errors);
    console.log(valid)
    return valid;
  };



const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();

  if(validate()){
    try {
    const response = await  API.post("/signup",formData);
      console.log(response,'thsi is response');
      navigate('/signin');

    } catch (error:any) {
      console.log("Error submitting form " ,error);
      setErrors((pre)=>({...pre}))
    }
  }

}
const navigateToLogin=()=>{
  navigate("/signin")
}
  return (
    <div>
       <div className='signup min-h-screen flex justify-center items-center'>
     
      <div className='signup-form'>

        <h1 className='font-bold'>Sign Up</h1>

        <form onSubmit={handleSubmit} >

          <input type="text" name='name' value={formData.name} placeholder='Username' onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}

          <input type="email" name='email' value={formData.email} placeholder='Email address' onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}

          <input type="text" name='mobile' value={formData.mobile} placeholder='Mobile' onChange={handleChange} />
          {errors.mobile && <p className="error">{errors.mobile}</p>}

          <input type="password" name='password' value={formData.password} placeholder='Password' onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}

        

          <button type='submit'>Sign Up</button>
        </form>

        <div className='form-switch'>
          <p>Already have an account? <span onClick={navigateToLogin}>Sign In Now</span></p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Signup