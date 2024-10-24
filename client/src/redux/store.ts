import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./userAuthSlice";
import adminAuthReducer from "./adminAuthSlice"





const store = configureStore({
    reducer:{
        userAuth:userAuthReducer,
        adminAuth:adminAuthReducer,

    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;