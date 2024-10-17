  /* eslint-disable no-unused-vars */
  /* eslint-disable react/prop-types */
  import React from "react";
  import { Button } from "@/components/ui/button";
  import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";

  const ChatHeader = ({ selectedConversation, onBack }) => (
    <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 sm:hidden mr-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <img
            src={selectedConversation.profilePic}
            alt={selectedConversation.fullName}
            className="aspect-square h-full w-full"
          />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{selectedConversation.fullName}</h2>
          <p className="text-sm text-zinc-400"></p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-400 cursor-not-allowed hidden sm:inline-flex"
        >
          <Phone className="h-5 w-5" />
          <span className="sr-only">Call</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-400 cursor-not-allowed hidden sm:inline-flex"
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

  export default ChatHeader;