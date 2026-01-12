import React, {  createContext, useContext,useEffect,useState } from 'react'
import axios from 'axios'
const SnippetsContext=createContext();


export const SnippetsProvider=({children})=>{
 
 const serverUrl="http://localhost:8000/api/v1"
  const[publicSnippets,setPublicSnippets]=useState([])

  const getPublicSnippets=async(userId,tagId,searchQuery,page,limit)=>{
    try {
        const queryParams=new URLSearchParams();
        if(userId){
            queryParams.append("userId",userId)
        }
        if(tagId)
        {
            queryParams.append("tagId",tagId)
        }
        if(searchQuery)
        {
            queryParams.append("searchQuery",searchQuery)
        }
        if(page)
        {
            queryParams.append("page",page)
        }
        const res=await axios.get(`${serverUrl}/snippets/public?${queryParams.toString()}`)
        if(res.data && res.data.snippets){
            setPublicSnippets(res.data.snippets)
            return res.data.snippets;
        }
        else
        {
            console.log("No snippets found")
            return res.data.snippets
        }
    } catch (error) {
        console.log("Error fetching public snippets",error)
        return [];

    }
  }

  useEffect(()=>{
    getPublicSnippets()
  },[])

    return (
        <SnippetsContext.Provider value={{
          publicSnippets,



        }}>
            {children}
        </SnippetsContext.Provider>
    )
}

export const useSnippetContext=()=>{
    return useContext(SnippetsContext);
}