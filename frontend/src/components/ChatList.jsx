/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Menu, Search, Loader2 } from "lucide-react";
import { useLogout } from "../hooks/useLogout.js";
import Conversation from "./Conversation";

export function ChatList() {
  const { logout, loading } = useLogout(); 

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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search users"
            className="pl-10 bg-zinc-800 border-zinc-700"
          />
        </div>
      </div>
     
      <Conversation />

    </div>
  );
}