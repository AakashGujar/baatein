/* eslint-disable no-unused-vars */
/* WelcomeMessage.jsx */
import React from "react";
import { MessageSquareDashed } from "lucide-react";

const WelcomeMessage = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
    <MessageSquareDashed className="h-14 w-14 mb-4" />
    <h2 className="text-2xl font-semibold mb-2">Welcome to ChatApp</h2>
    <p className="text-zinc-400 text-center max-w-md">
      Select a conversation to start chatting or create a new one to connect with friends.
    </p>
  </div>
);

export default WelcomeMessage;
