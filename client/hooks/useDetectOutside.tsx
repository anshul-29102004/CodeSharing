import React, { useEffect } from "react";

interface UseDetectOutsideProps{
    ref:React.RefObject<HTMLDivElement>;
    callback:()=>void;
}

function useDetectOutside({ref,callback}:UseDetectOutsideProps){
    
    useEffect(()=>{
        const handleClickOutside=(event:MouseEvent)=>{
            if(ref.current && !ref.current.contains(event.target as Node)){
                callback()
            }

        }
        document.addEventListener("mousedown",handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown",handleClickOutside)

        }
    },[ref,callback])
      
    return ref;
}

export default useDetectOutside
