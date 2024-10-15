/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MoreVertical,
  Phone,
  Send,
  Video,
  MessageSquareDashed,
} from "lucide-react";
import { getProfilePic } from "../utils/getProfilePic";
import useConversation from "@/zustand/useConversation";
import useSendMessage from "@/hooks/useSendMessage";

const ChatHeader = ({ selectedConversation, selectedUserData }) => (
  <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <img
          src={selectedConversation.profilePic}
          alt={selectedConversation.fullName}
          className="aspect-square h-full w-full"
        />
      </span>
      <div>
        <h2 className="text-lg font-semibold">
          {selectedConversation.fullName}
        </h2>
        <p className="text-sm text-zinc-400">{selectedUserData.status}</p>
      </div>
    </div>
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-zinc-400 hover:text-zinc-400 cursor-not-allowed"
      >
        <Phone className="h-5 w-5" />
        <span className="sr-only">Call</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-zinc-400 hover:text-zinc-400 cursor-not-allowed"
      >
        <Video className="h-5 w-5" />
        <span className="sr-only">Video Call</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-zinc-400 hover:text-zinc-400 cursor-not-allowed"
      >
        <MoreVertical className="h-5 w-5" />
        <span className="sr-only">More options</span>
      </Button>
    </div>
  </div>
);

const Message = ({ message }) => (
  <div
    key={message.id}
    className={`mb-4 flex flex-col ${
      message.sender === "You" ? "items-end" : "items-start"
    }`}
  >
    <div
      className={`rounded-lg p-3 max-w-[70%] ${
        message.sender === "You" ? "bg-blue-500 text-white" : "bg-zinc-800"
      }`}
    >
      <p className="text-sm">{message.content}</p>
    </div>
    <p
      className={`text-xs text-zinc-400 mt-1 ${
        message.sender === "You" ? "text-right" : "text-left"
      }`}
    >
      {message.timestamp}
    </p>
  </div>
);

const ChatForm = ({ message, setMessage, handleSubmit, loading }) => (
  <form
    className="flex items-center justify-center w-full gap-1"
    onSubmit={handleSubmit}
  >
    <Input
      className="bg-zinc-800 border-zinc-700 flex-1 mr-2"
      placeholder="Type a message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    <Button
      type="submit"
      size="icon"
      className={`h-10 w-12 ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white flex-shrink-0`}
      disabled={loading} // Disable the button while loading
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5" />
      )}
    </Button>
  </form>
);

const WelcomeMessage = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
    <MessageSquareDashed className="h-14 w-14 mb-4" />
    <h2 className="text-2xl font-semibold mb-2">Welcome to ChatApp</h2>
    <p className="text-zinc-400 text-center max-w-md">
      Select a conversation to start chatting or create a new one to connect
      with friends.
    </p>
  </div>
);

export function ChatWindow({ selectedUser }) {
  const users = [
    {
      id: "1",
      name: "Alice Johnson",
      status: "online",
      lastMessage: "Hey there!",
      avatar: getProfilePic("Alice Johnson"),
    },
  ];

  const messages = [
    {
      id: "6",
      sender: "You",
      content:
        "I was thinking about the trails at Redwood National Park. I heard they're beautiful this time of year.",
      timestamp: "10:38 AM",
    },
  ];

  const selectedUserData = users.find((u) => u.id === selectedUser);
  const { selectedConversation, setSelectedConversation } = useConversation();

  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    await sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex min-w-[660px]">
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader
            selectedConversation={selectedConversation}
            selectedUserData={selectedUserData}
          />
          <ScrollArea className="flex-1 p-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ScrollArea>
          <Separator className="my-2" />
          <div className="p-4 flex w-full">
            <ChatForm
              message={message}
              setMessage={setMessage}
              handleSubmit={handleSubmit}
              loading={loading} // Pass loading state to ChatForm
            />
          </div>
        </div>
      ) : (
        <WelcomeMessage />
      )}
    </div>
  );
}

