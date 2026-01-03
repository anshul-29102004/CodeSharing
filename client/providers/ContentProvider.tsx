import Sidebar from '@/app/Components/Sidebar/Sidebar';
import React from 'react'

interface Props{
    children:React.ReactNode;
}
function ContentProvider({children}:Props) {
  return (
    <div className='relative'>
        <Sidebar/>
        <div className='mt-[8vh]'>{children}</div>
    </div>
  )
}

export default ContentProvider