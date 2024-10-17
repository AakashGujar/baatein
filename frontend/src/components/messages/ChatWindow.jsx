import { useEffect, useState, useRef } from "react";
import useConversation from "@/zustand/useConversation";
import useSendMessage from "@/hooks/useSendMessage";
import useGetMessages from "@/hooks/useGetMessages";
import { useSocketContext } from "@/context/SocketContext";
import useListenMessages from "@/hooks/useListenMessages";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import ChatForm from "./ChatForm";
import WelcomeMessage from "./WelcomeMessage";
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
    console.log("Current messages:", messages);
  }, [messages]);

  useEffect(() => {
    if (socket) {
      console.log("Socket connected:", socket.connected);
      socket.on("connect", () => console.log("Socket connected"));
      socket.on("disconnect", () => console.log("Socket disconnected"));
      socket.on("newMessage", (newMessage) => {
        console.log("New message received:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("connect");
        socket.off("disconnect");
      }
    };
  }, [socket, setMessages]);

  useEffect(() => {
    const scrollToBottom = () => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!loadingMessages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, loadingMessages]);

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    console.log("Sending message:", message);
    await sendMessage(message);
    setMessage("");
  };

  return (
    <div className="flex min-w-[660px]">
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader selectedConversation={selectedConversation} />
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
          <div className="p-4 flex w-full">
            <ChatForm
              message={message}
              setMessage={setMessage}
              handleSubmit={handleSubmit}
              loading={sendingMessage}
            />
          </div>
        </div>
      ) : (
        <WelcomeMessage />
      )}
    </div>
  );
}
