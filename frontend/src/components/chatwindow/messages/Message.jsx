/* eslint-disable react/prop-types */
import { memo } from "react";
import { useAuthContext } from "@/context/AuthContext";

const Message = memo(function Message({ message }) {
  const { authUser } = useAuthContext();
  const isSentByMe = message.senderId === authUser._id;

  return (
    <div
      className={`mb-4 flex flex-col ${
        isSentByMe ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`rounded-lg p-2 sm:p-3 max-w-[85%] sm:max-w-[70%] ${
          isSentByMe ? "bg-blue-500 text-white" : "bg-zinc-800"
        }`}
      >
        <p className="text-sm break-words">{message.message}</p>
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
    </div>
  );
});

export default Message;