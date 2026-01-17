"use client"
import { useGlobalContext } from '@/context/globalContext'
import { useSnippetContext } from '@/context/snippetsContext'
import useDetectOutside from '@/hooks/useDetectOutside'
import { ITag } from '@/types/types'
import { edit, plus } from '@/utils/Icons'
import React,{useRef,useState} from 'react'



function AddSnippetModal() {

  const {modalMode,closeModal,useTagColorMemo}=useGlobalContext()
  const {createSnippet,tags}=useSnippetContext()
  const ref=useRef<HTMLDivElement>(null)
   
  const[activeTags,setActiveTags]=useState([]);
  const[title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const[code,setCode]=useState("")
  const[language,setLanguage]=useState("javascript")
  const[isPublic,setIsPublic]=useState(true);



  useDetectOutside({ref,callback:()=>{
    closeModal();

  }})

   const languages = [
    "c",
    "c#",
    "c++",
    "css",
    "django",
    "go",
    "haskell",
    "html",
    "java",
    "javascript",
    "json",
    "kotlin",
    "lua",
    "php",
    "python",
    "r",
    "ruby",
    "rust",
    "sql",
    "swift",
    "typescript",
  ];

const handleTags=(tag:{
  id:string;
  name:string;
})=>{
  const isTagActive=activeTags.some((activeTag:{
    _id:string;

  })=>{
    return activeTag._id===tag._id
  })
  if(isTagActive){
    setActiveTags(activeTags.filter((activeTag)=>{
     return activeTag._id!==tag._id;
    }))
  }
  else{
    setActiveTags([...activeTags,tag])
  }
}
  return (
    <div className='fixed  top-0 left-0 z-40 h-full w-full bg-[#000]/30 backdrop-blur-sm bg-opacity-50 overflow-hidden'>
       <div ref={ref} 
       className='py-5 px-6 bg-bg-3 max-w-[920px] w-full flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md'>
        <form action="" className='flex flex-col gap-4'>
          <h1 className='text-white text-3xl font-bold'>
            {modalMode==="edit-snippet" ? (<span className='flex items-center gap-4'>{edit} Edit Snippet</span>)
            :(<span className='flex items-center gap-4'>{plus}Add Snippet</span>)}
          </h1>

          <div className='flex justify-between gap-4'>
            <div className='flex-1 '>
              <input type="text"  name='title' value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='Title' className='w-full h-12 bg-bg-1 px-4 rounded-lg text-white' />
              

            </div>
            <div>
              <select name="language" value={language} onChange={(e)=>setLanguage(e.target.value)} className='w-full h-12 px-4 bg-[#252525] text-white rounded-lg cursor-pointer'
               >
                {languages.map((lang)=>{
                  return <option key={lang} value={language}>{lang}</option>
                })}
               </select>
            </div>

            <div>
              <select name="isPublic" value={isPublic.toString()} onChange={(e)=>setIsPublic(e.target.value==="true")} className='w-full h-12 px-r bg-[#252525] text-white rounded-lg cursor-pointer'>
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
            </div>
            </div>

            <div> 
              <textarea name="description" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Description' className='w-full pt-2 px-4 bg-[#252525] text-white rounded-lg' rows={2}></textarea>
            </div>

            <div>
              <pre>
                <code>
                  <textarea name="code" value={code} onChange={(e)=>setCode(e.target.value)} placeholder='Code here' className='w-full pt-2 h-[400px] px-4 bg-[#252525] text-white rounded-lg' ></textarea>
                </code>
              </pre>
            </div>

            <div className='flex flex-wrap gap-4 '>
              {tags.map((tag:ITag,index:number)=>{
                return <button key={index} type="button" className='py-1 text-white text-sm' 
                style={{
                  background:activeTags.some((activeTag:any)=>{
                    return activeTag._id===tag._id ? "#7263f3" : useTagColorMemo
                  })
                }}>
                  {tag.name}
                </button>
              })}

            </div>
        </form>

       </div>
    </div>
  )
}

export default AddSnippetModal