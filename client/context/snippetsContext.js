import React, {  createContext, useContext,useEffect,useState } from 'react'
import axios from 'axios'
import { useMemo } from "react";
import { useGlobalContext } from './globalContext';

const SnippetsContext=createContext();


export const SnippetsProvider=({children})=>{

  const {closeModal}=useGlobalContext()
 
 const serverUrl="http://localhost:8000/api/v1"
  const[publicSnippets,setPublicSnippets]=useState([])
  const [tags,setTags]=useState([])
  const createSnippet=async(data)=>{

    
    try {
      const res=await axios.post(`${serverUrl}/create-snippet`,data)
      setPublicSnippets([res.data,...publicSnippets])
      // getPublicSnippets()
      toast.sucess("Snippet created successfully")
      closeModal();

    } catch (error) {
      console.log("Error creating snippet",error);
    }
  }

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
  
  const getTags=async()=>{
    try {
      const res=await axios.get(`${serverUrl}/tags`)
      setTags(res.data)
    } catch (error) {
      console.log("Error fetching tags",error);
    }
  }


  const gradients = {
    buttonGradient1:
      "linear-gradient(110.42deg, rgba(107, 190, 146, 0.1) 29.2%, rgba(245, 102, 146, 0.1) 63.56%)",
    buttonGradient2:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient3:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient4:
      "linear-gradient(110.42deg, rgba(168, 85, 247, 0.1) 29.2%, rgba(245, 102, 146, 0.1) 63.56%)",
    buttonGradient5:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient6:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient7:
      "linear-gradient(110.42deg, rgba(41, 25, 222, 0.1) 29.2%, rgba(235, 87, 87, 0.1) 63.56%)",
    buttonGradient8:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient9:
      "linear-gradient(110.42deg, rgba(226, 195, 33, 0.1) 29.2%, rgba(247, 104, 85, 0.1) 63.56%)",
    buttonGradient10:
      "linear-gradient(110.42deg, rgba(235, 87, 87, 0.1) 29.2%, rgba(189, 68, 166, 0.1) 53.82%, rgba(247, 85, 143, 0.1) 63.56%)",
    buttonGradient11:
      "linear-gradient(110.42deg, rgba(25, 151, 222, 0.1) 29.2%, rgba(168, 85, 247, 0.1) 63.56%)",
    buttonGradient12:
      "linear-gradient(110.42deg, rgba(226, 195, 33, 0.1) 29.2%, rgba(247, 104, 85, 0.1) 63.56%)",
    buttonGradient13:
      "linear-gradient(110.42deg, rgba(226, 195, 33, 0.1) 29.2%, rgba(99, 3, 255, 0.1) 63.56%)",
    buttonGradient14:
      "linear-gradient(110.42deg, rgba(41, 25, 222, 0.1) 29.2%, rgba(235, 87, 87, 0.1) 63.56%)",
  };

  const randomButtonColor=Object.values(gradients)[Math.floor(Math.random()*Object.values(gradients).length)]
    const randomTagColor=Object.values(gradients)[Math.floor(Math.random()*Object.values(gradients).length)]
  
    const useBtnColorMemo=useMemo(()=>randomButtonColor,[]);
    const useTagColorMemo=useMemo(()=>randomTagColor,[]);
  
    useEffect(()=>{
    getPublicSnippets(),
    getTags()
    
  },[])

    return (
        <SnippetsContext.Provider value={{
          publicSnippets,
          getPublicSnippets,
          useBtnColorMemo,
          useTagColorMemo,
          createSnippet,
          getTags,



        }}>
            {children}
        </SnippetsContext.Provider>
    )
}

export const useSnippetContext=()=>{
    return useContext(SnippetsContext);
}