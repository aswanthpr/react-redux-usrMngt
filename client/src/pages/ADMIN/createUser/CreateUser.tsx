import React, { useState } from 'react';
import './createUser.css';
import { useNavigate } from 'react-router-dom';
import API from '../../../../config/axiogCongig'
import { toast } from 'react-toastify';



interface FormData {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

interface FormError {
  name?: string;
  email?: string;
  password?: string;
  mobile?: string;
}
const CreateUser:React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '', mobile: '' });
  const [errors, setErrors] = useState<FormError>({ name: '', email: '', password: '', mobile: '' });

  const navigate = useNavigate();

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim()
    });
  };

  const validate = ():boolean => {
   
    let valid = true;

    if (!formData.name) {
      errors.name = 'Username is required';
      valid = false;
      console.log("1111111111")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
      console.log("2222222222222")
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
      valid = false;
      console.log("33333333333333333")
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
      console.log("44444444444444444")
    } else {
      if (formData.password.length < 6) {
        errors.password = 'Min 6 characters';
        valid = false;
        console.log("5555555555555555")
      }
      if (!/[A-Za-z]/.test(formData.password)) {
        errors.password = 'At least 1 letter';
        valid = false;
        console.log("666666666666666666")
      }
      if (!/\d/.test(formData.password)) {
        errors.password = 'At least 1 number';
        valid = false;
        console.log("7777777777777777777")
      }
      if (!/[@$!%*?&]/.test(formData.password)) {
        errors.password = 'At least 1 special character';
        valid = false;
        console.log("88888888888888")
      }
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
      valid = false;
      console.log("9999999999999999999")
    } else if (!mobileRegex.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits long';
      valid = false;
      console.log("000000000000000")
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    if (validate()) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await API.post('/admin/add-user', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("response.data : ", response.data)
        if (response.data.success) {
          toast.success('User created successfully');
          navigate('/admin/dashboard');
        } else {
          toast.error(response.data.message || 'Failed to create user');
        }
      } catch (error:any) {
        console.error('Error submitting form', error);
        toast.error(error.response?.data?.message || 'An error occurred!');
      }
    }
  };

  const handleGoback = ():void => {
    navigate('/admin/dashboard');
  };


  return (
    <div className='create-user'>
      
      <div className='create-user-form'>
        <h1>Create an User</h1>
        <form onSubmit={handleSubmit} >

          <input type="text" name='name' value={formData.name} placeholder='Username' onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}

          <input type="email" name='email' value={formData.email} placeholder='Email address' onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}

          <input type="text" name='mobile' value={formData.mobile} placeholder='Mobile' onChange={handleChange} />
          {errors.mobile && <p className="error">{errors.mobile}</p>}

          <input type="password" name='password' value={formData.password} placeholder='Password' onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}

          {/* <div className='file-input-container'>
  <input type="file" id="file-input" className="file-input" />
  <label htmlFor="file-input" className="upload-img-btn">Upload Profile</label>
</div> */}

          <button type='submit'>Create</button>
        </form>
        <button onClick={handleGoback} className='goback-btn'>Go back</button>
      </div>
    </div>
  )
}

export default CreateUser