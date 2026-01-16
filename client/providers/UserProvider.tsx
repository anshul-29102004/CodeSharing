"use client"
import React from 'react'
import {UserContextProvider} from "../context/userContext.js"
import {SnippetsProvider} from "../context/snippetsContext.js"
import {GlobalProvider} from "../context/globalContext.js"
interface Props{
    children:React.ReactNode;
}

function UserProvider({children}:Props){
    return <UserContextProvider>
        <GlobalProvider>
         <SnippetsProvider>
           {children}
        </SnippetsProvider>
        </GlobalProvider>
       
       
    </UserContextProvider>
}

export default UserProvider