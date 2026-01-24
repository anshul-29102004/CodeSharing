"use client";
import React, { useEffect } from "react";
import { useSnippetContext } from "@/context/snippetsContext";
import { ISnippet } from "@/types/types";
import { formatDate } from "@/utils/dates";
import {
  bookmarkEmpty,
  copy,
  edit,
  heart,
  heartOutline,
  pdf,
  trash,
} from "@/utils/Icons";
import Image from "next/image";
import Link from "next/link";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useUserContext } from "@/context/userContext";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter } from "nextjs-toploader/app";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

interface Props {
  snippet: ISnippet;
  height?: string;
}

const languageLogo = (language: string) => {
  switch (language) {
    case "c":
      return "/logos/c.png";
    case "c#":
      return "/logos/csharp.svg";
    case "c++":
      return "/logos/cpp.svg";
    case "css":
      return "/logos/css.svg";
    case "django":
      return "/logos/django.svg";
    case "go":
      return "/logos/go.svg";
    case "html":
      return "/logos/html.svg";
    case "java":
      return "/logos/java.svg";
    case "javascript":
      return "/logos/javascript.svg";
    case "json":
      return "/logos/json.svg";
    case "kotlin":
      return "/logos/kotlin.svg";
    case "lua":
      return "/logos/lua.svg";
    case "php":
      return "/logos/php.svg";
    case "python":
      return "/logos/python.svg";
    case "r":
      return "/logos/r.svg";
    case "ruby":
      return "/logos/ruby.svg";
    case "rust":
      return "/logos/rust.svg";
    case "sql":
      return "/logos/sql.svg";
    case "swift":
      return "/logos/swift.svg";
    case "typescript":
      return "/logos/typescript.svg";
    default:
      return "/logos/code.svg";
  }
};

