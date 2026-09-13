import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft02Icon,
  CallIcon,
  MoreVerticalIcon,
  Attachment01Icon,
  SentIcon,
} from "hugeicons-react";
import sarahAvatar from "../assets/client_avatar.png";

interface Message {
  id: string;
  sender: "user" | "other";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "other",
    text: "Hi! Thanks for reaching out about the project.",
    timestamp: "10:18 AM",
  },
  {
    id: "2",
    sender: "user",
    text: "Hey Sarah! Happy to discuss. Are you available for a quick sync?",
    timestamp: "10:20 AM",
  },
];

export const ChatThreadScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  const handleBack = () => {
    let targetPath = "/dashboard/chat";
    if (location.pathname.includes("/freelancer")) {
      targetPath = "/dashboard/freelancer/chat";
    } else if (location.pathname.includes("/customer")) {
      targetPath = "/dashboard/customer/chat";
    }
    navigate(`${targetPath}${roleQuery}`);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[20px] mx-auto relative overflow-x-hidden">
      <div className="w-full max-w-[358px] flex flex-col h-full min-h-[660px]">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between py-[12px] border-b border-[#F3F4F6]">
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={handleBack}
              className="w-[36px] h-[36px] rounded-full bg-[#FCFCFC] border border-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all outline-none"
              aria-label="Go back"
            >
              <ArrowLeft02Icon size={18} color="#272931" />
            </button>
            <div className="relative w-[40px] h-[40px] shrink-0">
              <img
                src={sarahAvatar}
                alt="Sarah Jenkins"
                className="w-full h-full rounded-[10px] object-cover bg-gray-100"
              />
              <span className="absolute bottom-0 right-0 w-[8px] h-[8px] bg-[#10B981] rounded-full border border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-medium leading-[18px] text-[#111827]">
                Sarah Jenkins
              </span>
              <span className="text-[12px] font-normal leading-[14px] text-[#10B981]">
                Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-gray-100/60 active:scale-95 transition-all outline-none"
            >
              <CallIcon size={18} color="#272931" />
            </button>
            <button
              type="button"
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-gray-100/60 active:scale-95 transition-all outline-none"
            >
              <MoreVerticalIcon size={18} color="#272931" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 w-full py-[16px] flex flex-col gap-[12px] overflow-y-auto">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${
                  isUser ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-[14px] py-[10px] rounded-[16px] text-[14px] leading-[20px] ${
                    isUser
                      ? "bg-[#0048B3] text-white rounded-br-[4px]"
                      : "bg-[#F3F4F6] text-[#111827] rounded-bl-[4px]"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#9CA3AF] mt-[4px] px-[2px]">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handleSend}
          className="w-full pt-[8px] flex items-center gap-[8px]"
        >
          <div className="flex-1 h-[44px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[22px] px-[14px] flex items-center gap-[8px] focus-within:border-[#0048B3]/50 focus-within:bg-white transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write a message..."
              className="w-full bg-transparent text-[14px] text-[#111827] placeholder-[#9CA3AF] outline-none font-normal"
            />
            <button
              type="button"
              className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors"
            >
              <Attachment01Icon size={18} />
            </button>
          </div>
          <button
            type="submit"
            className="w-[44px] h-[44px] bg-[#0048B3] rounded-full flex items-center justify-center text-white shrink-0 hover:bg-[#00388B] active:scale-95 transition-all"
          >
            <SentIcon size={18} color="#FFFFFF" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatThreadScreen;
