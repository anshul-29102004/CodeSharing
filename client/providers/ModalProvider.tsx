"use client";

import AddSnippetModal from "@/app/Components/Modals/AddSnippetModal";
import ProfileModal from "@/app/Components/Modals/ProfileModal";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";

function ModalProvider() {
  const { modalMode, isEditing } = useGlobalContext();
  return (
    <>
      {isEditing && <AddSnippetModal />}
      {modalMode === "profile" && <ProfileModal />}
    </>
  );
}

export default ModalProvider;