function Snippet({ snippet, height = "400px" }: Props) {
  const userId = useUserContext().user?._id;
  const {
    useBtnColorMemo,
    useTagColorMemo,
    deleteSnippet,
    likeSnippet,
    getPublicSnippets,
  } = useSnippetContext();
  const { openModalForEdit } = useGlobalContext();

  const router = useRouter();

  // check if current user has liked the snippet
  const [isLiked, setIsLiked] = React.useState(
    snippet.likedBy.includes(userId)
  );
  const [likeCount, setLikeCount] = React.useState(snippet.likedBy.length);
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const codeString = `${snippet?.code}`;

  const imageBase = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
  const getPhotoUrl = (photo?: string) => {
    if (!photo) return "/image--user.png";
    if (photo.startsWith("http") || photo.startsWith("data:")) return photo;
    const safeName = encodeURIComponent(photo);
    return `${imageBase}/uploads/${safeName}`;
  };

  useEffect(() => {
    if (activeTag) {
      getPublicSnippets("", activeTag);
    }
  }, [activeTag]);

  // handle like/unlike snippet
  const handleLike = async () => {
    if (!userId) {
      return router.push("/login");
    }

    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    await likeSnippet(snippet._id);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeString);
    toast.success("Code copied to clipboard");
  };
 
  const pdfConverter=async()=>{
   try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(snippet.title, 10, 10);
      
      // Add metadata
      pdf.setFontSize(10);
      pdf.text(`Author: ${snippet.user.name}`, 10, 20);
      pdf.text(`Language: ${snippet.language}`, 10, 25);
      pdf.text(`Date: ${formatDate(snippet.createdAt)}`, 10, 30);
      
      // Add description
      if (snippet.description) {
        pdf.setFontSize(12);
        pdf.text("Description:", 10, 40);
        pdf.setFontSize(10);
        const splitDescription = pdf.splitTextToSize(snippet.description, 180);
          pdf.text(splitDescription, 10, 45);
      }
      
      // Add code
      pdf.setFontSize(12);
      pdf.text("Code:", 10, 60);
      pdf.setFontSize(8);
      pdf.setFont("courier");
      const splitCode = pdf.splitTextToSize(codeString, 180);
      pdf.text(splitCode, 10, 65);
      
      // Download PDF
       pdf.save(`${snippet.title.replace(/\s+/g, '-')}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  return (
    <div className="shadow-sm flex flex-col border-2 border-rgba-3 rounded-lg">
      <div className="px-6 py-4 bg-4 flex items-center justify-between rounded-t-lg border-b-2 border-rgba-3">
        <Link
          href={`/user/${snippet?.user?.name
            ?.toLowerCase()
            .split(" ")
            .join("-")}-${snippet?.user?._id}`}
          className="group transition-all ease-in-out duration-200"
        >
          <div className="flex items-center">
            <Image
              src={getPhotoUrl(snippet?.user?.photo)}
              alt="user"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h3 className="ml-2 text-gray-300 font-semibold group-hover:text-green-400">
              <span className="group-hover:underline transition-all ease-in-out duration-200">
                {snippet?.user?.name}
              </span>
              <span className="text-sm text-gray-400 font-normal group-hover:text-green-400 group-hover:underline transition-all ease-in-out duration-200">
                , {formatDate(snippet?.createdAt)}
              </span>
            </h3>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-gray-200">
          <button
            className="w-10 h-10 rounded-md text-green-400 text-lg flex items-center justify-center"
            style={{ background: useBtnColorMemo }}
            onClick={copyToClipboard}
          >
            {copy}
          </button>
          
        <button className="w-10 h-10 rounded-md text-green-400 text-lg items-center justify-between"
          style={{background:useBtnColorMemo}}
          onClick={pdfConverter}>
            
            {pdf}
            </button>
        </div>
      </div>

      <div>
        <SyntaxHighlighter
          language={snippet?.language}
          showLineNumbers={true}
          style={vs2015}
          customStyle={{
            fontSize: "1.2rem",
            background: "#181818",
            borderRadius: "0 0 6px 6px",
            height: height,
            scrollbarWidth: "none",
            overflowX: "scroll",
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>

      <div className="flex-1 px-6 py-2 bg-4 rounded-b-lg border-t-2 border-rgba-3">
        <div className="flex justify-between gap-2">
          <div className="flex-1 flex flex-col">
            <Link
              href={`/snippet/${snippet?.title
                .toLowerCase()
                .split(" ")
                .join("-")}-${snippet?._id}`}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={languageLogo(snippet?.language) || "/logos/code.svg"}
                  width={20}
                  height={20}
                  alt="programming language"
                />
                <h2 className="text-xl font-semibold text-gray-300 cursor-pointer hover:text-green-400 hover:underline transition-all ease-in-out duration-300">
                  {snippet?.title}
                </h2>
              </div>
            </Link>
            <p className="pb-1 text-gray-400">{snippet?.description}</p>
          </div>
          <button
            className={`flex flex-col items-center text-2xl text-gray-300 ${
              isLiked ? "text-red-500" : "text-gray-300"
            }`}
            onClick={handleLike}
          >
            <span>{isLiked ? heart : heartOutline}</span>
            <span className="text-sm font-bold text-gray-300">
              {likeCount === 0 ? 0 : likeCount}{" "}
              {likeCount === 1 ? "like" : "likes"}
            </span>
          </button>
        </div>
        <div className="pt-2 pb-3 flex justify-between">
          <ul className="items-start flex gap-2 flex-wrap">
            {snippet?.tags.map((tag) => {
              return (
                <li
                  key={tag._id}
                  className="tag-item px-4 py-1 border border-rgba-2 text-gray-300 rounded-md cursor-pointer"
                  style={{ background: useTagColorMemo }}
                  onClick={() => setActiveTag(tag._id)}
                >
                  {tag.name}
                </li>
              );
            })}
          </ul>
          {snippet.user?._id === userId && (
            <div className="flex gap-2">
              <button
                className="w-10 h-10 flex items-center justify-center text-blue-400 text-xl rounded-md"
                style={{ background: useBtnColorMemo }}
                onClick={() => openModalForEdit(snippet)}
              >
                {edit}
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center text-red-500 text-xl rounded-md"
                style={{ background: useBtnColorMemo }}
                onClick={() => deleteSnippet(snippet._id)}
              >
                {trash}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Snippet;