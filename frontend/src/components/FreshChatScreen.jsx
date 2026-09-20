import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft02Icon,
  MoreVerticalIcon,
  Add01Icon,
  Mic01Icon,
  ArrowUp02Icon,
  Chat01Icon,
  Download01Icon,
  File02Icon,
  CheckmarkBadge01Icon,
} from 'hugeicons-react';
import { useApp } from '../context/AppContext';

const DEFAULT_SARAH_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80';

const FRESH_SARAH_REPLIES = [
  "Hi Emmanuel! Thanks for reaching out. Excited to collaborate on this Instagram Management project with you.",
  "Great to connect! I'll prepare the project assets and share the initial brief here shortly.",
  "That sounds like a solid plan! Let me review and get back to you in a moment.",
];

export const FreshChatScreen = () => {
  const navigate = useNavigate();
  const { navigateTo } = useApp?.() || { navigateTo: (path) => navigate(path.startsWith('/') ? path : `/${path}`) };
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const replyIndexRef = useRef(0);

  // Initial messages matching Figma node and reference screenshot
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'Sarah',
      text: "Hi! I've put together some initial wireframes for the IG campaign based on our brief. Let me know what you think when you have a moment.",
      timestamp: '10:42 AM',
      attachment: {
        name: 'IG_Campaign_Wireframes_v1.pdf',
        size: '2.4 MB',
        type: 'PDF Document',
      },
    },
    {
      id: 'msg-2',
      sender: 'You',
      text: 'These look incredible, Sarah. The minimalist approach really fits the brand guidelines we discussed.',
      timestamp: '11:15 AM',
    },
    {
      id: 'msg-3',
      sender: 'System',
      text: '',
      timestamp: '11:16 AM',
      isMilestone: true,
      milestoneData: {
        title: 'Milestone 1 Completed',
        description: 'Wireframe delivery approved. Payment for this milestone have been released.',
        buttonText: 'View Milestone Details',
      },
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg = {
      id: `user-${Date.now()}`,
      sender: 'You',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic auto-reply from client
    setTimeout(() => {
      const replyText =
        FRESH_SARAH_REPLIES[replyIndexRef.current % FRESH_SARAH_REPLIES.length];
      replyIndexRef.current += 1;

      const replyMsg = {
        id: `sarah-${Date.now()}`,
        sender: 'Sarah',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 1400);
  };

  const handleBack = () => {
    if (navigateTo) {
      navigateTo('freelancer/chat');
    } else {
      navigate('/dashboard/chat');
    }
  };

  const isThreadEmpty = messages.length === 0;

  return (
    <div
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[21px] pt-[20px] pb-[100px] relative overflow-hidden select-none mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Content Container */}
      <div className="w-full max-w-[388px] flex flex-col items-center gap-[16px] flex-1">
        
        {/* 1. Header Stack (Figma Node 963:526 & 963:528) */}
        <div className="w-full flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30 py-3 border-b border-[#F3F4F6]">
          {/* Back Button (Circle Pill standard) */}
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] active:scale-95 flex items-center justify-center cursor-pointer transition-all outline-none border-none shrink-0 shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft02Icon size={20} color="#12131A" className="w-[20px] h-[20px] shrink-0" />
          </button>

          {/* Recipient Profile Info */}
          <div className="flex items-center gap-[10px] flex-1 ml-[12px] min-w-0">
            <div className="relative w-[38px] h-[38px] shrink-0">
              <img
                src={DEFAULT_SARAH_AVATAR}
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
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-[#272931] hover:bg-gray-100/60 active:scale-95 transition-all outline-none cursor-pointer shrink-0 border-none bg-transparent"
            aria-label="More options"
          >
            <MoreVerticalIcon size={20} color="#272931" className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* 2. System Notice Pill (Figma Node 1034:2660) */}
        <div className="max-w-[260px] w-auto bg-[#F9FAFB] border border-[#F3F4F6] rounded-[16px] px-[16px] py-[12px] flex items-center justify-center my-[8px] mx-auto shadow-xs">
          <p className="text-[12px] font-normal leading-[17px] text-[#6B7280] text-center">
            Project match established. You can<br />
            now chat directly regarding<br />
            &ldquo;Instagram Management&rdquo;.
          </p>
        </div>

        {/* 3. Date Divider (Figma Node 1034:2665) */}
        <div className="w-full flex items-center justify-center my-[4px] relative">
          <div className="w-full border-t border-[#E5E7EB] absolute" />
          <span className="bg-white px-[12px] text-[11px] font-medium text-[#9CA3AF] relative z-10">
            Today
          </span>
        </div>

        {/* 4. Fresh Chat Content Stream */}
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
                Say hello to Sarah to discuss requirements, project milestones, or share ideas.
              </p>
            </div>
          </div>
        ) : (
          /* Sent & Received Messages Stream */
          <div className="w-full flex flex-col gap-[16px] flex-1">
            {messages.map((msg) => {
              const isUser = msg.sender === 'You';
              const isSystem = msg.sender === 'System' || msg.isMilestone;

              // Render Milestone Card Event
              if (isSystem && msg.milestoneData) {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-gradient-to-b from-[#FFF5F5] to-[#FEF2F2] border border-[#FEE2E2] rounded-[24px] p-[20px] flex flex-col items-center text-center relative overflow-hidden my-[8px] shadow-xs"
                  >
                    {/* Confetti Background Decor & Verified Badge */}
                    <div className="w-[48px] h-[48px] rounded-full bg-[#0048B3] text-white flex items-center justify-center shadow-md mb-[10px] relative z-10">
                      <CheckmarkBadge01Icon size={26} color="#FFFFFF" />
                    </div>

                    <h3 className="text-[15px] font-medium text-[#111827] mb-[4px] relative z-10">
                      {msg.milestoneData.title}
                    </h3>
                    <p className="text-[12px] text-[#6B7280] leading-[16px] max-w-[250px] mb-[14px] relative z-10">
                      {msg.milestoneData.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => alert('Milestone 1 details & payment breakdown')}
                      className="bg-[#0048B3] text-white text-[12px] font-medium px-[22px] py-[9px] rounded-full hover:bg-[#003EA3] active:scale-95 transition-all shadow-sm cursor-pointer outline-none border-none relative z-10"
                    >
                      {msg.milestoneData.buttonText}
                    </button>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`w-full flex flex-col gap-[6px] ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Message Header (Sender Name + Timestamp) */}
                  <div className="flex items-center gap-[6px] px-[2px]">
                    {isUser ? (
                      <>
                        <span className="text-[11px] font-normal text-[#9CA3AF]">{msg.timestamp}</span>
                        <span className="text-[13px] font-medium text-[#111827]">You</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[13px] font-medium text-[#111827]">Sarah Jenkins.</span>
                        <span className="text-[11px] font-normal text-[#9CA3AF]">{msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  {/* Main Message Bubble */}
                  <div
                    className={`max-w-[290px] p-[14px] text-left rounded-[16px] ${
                      isUser
                        ? 'bg-[#0048B3] text-white rounded-tr-[4px] shadow-xs'
                        : 'bg-[#F9FAFB] border border-[#F3F4F6] text-[#272931] rounded-tl-[4px]'
                    }`}
                  >
                    <p className="text-[13px] font-normal leading-[18px]">{msg.text}</p>
                  </div>

                  {/* Attachment Card (if present) */}
                  {msg.attachment && (
                    <div className="w-[290px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[16px] p-[12px] flex items-center justify-between mt-[4px] shadow-xs hover:border-[#0048B3]/30 transition-all">
                      <div className="flex items-center gap-[10px] min-w-0 flex-1">
                        <div className="w-[42px] h-[42px] rounded-[12px] bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center shrink-0">
                          <File02Icon size={22} color="#EF4444" />
                        </div>
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className="text-[13px] font-medium leading-[16px] text-[#111827] truncate w-full text-left">
                            {msg.attachment.name}
                          </span>
                          <span className="text-[11px] font-normal leading-[14px] text-[#9CA3AF] text-left mt-[2px]">
                            {msg.attachment.size} &bull; {msg.attachment.type}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${msg.attachment?.name}...`)}
                        className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer outline-none border-none bg-transparent shrink-0 ml-[4px]"
                        aria-label="Download attachment"
                      >
                        <Download01Icon size={20} color="#6B7280" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}

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
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} className="h-[2px] w-full" />

        {/* 5. Message Text Input Bar (Figma Node 1036:2773) */}
        <div className="w-full flex items-center gap-[8px] mt-auto pt-[12px] pb-[4px]">
          {/* Plus / Attachment Button */}
          <button
            type="button"
            onClick={() => {
              const attachMsg = {
                id: `attach-${Date.now()}`,
                sender: 'You',
                text: '📎 Attached: Project_Proposal_v1.pdf (4.2 MB)',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setMessages((prev) => [...prev, attachMsg]);
            }}
            className="w-[40px] h-[40px] rounded-full bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-center text-[#272931] hover:bg-gray-100/80 active:scale-95 transition-all outline-none cursor-pointer shrink-0"
            aria-label="Add attachment"
          >
            <Add01Icon size={18} color="#272931" className="w-[18px] h-[18px]" />
          </button>

          {/* Input Capsule with Mic Icon */}
          <div className="flex-1 h-[44px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[22px] px-[14px] flex items-center gap-[8px] focus-within:border-[#0048B3]/40 focus-within:bg-white transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Send a message"
              className="flex-1 bg-transparent text-[13px] text-[#111827] placeholder-[#9CA3AF] outline-none font-normal"
            />
            <button
              type="button"
              onClick={() => {
                const voiceMsg = {
                  id: `voice-${Date.now()}`,
                  sender: 'You',
                  text: '🎙️ Voice note (0:15)',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages((prev) => [...prev, voiceMsg]);
              }}
              className="text-[#272931] hover:text-[#0048B3] transition-colors outline-none cursor-pointer p-1 border-none bg-transparent"
              aria-label="Voice input"
            >
              <Mic01Icon size={18} color="#272931" className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendMessage}
            className="w-[40px] h-[40px] rounded-full bg-[#0048B3] flex items-center justify-center text-white shadow-button-inset hover:bg-[#003EA3] active:scale-95 transition-all outline-none cursor-pointer shrink-0 border-none"
            aria-label="Send message"
          >
            <ArrowUp02Icon size={18} color="#FFFFFF" className="w-[18px] h-[18px]" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default FreshChatScreen;
