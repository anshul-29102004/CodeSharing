"use client";
import { useGlobalContext } from "@/context/globalContext";
import { useSnippetContext } from "@/context/snippetsContext";
import { useUserContext } from "@/context/userContext";
import useDetectOutside from "@/hooks/useDetectOutside";
import { gear, profile, signout } from "@/utils/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

function ProfileModal() {
  const { closeModal } = useGlobalContext();
  const { getPublicSnippets, getPopularSnippets, getLeaderboard } =
    useSnippetContext();
  const { logoutUser,user } = useUserContext();

  const ref = useRef(null);
  const router = useRouter();
  
  const userSlug = user?._id
    ? `${user.name?.toLowerCase().split(" ").join("-")}-${user._id}`
    : null;

  // close modal when clicked outside
  useDetectOutside({ ref, callback: closeModal });

  const menu = [
    {
      name:"My Profile",
      url: userSlug ? `/user/${userSlug}` : "/login",
      icon:profile,
      onClick:()=>{
        closeModal();
      router.push(userSlug ? `/user/${userSlug}` : "/login");
      }
    },
    {
      name: "Settings",
      url: "/profile/update",
      icon: gear,
      onClick: () => {
        closeModal();
        router.push("/profile/update");
      },
    },
    {
      name: "Sign Out",
      url: "/",
      icon: signout,
      onClick: () => {
        closeModal();
        getPublicSnippets();
        getPopularSnippets();
        getLeaderboard();
        logoutUser();
        router.push("/");
      },
    },
  ];
  return (
    <div
      ref={ref}
      className="u-shadow-1 fixed z-30 right-8 top-[4.2rem] bg-[#252525] rounded-lg border border-rgba(255,255,255,0.2)"
    >
      <nav>
        <ul className="py-1 min-w-[230px]">
          {menu.map((item, index) => (
            <li
              key={index}
              className="sidebar-nav-item my-[.3rem] px-8 py-[.6rem] cursor-pointer"
              onClick={item.onClick}
            >
              <Link
                href={item.url}
                className="grid grid-cols-[40px_1fr] items-center text-gray-200"
              >
                <span className="text-lg text-[#71717a]">{item.icon}</span>
                <span className="ml-2">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default ProfileModal;