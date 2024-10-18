/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useConversation from "@/zustand/useConversation";
import { useSocketContext } from "@/context/SocketContext";

export default function Component({ conversations }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    const fetchLastMessages = async () => {
      const lastMessagesObj = {};
      for (const conversation of conversations) {
        try {
          const res = await fetch(`/api/messages/${conversation._id}`);
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          const lastMessage = data[data.length - 1];
          lastMessagesObj[conversation._id] = lastMessage ? lastMessage.message : "No messages yet";
        } catch (error) {
          console.error("Error fetching messages:", error);
          lastMessagesObj[conversation._id] = "Error fetching message";
        }
      }
      setLastMessages(lastMessagesObj);
    };

    fetchLastMessages();
  }, [conversations]);

  return (
    <ScrollArea className="flex-1">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?._id === conversation._id;
        const isOnline = onlineUsers.includes(conversation._id);
        const lastMessage = lastMessages[conversation._id] || "Loading...";

        return (
          <div
            key={conversation._id}
            className={`p-4 cursor-pointer hover:bg-zinc-800 ${
              isSelected ? "bg-zinc-800" : ""
            }`}
            onClick={() => setSelectedConversation(conversation)}
          >
            <div className="flex items-center space-x-4">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  src={conversation.profilePic}
                  alt={conversation.fullName}
                  className="aspect-square h-full w-full"
                />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{conversation.fullName}</p>
                <p className="text-xs text-zinc-400 truncate">
                  {lastMessage}
                </p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-zinc-600"
                }`}
              />
            </div>
          </div>
        );
      })}
    </ScrollArea>
  );
}