"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Snippet from "@/app/Components/Snippet/Snippet";
import { useSnippetContext } from "@/context/snippetsContext";
import { useUserContext } from "@/context/userContext";
import { ISnippet, IUser } from "@/types/types";
import { joinedOn } from "@/utils/dates";
import { envelope, github, linkedin } from "@/utils/Icons";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function page({ params }: Props) {
  const { id } = React.use(params);
  const { getUserById } = useUserContext();
  const { getPublicSnippets } = useSnippetContext();

  const [creatorDetails, setCreatorDetails] = React.useState({} as IUser);
  const [snippets, setSnippets] = React.useState<ISnippet[]>([]);

  const imageBase = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
  const getPhotoUrl = (photo?: string) => {
    if (!photo) return "/image--user.png";
    if (photo.startsWith("http") || photo.startsWith("data:")) return photo;
    const safeName = encodeURIComponent(photo);
    return `${imageBase}/uploads/${safeName}`;
  };

  // get creator id from url
  const creatorId = id.split("-").at(-1);

  useEffect(() => {
    (async () => {
      try {
        const userDetails = await getUserById(creatorId);
        setCreatorDetails(userDetails);
      } catch (error) {
        console.log("Error fetching creator details", error);
      }
    })();
  }, [creatorId]);

  useEffect(() => {
    if (creatorId) {
      (async () => {
        try {
          const res = await getPublicSnippets(creatorId);
          setSnippets(res);
        } catch (error) {
          console.log("Error fetching snippets", error);
        }
      })();
    }
  }, [creatorId]);

  return (
    <main className="p-8">
      {/* ================= TOP PROFILE SECTION (UPDATED) ================= */}
      <section className="py-10 px-[12rem] bg-[#212121] rounded-lg">
        <div className="flex flex-col items-center text-center">
          {/* USER IMAGE */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#6FCF97] mb-4">
            <Image
              src={getPhotoUrl(creatorDetails?.photo)}
              alt="user profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#6FCF97]">
            {creatorDetails?.name}
          </h1>
          <p className="text-gray-400">
            Joined {joinedOn(creatorDetails?.createdAt)}
          </p>
        </div>

        <div className="mt-12 flex justify-between gap-14">
          {/* BIO */}
          <div>
            <h3 className="text-lg font-bold">User Bio</h3>
            <p className="text-gray-400">{creatorDetails?.bio}</p>
          </div>

          {/* SOCIAL LINKS */}
          <div className="px-16 py-8 bg-[#252525] flex flex-col gap-6 rounded-lg text-lg text-gray-300">
            <Link
              target="_blank"
              href={creatorDetails?.github || "https://github.com"}
              className="grid grid-cols-[40px_1fr] items-center pr-[5rem]"
            >
              <span className="text-2xl">{github}</span>
              <span>GitHub</span>
            </Link>

            <Link
              target="_blank"
              href={creatorDetails?.linkedin || "https://linkedin.com"}
              className="grid grid-cols-[40px_1fr] items-center pr-[5rem]"
            >
              <span className="text-2xl">{linkedin}</span>
              <span>LinkedIn</span>
            </Link>

            <Link
              target="_blank"
              href={`mailto:${creatorDetails?.publicEmail}`}
              className="grid grid-cols-[40px_1fr] items-center pr-[5rem]"
            >
              <span className="text-2xl">{envelope}</span>
              <span>Email</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SNIPPETS SECTION (UNCHANGED) ================= */}
      <section>
        <h1 className="text-center text-2xl font-bold mt-12">
          Snippets created by{" "}
          <span className="text-3xl font-bold text-[#6FCF97]">
            {creatorDetails?.name}
          </span>
        </h1>

        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {snippets.map((snippet: ISnippet) => (
            <Snippet key={snippet._id} snippet={snippet} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default page; 