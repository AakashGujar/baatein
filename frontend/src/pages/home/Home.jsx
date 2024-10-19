/* eslint-disable no-unused-vars */
import React from "react";
import { ChatList } from "../../components/chatlists/ChatList";
import { ChatWindow } from "../../components/chatwindow/ChatWindow";
import useConversation from "@/zustand/useConversation";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
      <div className="w-full h-full max-w-5xl max-h-[85vh] flex flex-col sm:flex-row bg-black bg-opacity-70 backdrop-blur-md text-zinc-100 rounded-lg overflow-hidden shadow-2xl">
        <ChatList />
        <ChatWindow />
      </div>
    </div>
  );
}
