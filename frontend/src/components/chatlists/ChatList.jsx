import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Search, Loader2 } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import Conversation from "./Conversation";
import useGetConversations from "@/hooks/useGetConversations";
import useConversation from "@/zustand/useConversation";
import { toast } from "sonner";

export function ChatList() {
  const { logout, loading } = useLogout();
  const [search, setSearch] = useState("");
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    setFilteredConversations(
      search.length >= 3
        ? conversations.filter((c) =>
            c.fullName.toLowerCase().includes(search.toLowerCase())
          )
        : conversations
    );
  }, [search, conversations]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <div
      className={`w-full lg:w-80 w-[300px] w-[380px] h-full flex flex-col ${
        selectedConversation ? "hidden sm:flex" : "flex"
      }`}
    >
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
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
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search users"
            className="pl-10 bg-zinc-800 border-zinc-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <Conversation conversations={filteredConversations} />
    </div>
  );
}