/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import useGetMessages from "@/hooks/useGetMessages";

// Utility function to debounce scroll calls
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef();
  const isSentByMe = message.senderId === authUser._id;

  // Scroll to the last message, debounced to prevent excessive calls
  const scrollToLastMessage = debounce(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 300);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToLastMessage();
    }
  }, [loading, messages, scrollToLastMessage]);

  return (
    <div
      className={`mb-4 flex flex-col ${
        isSentByMe ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`rounded-lg p-3 max-w-[70%] ${
          isSentByMe ? "bg-blue-500 text-white" : "bg-zinc-800"
        }`}
      >
        <p className="text-sm">{message.message}</p>
      </div>
      <p
        className={`text-xs text-zinc-400 mt-1 ${
          isSentByMe ? "text-right" : "text-left"
        }`}
      >
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <div ref={lastMessageRef}></div>
    </div>
  );
};

export default Message;
