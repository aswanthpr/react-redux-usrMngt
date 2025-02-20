import React ,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {logout} from "../../../redux/userAuthSlice";
import "./home.css";
import {toast} from "react-toastify";
import NavBar from '../NavBar/NavBar';
import API from '../../../../config/axiogCongig';


interface IData{
  name:string;
  email:string;
  mobile:string;
  profileUrl?:string;

}

const Home:React.FC = () => {
const [userData,setUserData]=useState<IData>(
  {
    name:"",
    email:"",
    mobile:"",
    profileUrl:""
  }
)
const dispatch = useDispatch();
const navigate = useNavigate();

useEffect(()=>{


  const token = localStorage.getItem("userToken");
  console.log("token",token)
  
  const fetchUserData = async()=>{
    try {
      const response = await API.get('/', { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {

        setUserData(response.data.user);
      } else {
        toast.error("Failed to fetch user details")
      }

    } catch (error:any) {
      console.error('Failed to load user data. Redirecting to login...');
          console.error(error);

          if(error.response.data.message == "User not found"){
            toast.error('You are Blocked by admin');
            localStorage.removeItem("userToken");
            console.log("deleted user");
            navigate("/signin");
          }
    }
    
  }

  fetchUserData()
},[navigate]);

const handleLogout=()=>{
  dispatch(logout(
    {isLoggedIn:false}
  ));

  navigate('/signin');
}
const navigateToeditUser=()=>{
  navigate("/edit-user")
}
const {name,email,mobile,profileUrl}=userData;
  return (
    <>
     <NavBar/>
     <div>
      <div className='home'>
       
        <div className='user-badge'>
          <div className='flex justify-center'>
          <img src={profileUrl} alt="" className=''/>
          </div>
         
          <h2>Welcome, {name}!</h2>
       
          <div >
            <p >Email : <span className='details'>{email}</span></p>
            <p>Mobile :<span className='details'>{mobile}</span> </p>
          </div>
          <button className='edit-btn' onClick={navigateToeditUser}>Edit Profile</button>
          <button className='logout-btn' onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>

    </>
  )
}

export default Home