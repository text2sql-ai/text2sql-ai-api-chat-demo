import { useState } from "react";

export interface Text2SQLRequest {
  prompt: string;
  limit?: number;
  conversationID?: string;
  mode?: "one-shot" | "conversational";
  runQuery?: boolean;
}

export interface Text2SQLResponse {
  output: string | null;
  explanation: string;
  results?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  runError?: string;
  conversationID: string;
  databaseType?: string;
}

export function useText2SQL() {
  const [isLoading, setIsLoading] = useState(false);

  const generateSQL = async (request: Text2SQLRequest): Promise<Text2SQLResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/text2sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Text2SQL API error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateSQL,
    isLoading,
  };
}
