"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useUserContext } from "@/context/userContext";
import { useSnippetContext } from "@/context/snippetsContext";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { copy, heart, heartOutline, pdf, edit, trash, bookmarkEmpty } from "@/utils/Icons";
import { formatDate } from "@/utils/dates";
import Link from "next/link";
import { ISnippet } from "@/types/types";

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
      return "/ruby.svg";
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

function SnippetPage() {
  const params = useParams();
  const fullId = params.id;
  
  // Extract only the MongoDB ID (last part after the last dash)
  const snippetId = typeof fullId === "string" 
    ? fullId.split("-").pop() 
    : fullId;
  
  const userId = useUserContext().user?._id;
  const { useBtnColorMemo, useTagColorMemo, deleteSnippet, likeSnippet } = useSnippetContext();
  const { openModalForEdit } = useGlobalContext();

  const router = useRouter();

  const [snippet, setSnippet] = useState<ISnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/snippet/public/${snippetId}`);
        const data = await response.json();
        setSnippet(data);
        setIsLiked(data.likedBy?.includes(userId));
        setLikeCount(data.likedBy?.length || 0);
      } catch (error) {
        console.error("Error fetching snippet:", error);
        toast.error("Failed to load snippet");
      } finally {
        setLoading(false);
      }
    };

    if (snippetId) {
      fetchSnippet();
    }
  }, [snippetId, userId]);

  const handleLike = async () => {
    if (!userId) {
      return router.push("/login");
    }

    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    await likeSnippet(snippet?._id);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(snippet?.code || "");
    toast.success("Code copied to clipboard");
  };

  const pdfConverter = async () => {
    try {
      const pdf_doc = new jsPDF();

      pdf_doc.setFontSize(16);
      pdf_doc.text(snippet?.title || "", 10, 10);

      pdf_doc.setFontSize(10);
      pdf_doc.text(`Author: ${snippet?.user?.name}`, 10, 20);
      pdf_doc.text(`Language: ${snippet?.language}`, 10, 25);
      pdf_doc.text(`Date: ${formatDate(snippet?.createdAt || "")}`, 10, 30);

      if (snippet?.description) {
        pdf_doc.setFontSize(12);
        pdf_doc.text("Description:", 10, 40);
        pdf_doc.setFontSize(10);
        const splitDescription = pdf_doc.splitTextToSize(snippet.description, 180);
        pdf_doc.text(splitDescription, 10, 45);
      }

      pdf_doc.setFontSize(12);
      pdf_doc.text("Code:", 10, 60);
      pdf_doc.setFontSize(8);
      pdf_doc.setFont("courier");
      const splitCode = pdf_doc.splitTextToSize(snippet?.code || "", 180);
      pdf_doc.text(splitCode, 10, 65);

      pdf_doc.save(`${snippet?.title?.replace(/\s+/g, "-")}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!snippet) return <div className="p-8 text-center">Snippet not found</div>;

  return (
    <div className="p-8 pt-24 max-w-6xl mx-auto">
      <div className="shadow-sm flex flex-col border-2 border-rgba-3 rounded-lg">
        {/* Header */}
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
                src={snippet?.user?.photo || "/image--user.png"}
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

            <button
              className="w-10 h-10 rounded-md text-green-400 text-lg flex items-center justify-center"
              style={{ background: useBtnColorMemo }}
              onClick={pdfConverter}
            >
              {pdf}
            </button>
          </div>
        </div>

        {/* Code Block */}
        <div>
          <SyntaxHighlighter
            language={snippet?.language}
            showLineNumbers={true}
            style={vs2015}
            customStyle={{
              fontSize: "1.2rem",
              background: "#181818",
              borderRadius: "0",
              minHeight: "500px",
              scrollbarWidth: "none",
              overflowX: "auto",
            }}
          >
            {snippet?.code}
          </SyntaxHighlighter>
        </div>

        {/* Footer */}
        <div className="flex-1 px-6 py-2 bg-4 rounded-b-lg border-t-2 border-rgba-3">
          <div className="flex justify-between gap-2">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <Image
                  src={languageLogo(snippet?.language) || "/logos/code.svg"}
                  width={20}
                  height={20}
                  alt="programming language"
                />
                <h2 className="text-xl font-semibold text-gray-300">
                  {snippet?.title}
                </h2>
              </div>
              <p className="pb-1 text-gray-400">{snippet?.description}</p>
            </div>
            <button
              className={`flex flex-col items-center text-2xl ${
                isLiked ? "text-red-500" : "text-gray-300"
              }`}
              onClick={handleLike}
            >
              <span>{isLiked ? heart : heartOutline}</span>
              <span className="text-sm font-bold text-gray-300">
                {likeCount === 0 ? 0 : likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            </button>
          </div>

          <div className="pt-2 pb-3 flex justify-between">
            <ul className="items-start flex gap-2 flex-wrap">
              {snippet?.tags?.map((tag) => (
                <li
                  key={tag._id}
                  className="tag-item px-4 py-1 border border-rgba-2 text-gray-300 rounded-md cursor-pointer"
                  style={{ background: useTagColorMemo }}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
            {snippet?.user?._id === userId && (
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
    </div>
  );
}

export default SnippetPage;