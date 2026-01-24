"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useUserContext } from "@/context/userContext";
import { useSnippetContext } from "@/context/snippetsContext";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { copy, heart, heartOutline, pdf, edit, trash, bookmarkEmpty, share, whatsapp, telegram, twitter, facebook, linkedin, email, ai } from "@/utils/Icons";
import { formatDate } from "@/utils/dates";
import Link from "next/link";
import { ISnippet } from "@/types/types";
import useDetectOutside from "@/hooks/useDetectOutside";

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
  const shareMenuRef = useRef(null);
  const aiMenuRef=useRef(null)

  const [snippet, setSnippet] = useState<ISnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareMenu,setShowShareMenu]=useState(false);
  const[showAiMenu,setShowAiMenu]=useState(false);
  const[aiLoading,setAiLoading]=useState(false)
  const[aiResponse,setAiResponse]=useState("")
  const[currentAction,setCurrentAction]=useState<string>("")
  const[optimizedCode,setOptimizedCode]=useState("")

  // Close share menu when clicking outside
  useDetectOutside({ ref: shareMenuRef, callback: () => setShowShareMenu(false) });
  // Close AI menu when clicking outside
  useDetectOutside({ ref: aiMenuRef, callback: () => setShowAiMenu(false) });

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

  const handleShare = (platform: string) => {
    const snippetText = `Check out this code snippet: ${snippet?.title}\n\nDescription: ${snippet?.description}\n\nCode:\n${snippet?.code}\n\nLanguage: ${snippet?.language}\n\nView more: ${window.location.href}`;
    
    const encodedText = encodeURIComponent(snippetText);
    const encodedTitle = encodeURIComponent(snippet?.title || "");
    const url = encodeURIComponent(window.location.href);
     switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodedText}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${url}&text=${encodedTitle}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${url}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedText}`;
        break;
    
    }
    setShowShareMenu(false);
  };
  
  const callAiFunction = async (action: string) => {
    if (!snippet?.code) {
      toast.error("No code to analyze");
      return;
    }

    setAiLoading(true);
    setShowAiMenu(false);
    setCurrentAction(action);

    try {
      const prompts = {
        explain: `Please explain the following code in simple terms:\n\n${snippet.code}`,
        bugs: `Find potential bugs and issues in this code:\n\n${snippet.code}`,
        optimize: `Suggest optimizations and improvements for this code:\n\n${snippet.code}`
      };

      const response = await fetch("http://localhost:8000/api/v1/analyzeSnippet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: snippet.code,
          language: snippet.language,
          action: action,
          prompt: prompts[action as keyof typeof prompts]
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAiResponse(data.response);
        
        // Extract code from response if it's optimize action
        if (action === "optimize") {
          const codeMatch = data.response.match(/```[\w]*\n([\s\S]*?)```/);
          if (codeMatch && codeMatch[1]) {
            setOptimizedCode(codeMatch[1].trim());
          } else {
            setOptimizedCode("");
          }
        } else {
          setOptimizedCode("");
        }
        
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} completed!`);
      } else {
        toast.error("Failed to get AI response");
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      toast.error("Failed to process request");
    } finally {
      setAiLoading(false);
    }
  };


  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!snippet) return <div className="p-8 text-center">Snippet not found</div>;

  const getPhotoUrl = (photo?: string) => {
    if (!photo) return "/image--user.png";
    if (photo.startsWith("http")) return photo;
    return `http://localhost:8000/uploads/${photo}`;
  };

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

            <button
              className="w-10 h-10 rounded-md text-green-400 text-lg flex items-center justify-center"
              style={{ background: useBtnColorMemo }}
              onClick={pdfConverter}
            >
              {pdf}
            </button>

            <div className="relative" ref={aiMenuRef}>
              <button className="w-10 h-10 rounded-md text-green-400 text-lg flex items-center justify-center"
            style={{background:useBtnColorMemo}}
            onClick={()=>setShowAiMenu(!showAiMenu)}
            title="AI Analysis">
              {ai}
            </button>
             {showAiMenu && (
                <div className="absolute right-0 top-12 bg-[#252525] border-2 border-rgba-3 rounded-lg shadow-lg z-50 min-w-[220px]">
                  <div className="py-2">
                    <p className="px-4 py-2 text-gray-400 text-sm font-semibold border-b border-rgba-3">
                      AI Features
                    </p>
                    
                    <button
                      onClick={() => callAiFunction("explain")}
                      disabled={aiLoading}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      <span className="text-xl">💡</span>
                      <span>{aiLoading ? "Processing..." : "Explain Code"}</span>
                    </button>

                    <button
                    onClick={() => callAiFunction("bugs")}
                      disabled={aiLoading}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      <span className="text-xl">🐛</span>
                      <span>{aiLoading ? "Processing..." : "Find Bugs"}</span>
                    </button>

                    <button
                      onClick={() => callAiFunction("optimize")}
                      disabled={aiLoading}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      <span className="text-xl">⚡</span>
                      <span>{aiLoading ? "Processing..." : "Optimize Code"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Share Button with Dropdown */}
            <div className="relative" ref={shareMenuRef}>
              <button
                className="w-10 h-10 rounded-md text-green-400 text-lg flex items-center justify-center"
                style={{background:useBtnColorMemo}}
                onClick={()=>setShowShareMenu(!showShareMenu)}
              >
                {share}
              </button>

              {/* Share Menu Dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 top-12 bg-[#252525] border-2 border-rgba-3 rounded-lg shadow-lg z-50 min-w-[200px]">
                  <div className="py-2">
                    <p className="px-4 py-2 text-gray-400 text-sm font-semibold border-b border-rgba-3">
                      Share via
                    </p>
                    
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3"
                    >
                      <span className="text-xl">{whatsapp}</span>
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleShare("telegram")}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3"
                    >
                      <span className="text-xl">{telegram}</span>
                      <span>Telegram</span>
                    </button>

                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3"
                    >
                      <span className="text-xl">{twitter}</span>
                      <span>Twitter</span>
                    </button>

                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3"
                    >
                      <span className="text-xl">{facebook}</span>
                      <span>Facebook</span>
                    </button>

                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3"
                    >
                      <span className="text-xl">{linkedin}</span>
                      <span>LinkedIn</span>
                    </button>

                    <button
                      onClick={() => handleShare("email")}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-all flex items-center gap-3"
                    >
                      <span className="text-xl">{email}</span>
                      <span>Email</span>
                    </button>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Block with Explanation */}
        <div className="flex gap-4 w-full bg-gray-950">
          {/* Left: Code */}
          <div className="flex-1">
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

          {/* Right: AI Response Box */}
          {aiResponse && (
            <div className="flex-1 bg-gray-900 border-l-2 p-4 overflow-y-auto" style={{maxHeight: "500px", borderColor: currentAction === "bugs" ? "#ef4444" : currentAction === "optimize" ? "#eab308" : "#22c55e"}}>
              {/* Optimize Code Block */}
              {currentAction === "optimize" && optimizedCode ? (
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-3 sticky top-0 bg-gray-900 pb-2">
                    <h3 className="text-lg font-bold text-yellow-400">⚡ Optimized Code</h3>
                    <button
                      onClick={() => {
                        setAiResponse("");
                        setCurrentAction("");
                        setOptimizedCode("");
                      }}
                      className="text-gray-400 hover:text-gray-200 text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto mb-2">
                    <SyntaxHighlighter
                      language={snippet?.language}
                      showLineNumbers={true}
                      style={vs2015}
                      customStyle={{
                        fontSize: "0.95rem",
                        background: "#1a1a1a",
                        borderRadius: "0.5rem",
                        scrollbarWidth: "none",
                        overflowX: "auto",
                      }}
                    >
                      {optimizedCode}
                    </SyntaxHighlighter>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(optimizedCode)}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-all"
                  >
                    📋 Copy Code
                  </button>
                </div>
              ) : (
                // Text Response
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-3 sticky top-0 bg-gray-900 pb-2">
                    <h3 className={`text-lg font-bold ${currentAction === "explain" ? "text-green-400" : currentAction === "bugs" ? "text-red-400" : "text-yellow-400"}`}>
                      {currentAction === "explain" && "💡 Explanation"}
                      {currentAction === "bugs" && "🐛 Bugs Found"}
                      {currentAction === "optimize" && "⚡ Optimizations"}
                    </h3>
                    <button
                      onClick={() => {
                        setAiResponse("");
                        setCurrentAction("");
                      }}
                      className="text-gray-400 hover:text-gray-200 text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto mb-2">
                    {aiResponse}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(aiResponse)}
                    className={`w-full px-4 py-2 text-white rounded transition-all ${
                      currentAction === "bugs" 
                        ? "bg-red-600 hover:bg-red-700" 
                        : currentAction === "optimize" 
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    📋 Copy
                  </button>
                </div>
              )}
            </div>
          )}
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