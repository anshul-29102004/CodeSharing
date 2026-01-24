"use client";
import { useUserContext } from "@/context/userContext";
import { envelope, github, linkedin } from "@/utils/Icons";
import Image from "next/image";
import React from "react";
import Link from 'next/link'

function page() {
  const { user, updateUser, changePassword, userState, handlerUserInput } =
    useUserContext();

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const[photoPreview,setPhotoPreview]=React.useState(user?.photo);

  const imageBase = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
  const getPhotoUrl = (photo?: string) => {
    if (!photo) return "/image--user.png";
    if (photo.startsWith("http") || photo.startsWith("data:")) return photo;
    const safeName = encodeURIComponent(photo);
    return `${imageBase}/uploads/${safeName}`;
  };

  const handlePasswordChange = async (e: any) => {
    if (e.target.name === "oldPassword") {
      setOldPassword(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the photo
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Add file to userState for upload
      handlerUserInput("photo")(e);
    }
  };

  return (
    <main className="h-[90vh] relative flex justify-center items-center">
      <Link href="/" className="absolute top-4 left-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-500/70 transition-all duration-300 ease-in-out">
      Home
      </Link>
      <form
        action=""
        className="u-shadow-2 px-8 mx-8 my-8 py-6 bg-[#252525] rounded-lg max-w-[1200px] w-full"
        onSubmit={(e) => {
          e.preventDefault();
          updateUser(e, userState);
        }}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="file-upload" className="text-gray-200">
            Add Profile Picture
          </label>
          <div>
            <label
              htmlFor="file-upload"
              className="py-4 flex items-center justify-center border-2 border-dashed border-rgba(255,255,255,0.1) rounded-lg cursor-pointer"
            >
              <Image
                width={100}
                height={100}
                src={getPhotoUrl(photoPreview as string || user?.photo)}
                alt="profile picture"
                className="rounded-lg"
              />
            </label>
            <input id="file-upload" type="file" className="hidden"  accept="image/*" onChange={handlePhotoChange}/>
          </div>

          <label htmlFor="github" className="mt-4 text-gray-300">
            Add Social Links
          </label>

          <div className="flex-1 grid gap-4 grid-cols-[repeat(auto-fill,minmax(290px,1fr))]">
            <div className="relative w-full">
              <label
                htmlFor="github"
                className="absolute top-[50%] left-[1rem] translate-y-[-50%] text-gray-200 text-2xl"
              >
                {github}
              </label>

              <input
                id="github"
                name="github"
                type="text"
                defaultValue={user?.github}
                onChange={(e) => handlerUserInput("github")(e)}
                placeholder="Github"
                className="w-full py-[.8rem] pl-[3.2rem] pr-[1rem] text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none"
              />
            </div>

            <div className="relative w-full">
              <label
                htmlFor="linkedin"
                className="absolute top-[50%] left-[1rem] translate-y-[-50%] text-gray-200 text-2xl"
              >
                {linkedin}
              </label>

              <input
                id="linkedin"
                name="linkedin"
                type="text"
                defaultValue={user?.linkedin}
                onChange={(e) => handlerUserInput("linkedin")(e)}
                placeholder="Linkedin"
                className="w-full py-[.8rem] pl-[3.2rem] pr-[1rem] text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none"
              />
            </div>
            <div className="relative w-full">
              <label
                htmlFor="publicEmail"
                className="absolute top-[50%] left-[1rem] translate-y-[-50%] text-gray-200 text-2xl"
              >
                {envelope}
              </label>

              <input
                id="publicEmail"
                name="publicEmail"
                type="email"
                defaultValue={user?.publicEmail}
                onChange={(e) => handlerUserInput("publicEmail")(e)}
                placeholder="Public Email"
                className="w-full py-[.8rem] pl-[3.2rem] pr-[1rem] text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none"
              />
            </div>
          </div>

          <div className="w-full mt-4 flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="name" className="text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name}
                onChange={(e) => handlerUserInput("name")(e)}
                className="w-full py-[.8rem] pl-4 pr-1 text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none focus:border-[#6fcf97]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="name" className="text-gray-300">
                Private Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user?.email}
                onChange={(e) => handlerUserInput("email")(e)}
                className="w-full py-[.8rem] pl-4 pr-1 text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none focus:border-[#6fcf97]"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="bio" className="text-gray-300">
                Add Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={user?.bio}
                onChange={(e) => handlerUserInput("bio")(e)}
                className="w-full py-4 pl-4 pr-1 text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none focus:border-[#6fcf97] resize-none"
              />
            </div>

            <div className="w-full mt-4 flex gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="oldPassword" className="text-gray-300">
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={handlePasswordChange}
                  name="oldPassword"
                  className="w-full py-[.8rem] pl-4 pr-1 text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none focus:border-[#6fcf97]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label htmlFor="newPassword" className="text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  name="newPassword"
                  className="w-full py-[.8rem] pl-4 pr-1 text-gray-200 bg-transparent border-[2px] border-rgba(255,255,255,0.1) rounded-md outline-none focus:border-[#6fcf97]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <button
            type="button"
            className="py-4 px-8 mt-4 h-[50px] flex justify-center items-center font-medium bg-red-500 text-white rounded-md hover:bg-red-500/50
            transition-all duration-300 ease-in-out"
            onClick={() => changePassword(oldPassword, newPassword)}
          >
            Update Password
          </button>
          <button
            type="submit"
            className="py-4 px-8 mt-4 h-[50px] flex justify-center items-center font-medium bg-blue-500 text-white rounded-md
            hover:bg-blue-500/70 transition-all duration-300 ease-in-out"
          >
            Update Profile
          </button>
        </div>
      </form>
    </main>
  );
}

export default page;