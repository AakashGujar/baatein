/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MoreVertical, Phone, Send, Video } from "lucide-react";
import { getProfilePic } from "../utils/getProfilePic";

export function ChatWindow({ selectedUser }) {
  const users = [
    {
      id: "1",
      name: "Alice Johnson",
      status: "online",
      lastMessage: "Hey there!",
      avatar: getProfilePic("Alice Johnson"),
    },
    {
      id: "2",
      name: "Bob Smith",
      status: "offline",
      lastMessage: "See you tomorrow",
      avatar: getProfilePic("Bob Smith"),
    },
    {
      id: "3",
      name: "Charlie Brown",
      status: "online",
      lastMessage: "Got it, thanks!",
      avatar: getProfilePic("Charlie Brown"),
    },
  ];

  const messages = [
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hi! How are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing great! Any plans for the weekend?",
      timestamp: "10:33 AM",
    },
    {
      id: "4",
      sender: "You",
      content: "Not yet, but I'm thinking about going hiking. Want to join?",
      timestamp: "10:35 AM",
    },
    {
      id: "5",
      sender: "Alice Johnson",
      content:
        "That sounds amazing! I'd love to join. Where are you planning to go?",
      timestamp: "10:36 AM",
    },
    {
      id: "6",
      sender: "You",
      content:
        "I was thinking about the trails at Redwood National Park. I heard they're beautiful this time of year.",
      timestamp: "10:38 AM",
    },
    {
      id: "7",
      sender: "Alice Johnson",
      content:
        "Oh, I've always wanted to go there! Count me in. Should we invite the others?",
      timestamp: "10:40 AM",
    },
  ];

  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <img
              src={selectedUserData.avatar}
              alt={selectedUserData.name}
              className="aspect-square h-full w-full"
            />
          </span>
          <div>
            <h2 className="text-lg font-semibold">{selectedUserData.name}</h2>
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
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex flex-col ${
              message.sender === "You" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-[70%] ${
                message.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-800"
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
        ))}
      </ScrollArea>
      <Separator className="my-2" />
      <div className="p-4 flex w-full">
        <form className="flex items-center justify-center w-full gap-1">
          <Input
            className="bg-zinc-800 border-zinc-700 flex-1 mr-2"
            placeholder="Type a message..."
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-12 bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
