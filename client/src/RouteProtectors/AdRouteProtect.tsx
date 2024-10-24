import React,{useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Outlet,useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import Spinner from '../pages/Loading/Spinner';

const AdRouteProtect:React.FC = () => {
  
    const isLoggedIn = useSelector((state:RootState)=>state.adminAuth.isLoggedIn);
    const [loading,setLoading] = useState<boolean>(true);

    const navigate  = useNavigate();

    useEffect(()=>{
        const checkAuthStatus = async()=>{
            setLoading(false);

        }
        checkAuthStatus();
    },[navigate,isLoggedIn])
    if(loading){
        return <><Spinner/></>
    }
    if(!isLoggedIn){
        navigate('/admin/login');
        return null
    }
  
    return (
    <div><Outlet/></div>
  )
}

export default AdRouteProtect