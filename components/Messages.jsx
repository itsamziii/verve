"use client";

import { useEffect, useState } from "react";
import { Converter } from "showdown";

import { cn } from "@/utils/cn";

const converter = new Converter();

const Messages = ({ messages, projectId }) => {
  const [reversedMessages, setReversedMessages] = useState([
    {
      role: "assistant",
      content: "",
    },
  ]);

  useEffect(() => {
    setReversedMessages(messages.slice().reverse());
  }, [messages]);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse overflow-y-auto gap-2 "
    >
      {reversedMessages.map((msg, index) => {
        const isUser = msg.role === "user";

        return (
          <div key={index} className="chat-message">
            <div
              className={cn("flex items-end pb-2", {
                "justify-end": isUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-sm mx-1 md:max-w-4xl sm:max-w-xl",
                  {
                    "order-1 items-end": isUser,
                    "order-2 items-start": !isUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-xl inline-block", {
                    "bg-indigo-600 text-white rounded-br-none": isUser,
                    "bg-gray-200 text-gray-900 rounded-bl-none": !isUser,
                  })}
                >
                  {msg.content}
                </span>
                {msg.images && (
                  <div className="flex flex-col items-end order-1 rounded-xl">
                    {msg.images.map((img, index) => (
                      <img
                        key={index}
                        src={"data:image/png;base64," + img}
                        alt="user uploaded image"
                        className="rounded-xl size-[50%]"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
