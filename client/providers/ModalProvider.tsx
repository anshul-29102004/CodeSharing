"use client"
import AddSnippetModal from '@/app/Components/Modals/AddSnippetModal';
import { useGlobalContext } from '@/context/globalContext'
import React from 'react'

function ModalProvider() {
    const{modalMode,isEditing}=useGlobalContext();
  return (
    <> {isEditing && <AddSnippetModal/>} </>
     
    
  )
}

export default ModalProvider