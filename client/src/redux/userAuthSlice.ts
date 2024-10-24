import {createSlice,PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
  }
  
  interface LoginPayload {
    token: string;
    isLoggedIn: boolean;
  }
  interface LogoutPayload {
    isLoggedIn: boolean;
  }
const initialState:AuthState={
    isLoggedIn:localStorage.getItem("userToken")?true:false,

}

const userAuthReducer = createSlice({
    name:"userAuth",
    initialState,
    reducers:{
        loginSuccess:(state,action: PayloadAction<LoginPayload>)=>{
            localStorage.setItem("userToken",action.payload.token);
            console.log("action:",action)
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        logout:(state,action: PayloadAction<LogoutPayload>)=>{
            localStorage.removeItem("userToken");
            state.isLoggedIn = action.payload.isLoggedIn;
        }
    }
})
export const {loginSuccess,logout} = userAuthReducer.actions;
export default userAuthReducer.reducer;




// Typed RootState:

// RootState is defined as the return type of the store’s getState() method. This gives you the overall shape of the state.
// Typed AppDispatch:

// AppDispatch is typed as the type of the store's dispatch method. This will help ensure that your dispatched actions conform to the expected types.
// Now, when you use useSelector or useDispatch in your components, you can use these types to maintain type safety. For example:
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from './store';

// // Usage of typed useSelector and useDispatch
// const isLoggedIn = useSelector((state: RootState) => state.userAuth.isLoggedIn);
// const dispatch: AppDispatch = useDispatch();