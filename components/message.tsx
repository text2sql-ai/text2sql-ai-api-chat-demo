import { Card } from "@/components/ui/card";
import { useChatStore } from "@/store/chatStore";
import type { Message as MessageType } from "@/types/chat";
import { AlertCircle, CircleCheck, Copy, Database } from "lucide-react";
import Prism, { type Grammar } from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { format, type SqlLanguage } from "sql-formatter";
import { QueryResultsTable } from "./query-results-table";

interface MessageProps {
  message: MessageType;
}

const formatAndHighlightSQL = (code: string, dialect: string): string => {
  try {
    const finalDialect = dialect === "postgres" ? "postgresql" : dialect;
    const formattedCode = format(code, { language: finalDialect as SqlLanguage });
    const prismLanguage = Prism.languages[finalDialect] || (Prism.languages.sql as Grammar);
    return Prism.highlight(formattedCode, prismLanguage, finalDialect);
  } catch {
    return code;
  }
};

export default function Message({ message }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [scrollAreaWidth, setScrollAreaWidth] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);
  const { limit } = useChatStore();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const isUser = message.role === "user";

  const highlightedCode = useMemo(
    () => formatAndHighlightSQL(String(message.sql).replace(/\n$/, ""), message.databaseType || "postgresql"),
    [message.sql, message.databaseType]
  );

  // Auto-scroll to new messages
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  // Auto-scroll when results are updated
  useEffect(() => {
    if (message.results && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [message.results]);

  // Calculate scroll area width and handle resize
  useEffect(() => {
    const updateWidth = () => {
      const scrollArea = document.querySelector(".scroll-area");
      if (scrollArea) {
        setScrollAreaWidth(scrollArea.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div
      ref={messageRef}
      className={`flex ${isUser ? "justify-end" : "justify-start"} ${!isUser ? "gap-2 sm:gap-3" : ""}`}
    >
      {!isUser && <img className="size-6 sm:size-8 mt-2" src={"/logo_icon.svg"} alt="logo icon" />}
      <div className={!isUser ? "flex-1" : ""}>
        <Card
          style={{
            maxWidth: scrollAreaWidth > 0 ? `${scrollAreaWidth * 0.8}px` : "90vw",
          }}
          className={`py-3 px-3 sm:px-4 rounded-lg border-none ${
            isUser ? "bg-purple-600/20" : "bg-white/5 border-white/10"
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm sm:text-base text-white">{message.content}</div>

            {message.sql && (
              <div className="mt-2 sm:mt-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1 sm:gap-2">
                      <Database size={12} className="sm:w-3.5 sm:h-3.5" />
                      Generated SQL
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <button
                      onClick={() => copyToClipboard(message.sql!)}
                      className="cursor-pointer text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      {copied ? (
                        <CircleCheck size={12} className="sm:w-3.5 sm:h-3.5" />
                      ) : (
                        <Copy size={12} className="sm:w-3.5 sm:h-3.5" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <pre
                  className="p-4 mb-2 mt-0 overflow-y-auto rounded-md rounded-tr-none bg-gray-900 text-sm text-white"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </div>
            )}

            {message.results && (
              <div className="mt-2 sm:mt-3">
                <QueryResultsTable rows={message.results} limit={limit} actualLimit={message.resultsLimit} />
              </div>
            )}

            {message.runError && (
              <div className="mt-2 sm:mt-3">
                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                  <AlertCircle size={12} className="text-red-400 sm:w-3.5 sm:h-3.5" />
                  <span className="text-xs sm:text-sm font-medium text-red-400">Query Error</span>
                </div>
                <div className="bg-red-900/20 p-2 sm:p-3 rounded-lg border border-red-500/30">
                  <pre className="text-xs sm:text-sm text-red-300 max-w-full">{message.runError}</pre>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
