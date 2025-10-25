"use client";

import ChatInterface from "@/components/chat-interface";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <ChatInterface />
    </div>
  );
}
