import React from "react";
import {Route,Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Login from "./pages/USER/Login/Login";
import Signup from "./pages/USER/Singup/Signup";
import Home from "./pages/USER/Home/Home";
import UserEdit from "./pages/USER/Edit/UserEdit";
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from "./pages/ADMIN/Login/AdminLogin";
import Dashboard from "./pages/ADMIN/Dashbord/Dashboard";
import AdminEditUser from "./pages/ADMIN/EditUser/AdminEditUser";
import CreateUser from "./pages/ADMIN/createUser/CreateUser";
import UserLoginProtect from "./RouteProtectors/UserLoginProtect";
import UserRouteProtect from "./RouteProtectors/UserRouteProtect";
import AdLoginProtect from "./RouteProtectors/AdLoginProtect";
import AdRouteProtect from "./RouteProtectors/AdRouteProtect";




const  App:React.FC=() =>{

  return (
    <div>
      <ToastContainer theme="dark"/>
  
      <Routes>
        <Route element={<UserLoginProtect/>}>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        </Route>
       <Route element={<UserRouteProtect/>}>
       <Route path="/" element={<Home/>}/>
        <Route path="/edit-user" element={<UserEdit/>}/>
       </Route>
        <Route element={<AdLoginProtect/>}>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        </Route>
       <Route element={<AdRouteProtect/>}>
       <Route path="/admin/dashboard" element={<Dashboard/>}/>
        <Route path="/admin/add-user" element={<CreateUser/>}/>
        <Route path="/admin/edit-user/:userId" element={<AdminEditUser/>}/>
       </Route>
        
       
      </Routes>
    </div>
  );
}

export default App;
