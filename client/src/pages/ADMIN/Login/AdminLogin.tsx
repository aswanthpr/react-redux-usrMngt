import React, { useState,ChangeEvent,FormEvent } from 'react'

import './AdminLogin.css'
import API from '../../../../config/axiogCongig';
import { loginSuccess } from '../../../redux/adminAuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../Loading/Spinner';

interface IFormData{
    email:string;
    password:string;
}

const AdminLogin:React.FC = () => {

  const [formData, setFormData] = useState<IFormData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [formError, setFormError] = useState({ email: '', password: '', submit: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value.trim()
    })
  }


  const validate = ():boolean => {
    let valid:boolean = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/;

    if (!formData.email) {
      toast.error('Email required');
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      toast.error('Invalid email');
      valid = false;
    }

    if (!formData.password) {
      toast.error('Password required');
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


  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
   
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);

      try {
        console.log(formData);

        const response = await API.post<{success:boolean;token:string}>('/admin/login', formData);
        // const response = await API.post<{success:boolean;token:string}>("/signin",formData);
        console.log("Response:", response.data);

        if (response.data.success) {
          dispatch(loginSuccess({token:response.data.token }));
          // admin:response.data.admin
          setIsLoading(false);
          toast.success('Login Successful');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid email or password');
          setIsLoading(false);
        }
      } catch (error) {
        toast.error('Invalid email or password');
        setIsLoading(false);
      }
    }
  }

  return (
    <div className='login'>
     
      <div className='admin-login-form'>
        <h1 className='font-semibold'>Sign In as Admin</h1>
        <form onSubmit={handleSubmit} >
          <input type="email" placeholder='Email address' name='email' onChange={handleChange} />
          <input type="password" placeholder='Password' name='password' onChange={handleChange} />
          {isLoading ? (<Spinner />) : (<button type='submit'>Sign In</button>)}
        </form>
      </div>

    </div>
  )
}

export default AdminLogin