"use client"
import { useUserContext } from '@/context/userContext';
import React,{use} from 'react'

interface Props{
    params:Promise<{
        verificationToken:string;
    }>;
}
function page({params}:Props) {
const{verificationToken}=use(params);

const {verifyUser}=useUserContext();

  return (
    <div className='auth-page mt-[4rem] flex flex-col justify-center items-center'>
        <h1 className='text-[#999] text-[2rem] '>Verify Your Account</h1>
      <div className=' bg-white flex flex-col justify-center gap-[1rem] px-[3rem] py-[4rem] rounded-md' >
          <button className='self-center px-4 py-2 bg-blue-500 text-white rounded-md'
          onClick={()=>{
            verifyUser(verificationToken)
          }}>
            Verify
        </button>
      </div>
    </div>
  )
}

export default page