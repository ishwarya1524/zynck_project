import React, { useState } from 'react'
 import {useNavigate} from "react-router-dom"
import axios from "axios" 

const Register = () => {

     const [form,setform]=useState({name:'',email:'',password:''})
    const navigate=useNavigate();

    const handleChange=(e)=>setform({...form,[e.target.name]:e.target.value})

    const handlesubmit= async(e)=>{
        e.preventDefault();
        try{
            await axios.post("https://zynck-project-1.onrender.com/api/auth/register",form);
            alert("Registration Successful")
            navigate("/login")
        }
        catch(err){
            alert(err.response?.data?.message || "Registration failed");
        }

    } 
        return (
          <div className={` h-screen flex flex-col justify-center items-center bg-blue-100`}>
          <form className='bg-white flex flex-col justify-center items-center h-1/2 shadow-xl rounded-lg w-100' onSubmit={handlesubmit}>
          <h1 className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-900 text-2xl font-bold mb-5'>REGISTER</h1>
            <input name="name" placeholder="Name" onChange={handleChange} className='border-1 p-3 w-90 rounded-md'/><br/>
            <input name="email" placeholder="Email" onChange={handleChange} className='border-1 p-3 w-90 rounded-md'/><br/>
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className='border-1 p-3 w-90 rounded-md'/><br/>
            <button type="submit" className='bg-gradient-to-r from-blue-300 to-blue-900 p-3 w-90 rounded-full text-white font-bold shadow-md hover: cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl '>Register</button>
          </form>
          </div>
        );
}

export default Register
