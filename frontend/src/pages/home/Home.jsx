/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { ChatList } from "../../components/chatlists/ChatList";
import { ChatWindow } from "../../components/chatwindow/ChatWindow";
import useConversation from "@/zustand/useConversation";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 w-full">
      <div className="w-full h-[95vh] sm:h-[85vh] flex flex-col sm:flex-row bg-black bg-opacity-60 text-zinc-100 rounded-lg overflow-hidden shadow-2xl">
        <ChatList />
        <ChatWindow/>
      </div>
    </div>
  );
}
