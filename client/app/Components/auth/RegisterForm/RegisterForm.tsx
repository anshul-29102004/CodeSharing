"use client"

import { useUserContext } from '@/context/userContext'
import React, { useEffect, useState } from 'react'

function RegisterForm() {
  const{registerUser,userState,handlerUserInput}=useUserContext();
  const {name,email,password,}=userState;
  const[showPassword,setShowPassword]=React.useState(false);
  const togglePassword=()=>setShowPassword(!showPassword)




  return (
    <form className='m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]'>
        <div className='relative z-10'>
            <h1 className='mb-2 text-center text-[1.35rem] font-medium'>Register for an account</h1>
            <p className='mb-8 px-8 text-center text-gray-400  text-[14px]'>
                Create an account.Already have an account? {" "}
                <a href='/login' className='font-bold text-[#2ECC71] hover:text-[#7263F4] transition-all duration-300'>Login Here</a>
            </p>
            <div className='flex flex-col'>
                <label  htmlFor="name" className='mb-1 text-[#999]'>Full Name</label>
                <input  value={name} type="text" id="name" name="name" placeholder='Enter your full name' onChange={(e)=>handlerUserInput("name")(e)} className='px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800'/>
            </div>

             <div className='mt-[1rem] flex flex-col'>
                <label  htmlFor="email" className='mb-1 text-[#999]'>Email</label>
                <input value={email} type="text" id="name" name="email" placeholder='abcd@gmail.com' onChange={(e)=>handlerUserInput("email")(e)} className='px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800'/>
            </div>

             <div className='mt-[1rem] relative flex flex-col'>
                <label  htmlFor="password" className='mb-1 text-[#999]'>Password</label>
                <input value={password} type={showPassword ? "text" : "password"} id="password" name="password" placeholder='***********' onChange={(e)=>handlerUserInput("password")(e)}className='px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800'/>
                <button type='button' className='absolute p-1 right-4 top-[43%] text-[22px] opacity-45 '>
              {
                      showPassword ? (
                <i className="fas fa-eye-slash" onClick={togglePassword}></i>
                 ) : (
               <i className="fas fa-eye" onClick={togglePassword}></i>
                )
               }

            </button>
            </div>

            <div className='flex'>
              <button onClick={registerUser} disabled={!name || !email || !password} type="submit" className='mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors'>Register Now</button>
            </div>

            

        </div>
    </form>
  )
}

export default RegisterForm