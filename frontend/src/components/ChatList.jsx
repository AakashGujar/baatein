/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Menu, Search } from "lucide-react";
import { getProfilePic } from "../utils/getProfilePic";

export function ChatList({ selectedUser, setSelectedUser }) {
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

  return (
    <div className="w-full md:w-80 border-b md:border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-zinc-400 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
        <h1 className="text-xl font-semibold">Chats</h1>
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <LogOut className="h-6 w-6" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search users"
            className="pl-10 bg-zinc-800 border-zinc-700"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 cursor-pointer hover:bg-zinc-800 ${
              selectedUser === user.id ? "bg-zinc-700" : ""
            }`}
            onClick={() => setSelectedUser(user.id)}
          >
            <div className="flex items-center space-x-4">
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="aspect-square h-full w-full"
                />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-zinc-400 truncate">
                  {user.lastMessage}
                </p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  user.status === "online" ? "bg-green-500" : "bg-zinc-600"
                }`}
              />
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
