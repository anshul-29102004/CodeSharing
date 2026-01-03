"use client"
import { useUserContext } from '@/context/userContext'
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import SearchInput from '../SearchInput/SearchInput';
function Header() {
    const {user}=useUserContext();
    const photo=user?.photo;
  
  
    return (
     <div className='fixed z-20 top-0 w-full px-8 flex items-center justify-between bg-bg-1 border-b h-[8vh] border-[rgba-2] h-[8vh]'>
        <Link href="/" className='flex items-center gap-2'>
        <Image src="/thecodedealer--logo-white.png" alt="logo" width={30} height={30} className="ml-[1px]"/>
        <h1 className='flex items-center font-bold text-white text-2xl'>Snippy</h1>
        </Link>

        <div className='lg:flex hidden'>
            <SearchInput/>

        </div>
     </div>
  )
}

export default Header