import { useEffect, useState, useRef } from "react";
import useConversation from "@/zustand/useConversation";
import useSendMessage from "@/hooks/useSendMessage";
import useGetMessages from "@/hooks/useGetMessages";
import { useSocketContext } from "@/context/SocketContext";
import useListenMessages from "@/hooks/useListenMessages";
import ChatHeader from "../chatwindow/ChatHeader";
import Message from "../chatwindow/messages/Message";
import ChatForm from "../chatwindow/ChatForm";
import WelcomeMessage from "../chatwindow/messages/WelcomeMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import MessageSkeleton from "../skeletons/MessageSkeleton";

export function ChatWindow() {
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();
  const { loading: sendingMessage, sendMessage } = useSendMessage();
  const { loading: loadingMessages } = useGetMessages();
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef();
  const lastMessageRef = useRef();
  const { socket } = useSocketContext();

  useListenMessages();

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket, setMessages]);

  useEffect(() => {
    if (!loadingMessages && messages.length > 0) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full w-full sm:w-[calc(100%-300px)] md:w-[calc(100%-380px)] lg:w-[calc(100%-320px)] ${
        selectedConversation ? "flex" : "hidden sm:flex"
      }`}
    >
      {selectedConversation ? (
        <>
          <ChatHeader
            selectedConversation={selectedConversation}
            onBack={handleBack}
          />
          <ScrollArea
            className="flex-1 p-4"
            ref={scrollAreaRef}
            viewportRef={scrollAreaRef}
          >
            {loadingMessages ? (
              <MessageSkeleton />
            ) : (
              <>
                {messages.map((msg) => (
                  <Message key={msg._id} message={msg} />
                ))}
                <div ref={lastMessageRef} />
              </>
            )}
          </ScrollArea>
          <Separator className="my-2" />
          <div className="p-4">
            <ChatForm
              message={message}
              setMessage={setMessage}
              handleSubmit={handleSubmit}
              loading={sendingMessage}
            />
          </div>
        </>
      ) : (
        <WelcomeMessage />
      )}
    </div>
  );
}