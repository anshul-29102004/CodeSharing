"use client"
import { useUserContext } from '@/context/userContext'
import React, { useEffect, useState } from 'react'

function LoginForm() {
  const{loginUser,userState,handlerUserInput}=useUserContext();
  const {name,email,password,}=userState;
  const[showPassword,setShowPassword]=React.useState(false);
  const togglePassword=()=>setShowPassword(!showPassword)




  return (
    <form className='m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]'>
        <div className='relative z-10'>
            <h1 className='mb-2 text-center text-[1.35rem] font-medium'>Login to your Account</h1>
            <p className='mb-8 px-8 text-center text-gray-400  text-[14px]'>
                Login Now.Don't have an account? {" "}
                <a href='/register' className='font-bold text-[#2ECC71] hover:text-[#7263F4] transition-all duration-300'>Register Here</a>
            </p>
            
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

            <div className='mt-4 flex justify-end'>
              <a href='/forgot-password' className='font-bold text-[#2ECC71] text-[14px] hover:text'>Forgot Password</a>
            </div>

            <div className='flex'>
              <button onClick={loginUser} disabled={!email || !password} type="submit" className='mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors'>Login Now</button>
            </div>

            

        </div>
    </form>
  )
}

export default LoginForm