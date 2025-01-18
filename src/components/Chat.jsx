"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Copy, ArrowLeft } from "lucide-react";

const socket = {
  on: (event, callback) => {
    if (event === "chat message") {
      setInterval(() => {
        callback({ user: "System", text: "This is a simulated message." });
      }, 5000);
    }
  },
  emit: () => {},
};

export default function Chat({ user, group, setUser, setGroup }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    const timer = setTimeout(() => {
      toast.error("Chat channel auto-destructed!");
      setUser(null);
      setGroup(null);
    }, 600000);

    return () => clearTimeout(timer);
  }, []);

  const sendMessage = () => {
    if (inputMessage) {
      const newMessage = { user, text: inputMessage };
      setMessages([...messages, newMessage]);
      socket.emit("chat message", newMessage);
      setInputMessage("");
    }
  };

  const copyGroupCode = () => {
    navigator.clipboard.writeText(group);
    toast.success("Group code copied to clipboard!");
  };

  const leaveChat = () => {
    toast.success("Left the chat");
    setUser(null);
    setGroup(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={leaveChat}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            Group Code: <span className="font-semibold">{group}</span>
          </span>
          <Button variant="ghost" size="icon" onClick={copyGroupCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[300px] border rounded-md p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.user === user ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.user === user ? "bg-primary" : "bg-secondary"
              }`}
            >
              <p className="text-xs opacity-70">{msg.user}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}