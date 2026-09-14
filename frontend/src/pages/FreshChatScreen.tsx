import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft02Icon,
  MoreVerticalIcon,
  Add01Icon,
  Mic01Icon,
  ArrowUp02Icon,
  Chat01Icon,
} from "hugeicons-react";
import sarahAvatar from "../assets/client_avatar.png";
import WorkerBottomNav from "../components/WorkerBottomNav";

interface Message {
  id: string;
  sender: "Sarah" | "You";
  text: string;
  timestamp: string;
}

const FRESH_SARAH_REPLIES = [
  "Hi Emmanuel! Thanks for reaching out. Excited to collaborate on this Instagram Management project with you.",
  "Great to connect! I'll prepare the project assets and share the initial brief here shortly.",
];

export const FreshChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyIndexRef = useRef<number>(0);

  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "You",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText =
        FRESH_SARAH_REPLIES[replyIndexRef.current % FRESH_SARAH_REPLIES.length];
      replyIndexRef.current += 1;

      const replyMsg: Message = {
        id: `sarah-${Date.now()}`,
        sender: "Sarah",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 1400);
  };

  const handleBack = () => {
    let targetPath = "/dashboard/chat";
    if (location.pathname.includes("/freelancer")) {
      targetPath = "/dashboard/freelancer/chat";
    } else if (location.pathname.includes("/customer")) {
      targetPath = "/dashboard/customer/chat";
    }
    navigate(`${targetPath}${roleQuery}`);
  };

  const isThreadEmpty = messages.length === 0;

  return (
    <div className="w-full max-w-[390px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[120px] mx-auto relative overflow-y-auto">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col items-center gap-[20px] flex-1">
        {/* Header Stack */}
        <div className="w-full flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 py-2">
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#FCFCFC] border border-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all outline-none shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft02Icon
              size={20}
              color="#272931"
              className="w-[20px] h-[20px] shrink-0"
            />
          </button>

          <div className="flex items-center gap-[10px] flex-1 ml-[12px] min-w-0">
            <div className="relative w-[38px] h-[38px] shrink-0">
              <img
                src={sarahAvatar}
                alt="Sarah Jenkins"
                width="38"
                height="38"
                className="w-[38px] h-[38px] rounded-[10px] object-cover bg-gray-100"
              />
              <span className="absolute bottom-0 right-0 w-[8px] h-[8px] bg-[#10B981] rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[15px] font-medium leading-[19px] text-[#111827] truncate w-full text-left">
                Sarah Jenkins.
              </span>
              <span className="text-[11px] font-normal leading-[14px] text-[#9CA3AF] truncate w-full text-left">
                Active Project: Instagram Management
              </span>
            </div>
          </div>

          <button
            type="button"
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-[#272931] hover:bg-gray-100/60 active:scale-95 transition-all outline-none cursor-pointer shrink-0"
            aria-label="More options"
          >
            <MoreVerticalIcon
              size={20}
              color="#272931"
              className="w-[20px] h-[20px]"
            />
          </button>
        </div>

        {/* System Notice Pill */}
        <div className="w-full bg-[#F9FAFB] border border-[#F3F4F6] rounded-[12px] p-[10px_14px] flex items-center justify-center">
          <p className="text-[11px] font-normal leading-[15px] text-[#6B7280] text-center">
            Project match established. You can now chat directly regarding
            &ldquo;Instagram Management&rdquo;.
          </p>
        </div>

        {/* Date Divider */}
        <div className="w-full flex items-center justify-center my-[4px] relative">
          <div className="w-full border-t border-[#E5E7EB] absolute" />
          <span className="bg-white px-[12px] text-[11px] font-medium text-[#9CA3AF] relative z-10">
            Today
          </span>
        </div>

        {/* Empty State vs Message Stream */}
        {isThreadEmpty ? (
          <div className="w-full flex flex-col items-center justify-center my-auto py-[40px] gap-[12px] text-center">
            <div className="w-[56px] h-[56px] rounded-full bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center">
              <Chat01Icon size={26} color="#9CA3AF" />
            </div>
            <div className="flex flex-col items-center gap-[4px]">
              <h4 className="text-[15px] font-medium text-[#111827]">
                Start the conversation
              </h4>
              <p className="text-[12px] text-[#9CA3AF] max-w-[250px] leading-[16px]">
                Say hello to Sarah to discuss requirements, project milestones,
                or share ideas.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-[12px]">
            {messages.map((msg) => {
              const isUser = msg.sender === "You";
              return (
                <div
                  key={msg.id}
                  className={`w-full flex flex-col gap-[6px] ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-[6px]">
                    {isUser ? (
                      <>
                        <span className="text-[11px] font-normal text-[#9CA3AF]">
                          {msg.timestamp}
                        </span>
                        <span className="text-[13px] font-medium text-[#111827]">
                          You
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[13px] font-medium text-[#111827]">
                          Sarah Jenkins.
                        </span>
                        <span className="text-[11px] font-normal text-[#9CA3AF]">
                          {msg.timestamp}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className={`max-w-[290px] p-[14px] text-left rounded-[16px] ${
                      isUser
                        ? "bg-[#0048B3] text-white rounded-tr-[4px] shadow-button-inset"
                        : "bg-[#F9FAFB] border border-[#F3F4F6] text-[#272931] rounded-tl-[4px]"
                    }`}
                  >
                    <p className="text-[13px] font-normal leading-[18px]">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="w-full flex items-center justify-start mt-[4px] transition-all">
                <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-full px-[14px] py-[8px] flex items-center gap-[4px]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[#9CA3AF] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-[5px] h-[5px] rounded-full bg-[#9CA3AF] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-[5px] h-[5px] rounded-full bg-[#9CA3AF] animate-bounce" />
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} className="h-[2px] w-full" />

        {/* Input Bar */}
        <div className="w-full flex items-center gap-[8px] mt-auto pt-[12px]">
          <button
            type="button"
            onClick={() => {
              const attachMsg: Message = {
                id: `attach-${Date.now()}`,
                sender: "You",
                text: "📎 Attached: Project_Proposal_v1.pdf (4.2 MB)",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
              setMessages((prev) => [...prev, attachMsg]);
            }}
            className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center text-[#272931] hover:bg-gray-100/80 active:scale-95 transition-all outline-none cursor-pointer shrink-0"
            aria-label="Add attachment"
          >
            <Add01Icon
              size={18}
              color="#272931"
              className="w-[18px] h-[18px]"
            />
          </button>

          <div className="flex-1 h-[44px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[22px] px-[14px] flex items-center gap-[8px] focus-within:border-[#0048B3]/40 focus-within:bg-white transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Send a message"
              className="flex-1 bg-transparent text-[13px] text-[#111827] placeholder-[#9CA3AF] outline-none font-normal"
            />
            <button
              type="button"
              onClick={() => {
                const voiceMsg: Message = {
                  id: `voice-${Date.now()}`,
                  sender: "You",
                  text: "🎙️ Voice note (0:15)",
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                };
                setMessages((prev) => [...prev, voiceMsg]);
              }}
              className="text-[#272931] hover:text-[#0048B3] transition-colors outline-none cursor-pointer p-1"
              aria-label="Voice input"
            >
              <Mic01Icon
                size={18}
                color="#272931"
                className="w-[18px] h-[18px]"
              />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendMessage}
            className="w-[40px] h-[40px] rounded-full bg-[#0048B3] flex items-center justify-center text-white shadow-button-inset hover:opacity-95 active:scale-95 transition-all outline-none cursor-pointer shrink-0"
            aria-label="Send message"
          >
            <ArrowUp02Icon
              size={18}
              color="#FFFFFF"
              className="w-[18px] h-[18px]"
            />
          </button>
        </div>
      </div>
      {/* Worker Bottom Navigation */}
    <WorkerBottomNav />
    </div>
  );
};

export default FreshChatScreen;
