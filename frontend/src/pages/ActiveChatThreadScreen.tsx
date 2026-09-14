import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft02Icon,
  MoreVerticalIcon,
  Download01Icon,
  Add01Icon,
  Mic01Icon,
  ArrowUp02Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from "hugeicons-react";
import sarahAvatar from "../assets/client_avatar.png";
import pdfIcon from "../assets/pdf_icon.png";
import verifiedBadge from "../assets/verified_badge.png";
import WorkerBottomNav from "../components/WorkerBottomNav";

interface Message {
  id: string;
  sender: "Sarah" | "You";
  text: string;
  timestamp: string;
}

const INITIAL_SARAH_REPLIES = [
  "Sounds wonderful! I've reviewed the latest deliverables and will send over the next brief shortly.",
  "Thanks for the prompt update Emmanuel! Looking forward to seeing the results.",
  "Perfect! Let's proceed with Milestone 2 as discussed.",
];

export const ActiveChatThreadScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [extraMessages, setExtraMessages] = useState<Message[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
  }, [extraMessages, isTyping]);

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

    setExtraMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText =
        INITIAL_SARAH_REPLIES[
          replyIndexRef.current % INITIAL_SARAH_REPLIES.length
        ];
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

      setExtraMessages((prev) => [...prev, replyMsg]);
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

  const handleOpenMilestoneDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-[390px] min-h-[1010px] h-full bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[120px] mx-auto relative overflow-y-auto">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col items-center gap-[20px]">
        {/* Header Stack */}
        <div className="w-full flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 py-2">
          {/* Back Button */}
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

          {/* Recipient Profile Info */}
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

          {/* More Options Button */}
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

        {/* Incoming Message: Sarah Jenkins (10:42 AM) */}
        <div className="w-full flex flex-col items-start gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[13px] font-medium text-[#111827]">
              Sarah Jenkins.
            </span>
            <span className="text-[11px] font-normal text-[#9CA3AF]">
              10:42 AM
            </span>
          </div>

          {/* Text Bubble */}
          <div className="max-w-[290px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[16px] rounded-tl-[4px] p-[14px] text-left">
            <p className="text-[13px] font-normal leading-[18px] text-[#272931]">
              Hi! I&apos;ve put together some initial wireframes for the IG
              campaign based on our brief. Let me know what you think when you
              have a moment.
            </p>
          </div>

          {/* Attachment Card: PDF */}
          <div className="w-full max-w-[290px] bg-white border border-[#E5E7EB] rounded-[14px] p-[12px] flex items-center justify-between mt-[4px] shadow-sm hover:border-[#0048B3]/40 transition-all cursor-pointer">
            <div className="flex items-center gap-[10px] min-w-0 flex-1 pr-[8px]">
              <div className="w-[36px] h-[36px] rounded-[8px] bg-[#FEE2E2] flex items-center justify-center shrink-0">
                <img
                  src={pdfIcon}
                  alt="PDF"
                  width="20"
                  height="20"
                  className="w-[20px] h-[20px] object-contain"
                />
              </div>
              <div className="flex flex-col items-start min-w-0 text-left flex-1">
                <span className="text-[12px] font-medium text-[#111827] truncate w-full">
                  IG_Campaign_Wireframes_v1.pdf
                </span>
                <span className="text-[10px] font-normal text-[#9CA3AF]">
                  2.4 MB • PDF Document
                </span>
              </div>
            </div>
            <button
              type="button"
              className="text-[#4B5563] hover:text-[#0048B3] p-1 transition-colors shrink-0"
              aria-label="Download attachment"
            >
              <Download01Icon size={18} className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Outgoing Message: You (11:15 AM) */}
        <div className="w-full flex flex-col items-end gap-[6px] mt-[8px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-normal text-[#9CA3AF]">
              11:15 AM
            </span>
            <span className="text-[13px] font-medium text-[#111827]">You</span>
          </div>

          {/* Blue Outgoing Bubble */}
          <div className="max-w-[290px] bg-[#0048B3] rounded-[16px] rounded-tr-[4px] p-[14px] text-left shadow-button-inset">
            <p className="text-[13px] font-normal leading-[18px] text-white">
              These look incredible, Sarah. The minimalist approach really fits
              the brand guidelines we discussed.
            </p>
          </div>
        </div>

        {/* Dynamically Sent & Received Messages */}
        {extraMessages.map((msg) => {
          const isUser = msg.sender === "You";
          return (
            <div
              key={msg.id}
              className={`w-full flex flex-col gap-[6px] ${isUser ? "items-end" : "items-start"}`}
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

        {/* Milestone 1 Completed Card */}
        <div className="w-full bg-[#FCFCFC] border border-[#E5E7EB] rounded-[20px] p-[24px_16px_20px_16px] flex flex-col items-center gap-[12px] mt-[12px] relative overflow-hidden shadow-sm">
          {/* Gold Confetti Ribbon Background Overlay */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none bg-cover bg-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='358' height='180' viewBox='0 0 358 180' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 40C45 20 60 50 75 30' stroke='%23F59E0B' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M290 35C305 55 320 25 335 45' stroke='%23D97706' stroke-width='3' stroke-linecap='round'/%3E%3Crect x='45' y='80' width='10' height='10' rx='2' transform='rotate(25 45 80)' fill='%23FBBF24'/%3E%3Crect x='310' y='90' width='12' height='8' rx='2' transform='rotate(-30 310 90)' fill='%23F59E0B'/%3E%3Crect x='90' y='25' width='8' height='8' rx='2' transform='rotate(45 90 25)' fill='%23FCD34D'/%3E%3Crect x='260' y='30' width='10' height='10' rx='2' transform='rotate(15 260 30)' fill='%23FBBF24'/%3E%3Cpath d='M60 120C70 110 80 130 90 115' stroke='%23B45309' stroke-width='2.5' stroke-linecap='round'/%3E%3Cpath d='M280 125C290 140 300 120 310 135' stroke='%23F59E0B' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
            }}
          />

          {/* 3D Rosette Badge */}
          <div className="w-[52px] h-[52px] flex items-center justify-center relative z-10">
            <img
              src={verifiedBadge}
              alt="Completed"
              width="52"
              height="52"
              className="w-[52px] h-[52px] object-contain drop-shadow-md"
            />
          </div>

          <div className="flex flex-col items-center gap-[4px] text-center relative z-10">
            <h3 className="text-[16px] font-medium leading-[20px] text-[#111827]">
              Milestone 1 Completed
            </h3>
            <p className="text-[12px] font-normal leading-[16px] text-[#6B7280] max-w-[260px]">
              Wireframe delivery approved. Payment for this milestone have been
              released.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenMilestoneDetails}
            className="h-[38px] px-[22px] rounded-[19px] bg-[#0048B3] text-white text-[13px] font-medium shadow-button-inset flex items-center justify-center hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer outline-none mt-[4px] relative z-10"
          >
            View Milestone Details
          </button>
        </div>

        {/* Animated Typing Indicator */}
        {isTyping && (
          <div className="w-full flex items-center justify-start mt-[4px] transition-all">
            <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-full px-[14px] py-[8px] flex items-center gap-[4px]">
              <span className="w-[5px] h-[5px] rounded-full bg-[#9CA3AF] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#9CA3AF] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#9CA3AF] animate-bounce" />
            </div>
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} className="h-[2px] w-full" />

        {/* Message Text Input Bar */}
        <div className="w-full flex items-center gap-[8px] mt-[12px]">
          {/* Plus / Attachment Button */}
          <button
            type="button"
            onClick={() => {
              const attachMsg: Message = {
                id: `attach-${Date.now()}`,
                sender: "You",
                text: "📎 Attached: Campaign_Assets_v2.zip (18.4 MB)",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
              setExtraMessages((prev) => [...prev, attachMsg]);
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

          {/* Input Capsule with Mic Icon */}
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
                  text: "🎙️ Voice note (0:24)",
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                };
                setExtraMessages((prev) => [...prev, voiceMsg]);
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

          {/* Send Button */}
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

      {/* Project / Milestone Details Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-[358px] bg-white rounded-[24px] p-[20px] shadow-2xl border border-gray-100 flex flex-col gap-[16px] max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Milestone Details
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-[32px] h-[32px] rounded-full bg-[#F9FAFB] flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="flex flex-col gap-[12px] text-left">
              <div className="flex items-center justify-between bg-[#F9FAFB] p-3 rounded-[14px]">
                <span className="text-[12px] font-medium text-[#6B7280]">
                  Status
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600">
                  <CheckmarkCircle01Icon size={14} /> Released
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-semibold">
                  Milestone Name
                </span>
                <p className="text-[14px] font-medium text-[#111827]">
                  Milestone 1: Wireframe Delivery
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider font-semibold">
                  Description
                </span>
                <p className="text-[13px] text-[#4B5563] leading-[18px]">
                  Deliver initial wireframes for the Instagram campaign brief.
                  Includes client feedback revisions and design assets.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#9CA3AF]">
                    Payout Amount
                  </span>
                  <span className="text-[14px] font-semibold text-[#111827]">
                    $250.00
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#9CA3AF]">
                    Approved On
                  </span>
                  <span className="text-[14px] font-semibold text-[#111827]">
                    Today
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full h-[40px] rounded-[20px] bg-[#0048B3] text-white text-[13px] font-medium shadow-button-inset hover:opacity-95 transition-all mt-2 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Worker Bottom Navigation */}
      <WorkerBottomNav />
    </div>
  );
};

export default ActiveChatThreadScreen;
