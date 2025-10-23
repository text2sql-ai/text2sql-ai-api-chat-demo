import { NextRequest, NextResponse } from "next/server";

export interface Text2SQLRequest {
  prompt: string;
  runQuery?: boolean;
  limit?: number;
  conversationID?: string;
  mode?: "one-shot" | "conversational";
}

export interface Text2SQLResponse {
  output: string | null;
  explanation: string;
  results?: any[];
  runError?: string;
  conversationID: string;
}

const API_BASE_URL = process.env.TEXT2SQL_API_BASE_URL || "https://api.text2sql.ai";

export async function POST(request: NextRequest) {
  try {
    const body: Text2SQLRequest = await request.json();

    const API_KEY = process.env.TEXT2SQL_API_KEY;
    const CONNECTION_ID = process.env.TEXT2SQL_CONNECTION_ID;

    if (!API_KEY) {
      return NextResponse.json({ error: "TEXT2SQL_API_KEY is not configured" }, { status: 500 });
    }

    const requestBody = { ...body, connectionID: CONNECTION_ID, runQuery: true };

    const response = await fetch(`${API_BASE_URL}/api/external/generate-sql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Text2SQL API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!body.runQuery) {
      delete data.results;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Text2SQL API error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
