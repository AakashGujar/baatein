/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Menu, Search, Loader2 } from "lucide-react";
import { useLogout } from "../hooks/useLogout.js";
import Conversation from "./Conversation";
import useGetConversations from "../hooks/useGetConversations";
import useConversation from "@/zustand/useConversation.js";
import { toast } from "sonner";

export function ChatList() {
  const { logout, loading } = useLogout();
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    if (search.length >= 3) {
      const filtered = conversations.filter((c) =>
        c.fullName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [search, conversations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };

  return (
    <div className="w-full md:w-80 border-b md:border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-zinc-400 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
        <h1 className="text-xl font-semibold">Chats</h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400"
          onClick={logout}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <LogOut className="h-6 w-6" />
          )}
          <span className="sr-only">Logout</span>
        </Button>
      </div>
      <div className="p-4">
        <div className="relative">
          <form onSubmit={handleSubmit}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search users"
              className="pl-10 bg-zinc-800 border-zinc-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      </div>
      
      <Conversation conversations={filteredConversations} />
    </div>
  );
}
