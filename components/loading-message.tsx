import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const loadingPhrases = [
  "Analyzing your request",
  "Exploring the database",
  "Formulating SQL",
  "Validating Code",
  "Executing request",
  "Formatting Results",
];

export default function LoadingMessage() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cycle through phrases every 4 seconds
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length);
    }, 4000);

    return () => {
      clearInterval(phraseInterval);
    };
  }, []);

  // Scroll into view when component mounts
  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  return (
    <div ref={loadingRef} className="flex justify-start gap-3 sm:gap-4">
      <img className="size-6 sm:size-8 mt-2" src={"/logo_icon.svg"} alt="logo icon" />
      <div className="flex-1">
        <Card className="rounded-lg border-none bg-transparent animate-pulse py-3">
          <div className="min-h-6 text-sm sm:text-base text-white opacity-75 flex items-end gap-1">
            <span>{loadingPhrases[currentPhrase]}</span>
            <div className="flex space-x-1 pb-1">
              <div className="size-1 animate-bounce rounded-full bg-gray-500" />
              <div className="size-1 animate-bounce delay-200 rounded-full bg-gray-500" />
              <div className="size-1 animate-bounce delay-400 rounded-full bg-gray-500" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
