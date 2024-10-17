/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import useConversation from "@/zustand/useConversation";
import useSendMessage from "@/hooks/useSendMessage";
import useGetMessages from "@/hooks/useGetMessages";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import ChatForm from "./ChatForm";
import WelcomeMessage from "./WelcomeMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import MessageSkeleton from "../skeletons/MessageSkeleton";

export function ChatWindow() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { loading: sendingMessage, sendMessage } = useSendMessage();
  const { messages, loading: loadingMessages } = useGetMessages();
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex min-w-[660px]">
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader selectedConversation={selectedConversation} />
          <ScrollArea className="flex-1 p-4">
            {loadingMessages ? (
              <MessageSkeleton />
            ) : (
              messages.map((message) => (
                <Message key={message._id} message={message} />
              ))
            )}
          </ScrollArea>
          <Separator className="my-2" />
          <div className="p-4 flex w-full">
            <ChatForm
              message={message}
              setMessage={setMessage}
              handleSubmit={handleSubmit}
              loading={sendingMessage}
            />
          </div>
        </div>
      ) : (
        <WelcomeMessage />
      )}
    </div>
  );
}
