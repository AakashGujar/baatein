/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* ChatForm.jsx */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

const ChatForm = ({ message, setMessage, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit} className="flex w-full space-x-2">
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
      disabled={loading}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
    </Button>
  </form>
);

export default ChatForm;