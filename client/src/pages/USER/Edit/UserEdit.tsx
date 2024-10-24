import React ,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
import API from '../../../../config/axiogCongig';
import "./Edit.css";
import Spinner from '../../Loading/Spinner';

interface IData{
    name:string;
    mobile:string;
    profileUrl:string;
}


const UserEdit:React.FC = () => {

    const Data:IData={
        
            name:"",
            mobile:"",
            profileUrl:"",
        
    }

    const [userData,setUserData]=useState<IData>(Data)
const [profileImg,setProfileImg]=useState<File|null>(null)
const [errors,setErrors]=useState<IData>(Data);
const [isLoading,setIsLoading]=useState<boolean>(false);

const navigate=useNavigate();

useEffect(()=>{

const fetchUserData=async()=>{
    try {
        const token =localStorage.getItem("userToken");
        
      console.log("this is the token from edit",token)
        const response = await API.get("/",{
            headers:{
                Authorization:`Bearer ${token}`
            }

        })
       
        if(response.data.success){
            setUserData(response.data.user);
        }else{
            console.log("Failed to fetch user details");
            navigate("/signin")
        }
   } catch (error) {
        console.log(error,"errror whilefetch user")
        navigate("/signin")
    }
}
fetchUserData();
},[navigate])


const validate = ():boolean => {

   
    if (!userData.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!userData.mobile.trim()) {
        errors.mobile = 'Mobile number is required';
    } else if (!/^\d+$/.test(userData.mobile)) {
        errors.mobile = 'Mobile number must contain only digits';
    }
    setErrors(errors);
    return !errors.name && !errors.mobile;
};

const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
        ...userData,
        [name]: value||""
    });
};
const handleFileChange= (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files&&e.target.files.length>0){
        setProfileImg(e.target.files[0])
}
}

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) {
          return;
        }
      
        setIsLoading(true);
        const token =localStorage.getItem("userToken");
        if (!token) {
            console.error("No token found!");  
            return;
          }

       
        
        // if (!token) {
        //   console.error("Token not found!");
        //   toast.error('Unauthorized: Please sign in again.');
        //   navigate('/signin');
        //   return;
        // }
      
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('mobile', userData.mobile);
        if (profileImg) {
          formData.append('profileImg', profileImg);
        }

        try {
          const response = await API.put('/edit-profile',formData,{
            headers:{
                Authorization:`Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
          });
          // const response = await API.post('/edit-profile', {
          //   headers: {
          //       Authorization: `Bearer ${token}`,
          //       'Content-Type': 'multipart/form-data',
          //     }
          // });
 
      console.log(response.data,'thsi is the  response ')
          if (response.data.success) {
            toast.success('Profile updated successfully!');
            navigate('/');
          } else {
            toast.error('Failed to update profile');
          }
        } catch (error: any) {
          console.error(error,'this is the error ');
          if (error.response && error.response.status === 401) {
        
            toast.error('Unauthorized: Please sign in again.');
            navigate('/');
          } else if (error.response && error.response.data.message === 'User not found') {
            toast.error('You are Blocked by admin');
            localStorage.removeItem('userToken');
            navigate('/signin');
          }
        } finally {
          setIsLoading(false);
        }
      };
      

  return (
    <div>
 <div className='edit-user'>     
            <div className='edit-user-form'>
                <h1>Edit My Profile</h1>
                <div className='flex items-center  justify-center'>
                <img src={userData.profileUrl} alt="" />
                </div>
               
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder='Username'
                        value={userData.name||''}
                        onChange={handleInputChange}
                    />
                    {errors.name && <p className='error'>{errors.name}</p>}

                    <input
                        type="text"
                        name="mobile"
                        placeholder='Mobile'
                        value={userData.mobile||""}
                        onChange={handleInputChange}
                    />
                    {errors.mobile && <p className='error'>{errors.mobile}</p>}

                    <div className='file-input-container'>
                        <input
                            type="file"
                            id="file-input"
                            name='profileImg'
                            className="file-input"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-input" className="upload-img-btn">Upload Profile</label>
                    </div>
                    {isLoading?(<Spinner/>):( <button type='submit'>Save changes</button>)}
                   
                </form>
            </div>
        </div>
    </div>
  )
}

export default UserEdit