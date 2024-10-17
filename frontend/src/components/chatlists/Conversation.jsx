/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import useConversation from "@/zustand/useConversation";
import { useSocketContext } from "@/context/SocketContext";
import useGetMessages from "@/hooks/useGetMessages";

const Conversation = ({ conversations }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const { messages } = useGetMessages();
  
  const getLastMessage = (conversationId) => {
    // Filter messages for this conversation
    const conversationMessages = messages.filter(
      (message) => message.conversationId === conversationId
    );
    // Get the last message
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    return lastMessage?.message || "No messages yet";
  };

  return (
    <ScrollArea className="flex-1">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?._id === conversation._id;
        const isOnline = onlineUsers.includes(conversation._id);
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
                  {getLastMessage(conversation._id)}
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
};

export default Conversation;