import axios, { InternalAxiosRequestConfig } from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials:true
  });

  API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('userToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    

    }
    
    return config;
  },(error)=>{
    return Promise.reject(error)
  });
  
  export default API;