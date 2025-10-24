/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sql?: string;
  explanation?: string;
  results?: any[];
  runError?: string;
  databaseType?: string;
  resultsLimit?: number;
}
