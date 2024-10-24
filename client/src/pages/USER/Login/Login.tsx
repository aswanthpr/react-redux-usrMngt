import React ,{useState} from 'react';
import {useNavigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
// import axios from 'axios';
import "./login.css";
import {toast} from "react-toastify";
import Spinner from '../../Loading/Spinner';
import { AppDispatch } from '../../../redux/store';
import { loginSuccess } from '../../../redux/userAuthSlice';
import API from '../../../../config/axiogCongig';


interface IData{
  email:string;
  password:string;

}
const Login:React.FC = () => {
  const navigate=useNavigate()
  const dispatch:AppDispatch = useDispatch();

const [formData,setFormData] =useState<IData>(
  {
    email:"",
    password:""
  }
)
const[loading,setLoading]=useState<boolean>(false);

const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
  const {name,value} = e.target;

  setFormData({...formData,[name]:value.trim()})

}


const validate = () => {
  let valid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/;

  if (!formData.email) {
    toast.error('Email is required');
    valid = false;
  } else if (!emailRegex.test(formData.email)) {
    toast.error('Invalid email');
    valid = false;
  }

  if (!formData.password) {
    toast.error('Password is required');
    valid = false;
  } else {
    if (formData.password.length < 6) {
      toast.error('Password : Min 6 characters');
      valid = false;
    }
    if (!/[A-Za-z]/.test(formData.password)) {
      toast.error('Password : At least 1 letter');
      valid = false;
    }
    if (!/\d/.test(formData.password)) {
      toast.error('Password : At least 1 number');
      valid = false;
    }
    if (!/[@$!%*?&]/.test(formData.password)) {
      toast.error('Password : At least 1 special character');
      valid = false;
    }
  }

  return valid;
};

const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  setLoading(true);
  if(validate()){
  
    try {
      const response = await API.post<{success:boolean;token:string}>("/signin",formData);
      console.log(response.data);
      if(response.data.success){
        console.log("token ",response.data.token)
        dispatch(loginSuccess(
          {
            token:response.data.token,
            isLoggedIn:true
          }
          
        ));
        setLoading(false)
        toast.success("login Success");
        navigate("/");

      }
    } catch (error) {
      setLoading(false);
      toast.error("Invalide email or password");
      console.log("error loggin in ",error);

    }
  }else{
    setLoading(false)
  }
}
const navigateToSignUp=()=>{
  navigate("/signup")
}
  return (
    <div>
         <div className='login min-h-screen flex justify-center items-center'>
     
      <div className='login-form'>
        <h1 className='font-semibold'>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder='Email address'
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
          />
          {loading ? (
            <Spinner/>
          ) : (
            <button type='submit'>Sign In</button>
          )}
        </form>

        <div className='form-switch'>
          <p>New to App? <span onClick={navigateToSignUp}>Sign Up Now</span></p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login;