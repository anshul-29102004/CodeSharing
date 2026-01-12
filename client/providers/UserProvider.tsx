"use client"
import React from 'react'
import {UserContextProvider} from "../context/userContext.js"
import {SnippetsProvider} from "../context/snippetsContext.js"

interface Props{
    children:React.ReactNode;
}

function UserProvider({children}:Props){
    return <UserContextProvider>
        <SnippetsProvider>
           {children}
        </SnippetsProvider>
       
    </UserContextProvider>
}

export default UserProvider