/* eslint-disable no-unused-vars */
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MessageSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={`sender-${i}`} className="flex justify-end">
          <div className="flex flex-col space-y-2 max-w-[70%]">
            <Skeleton className="h-10 w-40 ml-auto" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        </div>
      ))}
      {[...Array(3)].map((_, i) => (
        <div key={`receiver-${i}`} className="flex justify-start">
          <div className="flex flex-col space-y-2 max-w-[70%]">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;