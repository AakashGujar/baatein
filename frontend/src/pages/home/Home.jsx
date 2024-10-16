/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { ChatList } from "../../components/ChatList";
import { ChatWindow } from "../../components/ChatWindow";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState("1");

  return (
    <div className="flex items-center justify-center min-h-screen p-4 w-full">
      <div className="w-full max-w-full h-[85vh] flex flex-col md:flex-row bg-black bg-opacity-60 text-zinc-100 rounded-lg overflow-hidden shadow-2xl">
        <ChatList />
        <ChatWindow />
      </div>
    </div>
  );
}
