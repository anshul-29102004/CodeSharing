"use client"
import { useGlobalContext } from '@/context/globalContext'
import useDetectOutside from '@/hooks/useDetectOutside'
import { edit, plus } from '@/utils/Icons'
import React,{useRef} from 'react'

function AddSnippetModal() {

  const {modalMode,closeModal}=useGlobalContext()
  const ref=useRef<HTMLDivElement>(null)
  useDetectOutside({ref,callback:()=>{
    closeModal();

  }})
  return (
    <div className='fixed  top-0 left-0 z-40 h-full w-full bg-[#000]/30 backdrop-blur-sm bg-opacity-50 overflow-hidden'>
       <div ref={ref} 
       className='py-5 px-6 bg-bg-3 max-w-[920px] w-full flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md'>
        <form action="">
          <h1 className='text-white text-3xl font-bold'>
            {modalMode==="edit-snippet" ? (<span className='flex items-center gap-4'>{edit} Edit Snippet</span>)
            :(<span className='flex items-center gap-4'>{plus}Add Snippet</span>)}
          </h1>
        </form>

       </div>
    </div>
  )
}

export default AddSnippetModal