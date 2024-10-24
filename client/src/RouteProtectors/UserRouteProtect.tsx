import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Outlet,useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';




const UserRouteProtect:React.FC =() => {
const isLoggedIn:boolean =useSelector((state:RootState)=>state.userAuth.isLoggedIn);

const navigate = useNavigate();

useEffect(()=>{

        if(!isLoggedIn){
            navigate("/signin")
        }

},[])


    return (
    <div><Outlet/></div>
  )
}

export default UserRouteProtect