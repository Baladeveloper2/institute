import axios from "axios"


const API = axios.create({
<<<<<<< HEAD
baseURL:"https://api-backend-institute.onrender.com/",
=======
baseURL:"https://api-backend-institute.onrender.com/",
>>>>>>> a5be5d2 (updated code)
// baseURL:"https://ram-institute-backend-mrif.onrender.com/",
// baseURL:"backend-institute-production.up.railway.app/",
// baseURL:"https://ram-institute-backend.onrender.com/",
// baseURL: "https://website-backend-production-e152.up.railway.app/",
   withCredentials: true,
})

// API.interceptors.request.use((config)=>{
//     const token = localStorage.getItem('authToken')
//     if(!token) config.headers.Authorization  = `Bearer ${token}`
//     return config;
// })

export default API;
