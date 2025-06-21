import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
 
const Login = () => {

const [form,setform]=useState({email:'',password:''})
 const navigate=useNavigate(); 

const handleChange=(e)=>setform({...form,[e.target.name]:e.target.value})

 const handlesubmit=async(e)=>{
    e.preventDefault();
    try{
        const res=await axios.post("http://localhost:5000/api/auth/login",form);
        localStorage.setItem("token",res.data.token);
        localStorage.setItem("user",JSON.stringify(res.data.user));
        alert("Login Successful");
        navigate("/");
    }
    catch(err){
        alert(err.response?.data?.error || "Login Failed")
    }
} 
return (
  <div className={` bg-blue-100 h-screen flex flex-col justify-center items-center  bg-cover bg-center`}>
  <form  className='bg-white h-1/2 flex flex-col justify-center items-center  shadow-xl gap-6 rounded-lg w-100' onSubmit={handlesubmit}>
  <h1 className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-900 text-2xl font-bold'>LOGIN</h1>
    <input
      name='email'
      type='email'
      placeholder='Enter your email'
      onChange={handleChange}
      required
      className='border-1 p-3 w-90 rounded-md'
    />
    <input
      name='password'
      type='password'
      placeholder='Enter your password'
      onChange={handleChange}
      required
      className='border-1 p-3 w-90 rounded-md'
    />
    <div className='flex flex-col gap-2'>
    <button type='submit' className='bg-gradient-to-r from-blue-300 to-blue-900 p-3 w-90 rounded-full text-white font-bold shadow-md hover: cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl '>Login
    </button>
    <button type='submit' className='bg-gradient-to-r from-blue-300 to-blue-900 p-3 w-90 rounded-full text-white font-bold shadow-md hover: cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl mt-0 '>Sign in with google</button>
    </div>
  </form>
  </div>
);
}

export default Login
