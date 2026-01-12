"use client"

import { useSnippetContext } from "@/context/snippetsContext"
import { ISnippet } from "@/types/types"
import Snippet from "./Components/Snippet/Snippet"


export default function Home(){
   const {publicSnippets}=useSnippetContext()
   
  
  return <div className="">
    <div className={`px-8 pt-[6.5rem] pb-8 grid grid-cols-1 lg:grid-cols-2 gap-6`}>
      {publicSnippets.map((snippet:ISnippet)=>{
        return <Snippet key={snippet._id} snippet={snippet}/>
      })}
    </div>

  </div>
}