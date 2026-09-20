import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search01Icon } from 'hugeicons-react';
import { useApp } from '../context/AppContext';

export function WorkerChatScreen() {
  const navigate = useNavigate();
  const { role, navigateTo, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // Default Active Conversations List
  const activeConversations = [
    {
      id: '1',
      name: 'Sarah Jenkins',
      lastMessage: 'Are you available for a quick sync?',
      timestamp: '10:20 AM',
      unreadCount: 1,
      isOnline: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: '2',
      name: 'Match: E-commerce build',
      lastMessage: 'System: You have been matched with Alex',
      timestamp: '10:15 AM',
      unreadCount: 1,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: '3',
      name: 'Marcus Chen',
      lastMessage: 'Thanks for the update. Talk soon!',
      timestamp: '09:45 AM',
      unreadCount: 0,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
  ];

  // In-memory messages store per thread
  const [threadMessages, setThreadMessages] = useState({
    '1': [
      { id: 1, sender: 'them', text: 'Hi Emmanuel! Are you available for a quick sync about the project scope?', time: '10:18 AM' },
      { id: 2, sender: 'me', text: 'Hey Sarah! Yes, I am available now. What do you have in mind?', time: '10:19 AM' },
      { id: 3, sender: 'them', text: 'Are you available for a quick sync?', time: '10:20 AM' },
    ],
    '2': [
      { id: 1, sender: 'system', text: 'System: You have been matched with Alex for E-commerce build', time: '10:10 AM' },
      { id: 2, sender: 'them', text: 'Hi! Excited to work together on this project.', time: '10:15 AM' },
    ],
    '3': [
      { id: 1, sender: 'them', text: 'Thanks for sending over the design files!', time: '09:40 AM' },
      { id: 2, sender: 'me', text: 'No problem, let me know if you need any adjustments.', time: '09:42 AM' },
      { id: 3, sender: 'them', text: 'Thanks for the update. Talk soon!', time: '09:45 AM' },
    ]
  });

  const handleBack = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (selectedThread) {
      setSelectedThread(null);
      return;
    }
    navigate('/dashboard');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedThread) return;

    const threadId = selectedThread.id;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreadMessages((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMsg]
    }));

    setMessageInput('');
  };

  const filteredConversations = activeConversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------------------------------------------------
  // VIEW 1: CHAT THREAD DETAIL ROOM (When a conversation is clicked)
  // -------------------------------------------------------------
  if (selectedThread) {
    const currentMessages = threadMessages[selectedThread.id] || [];

    return (
      <div
        className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[21px] pt-[20px] pb-[40px] relative overflow-hidden select-none mx-auto"
        style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        {/* Room Header */}
        <header className="w-full flex items-center justify-between pt-[20px] pb-[16px] border-b border-[#F3F4F6] relative z-30">
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={handleBack}
              className="w-[40px] h-[40px] rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] active:scale-95 flex items-center justify-center transition-all cursor-pointer outline-none border-none shrink-0 shadow-sm"
              aria-label="Back to messages list"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12131A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            <div className="flex items-center gap-[10px]">
              <div className="relative w-[38px] h-[38px]">
                <img
                  src={selectedThread.avatar}
                  alt={selectedThread.name}
                  className="w-[38px] h-[38px] rounded-[10px] object-cover bg-gray-100"
                />
                {selectedThread.isOnline && (
                  <span className="absolute bottom-0 right-0 w-[9px] h-[9px] bg-[#10B981] rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-[15px] font-medium leading-[19px] text-[#12131A] truncate max-w-[180px]">
                  {selectedThread.name}
                </h1>
                <span className="text-[12px] text-[#10B981] font-normal leading-[14px]">
                  {selectedThread.isOnline ? 'Online' : 'Active now'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Message Thread History */}
        <div className="w-full flex-1 overflow-y-auto py-[16px] flex flex-col gap-[12px] scrollbar-none">
          <div className="w-full flex items-center justify-center my-[8px]">
            <span className="text-[11px] font-medium text-[#9CA3AF] bg-[#F5F5F7] px-[10px] py-[3px] rounded-full">
              Today
            </span>
          </div>

          <AnimatePresence initial={false}>
            {currentMessages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="w-full flex justify-center my-[4px]">
                    <span className="text-[12px] text-[#6B7280] bg-[#F3F4F6] px-[12px] py-[6px] rounded-[10px] text-center max-w-[85%] font-medium">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = msg.sender === 'me';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-[14px] py-[10px] rounded-[16px] text-[14px] leading-[19px] font-normal shadow-xs ${
                      isMe
                        ? 'bg-[#0048B3] text-white rounded-br-[4px]'
                        : 'bg-[#F3F4F6] text-[#12131A] rounded-bl-[4px]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] mt-[4px] px-[2px]">
                    {msg.time}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Send Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="w-full pt-[10px] pb-[8px] border-t border-[#F3F4F6] bg-white flex items-center gap-[8px]"
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-[44px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-[18px] text-[14px] text-[#12131A] placeholder-[#9CA3AF] outline-none focus:border-[#0048B3] transition-colors"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all border-none outline-none shrink-0 ${
              messageInput.trim()
                ? 'bg-[#0048B3] text-white cursor-pointer hover:bg-[#003EA3] active:scale-95 shadow-sm'
                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE CHAT THREADS LIST
  // -------------------------------------------------------------
  return (
    <div
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[24px] pt-[20px] pb-[100px] relative overflow-hidden select-none mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Content Container */}
      <div className="w-full flex flex-col items-center h-full">
        {/* Header Navigation Bar */}
        <header className="w-full flex items-center justify-between pt-[24px] pb-[16px] relative z-30">
          <div className="flex items-center gap-[14px]">
            <button
              type="button"
              onClick={handleBack}
              className="w-[40px] h-[40px] rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] active:scale-95 flex items-center justify-center transition-all cursor-pointer outline-none border-none shrink-0 shadow-sm"
              aria-label="Go back to dashboard"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12131A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <h1 className="text-[22px] font-medium leading-[28px] tracking-[-0.02em] text-[#12131A]">
              Messages
            </h1>
          </div>
        </header>

        {/* Search Bar */}
        <div className="w-full mt-[16px] mb-[16px]">
          <div className="w-full h-[48px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[16px] px-[16px] flex items-center gap-[12px] focus-within:border-[#0048B3]/50 focus-within:bg-white transition-all shadow-xs">
            <Search01Icon size={20} color="#9CA3AF" className="w-[20px] h-[20px] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full bg-transparent text-[14px] text-[#111827] placeholder-[#9CA3AF] outline-none font-normal"
            />
          </div>
        </div>

        {/* Active Chat Threads List (Generous Vertical Spacing) */}
        <div className="w-full flex flex-col mt-[8px]">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 text-[14px] text-[#9CA3AF] font-normal">
              No messages found matching "{searchQuery}"
            </div>
          ) : (
            filteredConversations.map((item) => {
              const hasUnread = (item.unreadCount ?? 0) > 0;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedThread(item)}
                  className="w-full flex items-center cursor-pointer hover:bg-gray-50/70 active:bg-gray-100/50 transition-colors"
                >
                  {/* Left: Avatar (Outside the bottom divider line) */}
                  <div className="relative w-[52px] h-[52px] shrink-0 my-[18px]">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      width="52"
                      height="52"
                      className="w-[52px] h-[52px] rounded-[16px] object-cover bg-gray-100"
                    />
                    {item.isOnline && (
                      <span className="absolute bottom-0 right-0 w-[11px] h-[11px] bg-[#10B981] rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Right: Text + Timestamp Container with Inset Bottom Divider Line */}
                  <div className="flex-1 flex items-center justify-between ml-[16px] py-[20px] border-b border-[#ECECEE] min-w-0">
                    {/* Name and Last Message */}
                    <div className="flex flex-col items-start min-w-0 flex-1 pr-[8px]">
                      <span className="text-[15px] font-medium leading-[20px] text-[#12131A] truncate w-full">
                        {item.name}
                      </span>
                      <span
                        className={`text-[13px] font-normal leading-[18px] truncate w-full mt-[4px] ${
                          hasUnread ? 'text-[#12131A] font-medium' : 'text-[#8A8A8E]'
                        }`}
                      >
                        {item.lastMessage}
                      </span>
                    </div>

                    {/* Timestamp + Unread Blue Dot */}
                    <div className="flex flex-col items-end gap-[6px] shrink-0">
                      <span className="text-[12px] font-normal leading-[15px] text-[#8A8A8E]">
                        {item.timestamp}
                      </span>
                      {hasUnread ? (
                        <span className="w-[8px] h-[8px] rounded-full bg-[#0048B3]" />
                      ) : (
                        <div className="w-[8px] h-[8px]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkerChatScreen;
