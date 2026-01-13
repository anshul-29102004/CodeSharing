"use client"
import React from 'react'
import { ISnippet, ITag } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from "@/utils/dates";
import { bookmarkEmpty, copy, heart, heartOutline } from '@/utils/Icons';
import { useSnippetContext } from '@/context/snippetsContext';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {vs2015} from "react-syntax-highlighter/dist/esm/styles/hljs"

interface Props{
    snippet:ISnippet;
    height?:string;
}
function Snippet({snippet,height="400px"}:Props) {
  const {useBtnColorMemo,useTagColorMemo}=useSnippetContext()
  const codeString=`${snippet?.code}`
  return (
    <div className='shadow-sm flex flex-col border-2 border-rgba-3 rounded-lg'>
        <div className='px-6 py-4 bg-bg-4 flex items-center justify-between rounded-t-lg border-b-2 border-rgba-3'>
          <Link href={`/user/${snippet?.user?.name?.toLowerCase().split(" ").join("-")}-${snippet?.user?._id}`} 
          className='group transiton-all ease-in-out duration-200 '>
          <div className='flex items-center'>
            <Image src={snippet?.user?.photo || "/image--useruser.png"} alt="user" width={40} height={40} className='rounded-full'></Image>
            <h3 className='ml-2 text-gray-300 font-semibold group-hover:text-green-400'>
              <span className='group-hover:underline transition-all ease-in-out duration-200'>{snippet?.user?.name}</span>
              <span className='text-sm text-gray-400 font-normal group-hover:text-green-400 group-hover:underline transition-all ease-in-out duration-200'>,{formatDate(snippet?.createdAt)}</span>
            </h3>
            </div>
            </Link>
            <div className='flex items-center gap-2 text-gray-200'>
              <button className='w-10 h-10 rounded-md text-green-400 text-lg flex items-center justify-center'
              style={{background:useBtnColorMemo}}>{copy}</button>
              <button className='w-10 h-10 rounded-md text-green-400 text-lg flex items-center justify-center'
              style={{background:useTagColorMemo}}>{bookmarkEmpty}</button>
            </div>
        </div>

        <div>
          <SyntaxHighlighter 
          language={snippet?.language}
          showLineNumbers={true}
          style={vs2015}
          customStyle={{
            fontSize:"1.2rem",
            background:"#181818",
            borderRadius:"0 0 6px 6px",
            height:height,
            scrollbarWidth:"none",
            overflowX:"scroll",
          }}
          >
            
            {codeString}
          </SyntaxHighlighter>
        </div>

        <div className='flex-1 px-6 py-2 bg-bg-4 rounded-b-lg border-t-2 border-rgba-3'>
          <div className='flex justify-between gap-2'>
             <div className='flex-1 flex flex-col'>
              <Link href={`/snippet/${snippet?.title.toLowerCase().split(" ").join("-")}-${snippet?._id}`}>
              <div className='flex items-center gap-2'>
                <Image src={snippet?.user?.photo || "/image--useruser.png"} width={20} height={20} className='rounded-full' alt="user"></Image>
                <h2 className='text-xl font-semibold text-gray-300 cursor-pointer hover:text-green-400 hover:underline transition-all ease-in-out duration-300'>{snippet?.title}</h2>
                </div>
                </Link>
                <p className='pb-1 text-gray-400'>
                  {snippet?.description}
                </p>

              <button className={`flex flex-col items-center text-2xl text-gray-300`}>
                <span>{heartOutline}</span>
                <span className='text-sm font-bold text-gray-300'>
                  0 likes
                </span>
              </button>
             </div>
          </div>
          <div className='pt-2 pb-3 flex justify-between '>
            <ul className='items-start flex gap-2 flex-wrap'>
              {snippet?.tags.map((tag)=>{
                return <li className='tag-item px-4 py-1 border border-rgba-2 text-gray-300 rounded-md cursor-pointer '
                style={{background:useTagColorMemo}}
                >{tag.name}</li>
              })}

            </ul>

          </div>

        </div>
        
    </div>
  )
}

export default Snippet