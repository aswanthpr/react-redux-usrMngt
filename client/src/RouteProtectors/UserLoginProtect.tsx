import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { Outlet,useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import Spinner from '../pages/Loading/Spinner';


const UserLoginProtect:React.FC = () => {
const isLoggedIn = useSelector((state:RootState)=>state.userAuth.isLoggedIn);
const [Loading,setLoading] = useState<boolean>(true);
const navigate = useNavigate();

useEffect(()=>{
    const useAuthChecker = async()=>{
        if(isLoggedIn){
            navigate("/");
            return null;
        }
        setLoading(false);

    }
    useAuthChecker()

},[isLoggedIn, navigate])
if(Loading){
    return <><Spinner/></>
}

  return (
    <div><Outlet/></div>
  )
}

export default UserLoginProtect