import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft02Icon,
  Notification01Icon,
  Search01Icon,
} from "hugeicons-react";
import sarahAvatar from "../assets/client_avatar.png";
import marcusAvatar from "../assets/marcus_avatar.svg";

interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isSystem?: boolean;
}

const CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    avatar: sarahAvatar,
    isOnline: true,
    lastMessage: "Are you available for a quick sync?",
    timestamp: "10:20AM",
    unreadCount: 1,
  },
  {
    id: "2",
    name: "Match: E-commerce build",
    avatar: sarahAvatar,
    lastMessage: "System: You have been matched with Alex",
    timestamp: "10:20AM",
    unreadCount: 1,
    isSystem: true,
  },
  {
    id: "3",
    name: "Marcus Chen",
    avatar: marcusAvatar,
    lastMessage: "Thanks for the update. Talk soon!",
    timestamp: "10:20AM",
    unreadCount: 0,
  },
];

export const WorkerChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  const handleBack = () => {
    let targetPath = "/dashboard";
    if (location.pathname.includes("/freelancer")) {
      targetPath = "/dashboard/freelancer/dashboard";
    } else if (location.pathname.includes("/customer")) {
      targetPath = "/dashboard/customer/home";
    }
    navigate(`${targetPath}${roleQuery}`);
  };

  const filteredConversations = CHAT_CONVERSATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] mx-auto relative overflow-x-hidden">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col items-center h-full min-h-[660px]">
        {/* Header Stack */}
        <div className="w-full flex flex-col gap-[24px]">
          {/* Back Button Row */}
          <div className="w-full flex items-center">
            <button
              type="button"
              onClick={handleBack}
              className="w-[40px] h-[40px] rounded-full bg-[#FCFCFC] border border-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all outline-none"
              aria-label="Go back"
            >
              <ArrowLeft02Icon
                size={20}
                color="#272931"
                className="w-[20px] h-[20px] shrink-0"
              />
            </button>
          </div>

          {/* Title Row with Notification Icon */}
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-[#272931]">
              Chat
            </h1>
            <button
              type="button"
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-[#272931] hover:bg-gray-100/60 active:scale-95 transition-all outline-none cursor-pointer"
              aria-label="Notifications"
            >
              <Notification01Icon
                size={20}
                color="#272931"
                className="w-[20px] h-[20px]"
              />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full mt-[16px] mb-[8px]">
          <div className="w-full h-[45px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[12px] px-[12px] flex items-center gap-[8px] focus-within:border-[#0048B3]/50 focus-within:bg-white transition-all">
            <Search01Icon
              size={18}
              color="#9CA3AF"
              className="w-[18px] h-[18px] shrink-0"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full bg-transparent text-[14px] text-[#111827] placeholder-[#9CA3AF] outline-none font-normal"
            />
          </div>
        </div>

        {/* Chat Items List */}
        <div className="w-full flex flex-col mt-[8px]">
          {filteredConversations.map((item) => {
            const hasUnread = (item.unreadCount ?? 0) > 0;
            return (
              <div
                key={item.id}
                onClick={() => {
                  let basePath = "/dashboard/chat";
                  if (location.pathname.includes("/freelancer")) {
                    basePath = "/dashboard/freelancer";
                  } else if (location.pathname.includes("/customer")) {
                    basePath = "/dashboard/customer";
                  }

                  const targetPath =
                    item.id === "2"
                      ? `${basePath}/fresh-chat`
                      : `${basePath}/chat-thread`;

                  navigate(`${targetPath}${roleQuery}`);
                }}
                className="w-full py-[14px] flex items-center justify-between border-b border-[#F3F4F6] cursor-pointer hover:bg-gray-50/60 rounded-[8px] px-[4px] transition-colors"
              >
                {/* Left: Avatar + Text */}
                <div className="flex items-center gap-[12px] min-w-0 pr-[8px]">
                  {/* Avatar with optional online green dot */}
                  <div className="relative w-[48px] h-[48px] shrink-0">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      width="48"
                      height="48"
                      className="w-[48px] h-[48px] rounded-[12px] object-cover bg-gray-100"
                    />
                    {item.isOnline && (
                      <span className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-[#10B981] rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Name and Last Message */}
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-[14px] font-medium leading-[18px] text-[#111827] truncate w-full">
                      {item.name}
                    </span>
                    <span
                      className={`text-[13px] font-normal leading-[16px] truncate w-full mt-[2px] ${
                        hasUnread ? "text-[#4B5563]" : "text-[#9CA3AF]"
                      }`}
                    >
                      {item.lastMessage}
                    </span>
                  </div>
                </div>

                {/* Right: Timestamp + Unread Blue Dot */}
                <div className="flex flex-col items-end gap-[6px] shrink-0">
                  <span className="text-[11px] font-normal leading-[14px] text-[#9CA3AF]">
                    {item.timestamp}
                  </span>
                  {hasUnread ? (
                    <span className="w-[8px] h-[8px] rounded-full bg-[#0048B3]" />
                  ) : (
                    <div className="w-[8px] h-[8px]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkerChatScreen;
