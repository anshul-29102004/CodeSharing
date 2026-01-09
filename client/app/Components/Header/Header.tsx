"use client"
import { useUserContext } from '@/context/userContext'
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import SearchInput from '../SearchInput/SearchInput';
import { login, register } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
function Header() {
    const {user}=useUserContext();
    const photo=user?.photo;

    const router=useRouter();
  
  
    return (
     <div className='fixed z-20 top-0 w-full px-8 flex items-center justify-between bg-bg-1 border-b-[2px] h-[8vh] border-[rgba-2] h-[8vh]'>
        <Link href="/" className='flex items-center gap-2'>
        <Image src="/thecodedealer--logo-white.png" alt="logo" width={30} height={30} className="ml-[1px]"/>
        <h1 className='flex items-center font-bold text-white text-2xl'>Snippy</h1>
        </Link>

        <div className='lg:flex hidden'>
            <SearchInput/>

        </div>
        <div className='flex items-center gap-4'>
            <button className='btn-hover relative h-[47px] px-8 bg-[#3A3B3C] flex items-center gap-4 rounded-xl overflow-hidden'
            onClick={()=>router.push("/login")}
            >
                <span className='text-xl text-gray-200'>{login}</span>
                <span className='font-bold text-white'>Login</span>
                <span className='blob'></span>
            </button>
            <button className='btn-hover relative h-[47px] px-8 bg-[#7263F3] flex items-center gap-4 rounded-xl overflow-hidden'
            onClick={()=>router.push("/register")}
            >
                <span className='text-xl text-gray-200'>{register}</span>
                <span className='font-bold text-white'>Register</span>
                <span className='blob'></span>
            </button>

        </div>
     </div>
  )
}

export default Header