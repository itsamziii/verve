"use client";

import { Paperclip } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { cn } from "@/utils/cn";
import { toBase64 } from "@/utils/base64";
import Messages from "@/components/Messages";

const Playground = () => {
  const projectId = useSearchParams().get("id");

  const [messages, setMessages] = useState(
    projectId
      ? []
      : [
          {
            role: "assistant",
            content:
              "Hello! I am a professional web developer who helps in creating beautiful websites using HTML and Tailwind CSS. How can I help you?",
          },
        ]
  );

  const [input, setInput] = useState("");
  const [imageFile, setImgFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .post("/api/message/initial-messages", { projectId })
      .then(({ data }) => {
        if (data.messages) setMessages(data.messages);
      });
  }, [projectId]);

  const imgHandler = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setImgFile(null);
      return;
    }
    setImgFile(file);
  };

  const sendMessage = async () => {
    setIsLoading(true);

    let imagesBase64 = [];

    if (imageFile) imagesBase64 = [await toBase64(imageFile)];

    await new Promise((res) => setTimeout(res, 1000));

    try {
      const newMessages = [
        ...messages,
        { role: "user", content: input, images: imagesBase64 },
      ];

      setMessages(newMessages);

      const { data } = await axios.post("/api/message/send", {
        messages: newMessages,
      });

      setInput("");
      setImgFile(null);

      if (data.success) {
        const repliedMessages = [...newMessages, data.response];
        setMessages(repliedMessages);
      }
    } catch (err) {
      console.log(err);

      const newMessages = [
        ...messages,
        {
          role: "assistant",
          content: "There was an error sending your message. Please try again.",
        },
      ];
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-black flex items-center pt-20 h-screen">
      <div className="z-10 flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)] w-full">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
          <div className="relative">
            <h1 className="text-xl font-semibold pl-3">{`Playground`}</h1>
          </div>
        </div>

        <div className="z-11 flex flex-col rounded-xl bg-muted/50 p-4 w-full h-[77vh]">
          <Messages messages={messages} projectId={projectId} />
          <div className="relative rounded-xl bg-background focus-within:ring-0 focus-within:ring-ring">
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-10 resize-none border-0 p-2 shadow-none focus-visible:ring-0"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex items-center p-2 pt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-wrap">
                      <Label
                        className={
                          (cn(
                            "flex justify-center pt-2 pl-2 items-center cursor-pointer size-[10%] rounded-xl object-cover"
                          ),
                          {
                            "text-xl": !imageFile,
                          })
                        }
                        htmlFor="add-single-img"
                      >
                        {imageFile ? <Paperclip size={18} /> : "+"}
                      </Label>
                      <Input
                        id="add-single-img"
                        className="opacity-0 h-[0] w-[0]"
                        type="file"
                        accept="image/*"
                        onChange={imgHandler}
                      />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent side="top">
                    {imageFile
                      ? `Added ${imageFile.name.substring(0, 5)}...`
                      : "Attach Image"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                type="submit"
                size="sm"
                className={cn("ml-auto gap-1.5 w-[11%] rounded-xl", {
                  "cursor-not-allowed": isLoading,
                })}
                disabled={isLoading}
                onClick={sendMessage}
              >
                {isLoading ? <Loading /> : "Send Message"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Playground;
