"use client"
import { ISnippet } from '@/types/types';
import React from 'react'

interface Props{
    snippet:ISnippet;
    height?:string;
}
function Snippet({snippet,height="400px"}:Props) {
  return (
    <div className='shadow-sm flex flex-col border-2 border-rgba-3 rounded-lg'>
        <div className='px-6 py-4 bg-bg-4 flex items-center justify-between rounded-t-lg border-b-2 border-rgba-3'></div>
        
    </div>
  )
}

export default Snippet