"use client"
import { useSnippetContext } from '@/context/snippetsContext';
import { ISnippet } from '@/types/types';
import React, { useEffect, useState } from 'react'

interface Props{
    params:{
        id:string;
    }
}



function page({params:{id}}:Props) {
    const {getPublicSnippetById}=useSnippetContext()
    const snippetId=id.split('-').at(-1)
    const[snippet,setSnippet]=useState({} as ISnippet)
    useEffect(()=>{
    (
        async()=>{
            const res=await getPublicSnippetById(snippetId)
            setSnippet(res)
        }
    )()
    },[snippetId])
  return (
    <main className='p-88'>{
    }</main>
  )
}

export default page