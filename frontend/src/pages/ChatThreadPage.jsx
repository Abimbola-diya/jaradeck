import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import emmanuelProfile from '../assets/emmanuel.png';
import coffette from '../assets/coffette.svg';
import successTick from '../assets/success tick.svg';

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 40 48" fill="none" aria-hidden="true" width="40" height="48">
      <rect width="40" height="48" rx="6" fill="#FEE2E2" />
      <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="700">PDF</text>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}



function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="18" height="18">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="18" height="18">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

export default function ChatThreadPage() {
  const { id } = useParams();
  const [input, setInput] = useState('');

  // In a real app you'd fetch the thread by `id`
  const contact = { name: 'Sarah Jenkins.', subtitle: 'Active Project: Instagram Management', avatar: emmanuelProfile };

  return (
    <main className="worker-dashboard chat-thread-page">
      {/* Header */}
      <div className="chat-thread-header">
        <BackButton to="/dashboard/chat" />
        <img src={contact.avatar} alt={contact.name} className="chat-thread-avatar" />
        <div className="chat-thread-contact">
          <span className="chat-thread-name">{contact.name}</span>
          <span className="chat-thread-subtitle">{contact.subtitle}</span>
        </div>
        <button className="dashboard-icon-btn chat-thread-more" aria-label="More options">
          <DotsIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-thread-messages">
        {/* System notice */}
        <div className="chat-system-notice">
          Project match established. You can now chat directly regarding "Instagram Management".
        </div>

        {/* Date divider */}
        <div className="chat-date-divider"><span>Today</span></div>

        {/* Incoming message */}
        <div className="chat-msg-group">
          <span className="chat-msg-sender">{contact.name} <span className="chat-msg-time">10:42 AM</span></span>
          <div className="chat-bubble chat-bubble-in">
            Hi! I've put together some initial wireframes for the IG campaign based on our brief. Let me know what you think when you have a moment.
          </div>

          {/* File attachment */}
          <div className="chat-attachment">
            <PdfIcon />
            <div className="chat-attachment-info">
              <span className="chat-attachment-name">IG_Campaign_Wireframes_v1.pdf</span>
              <span className="chat-attachment-meta">2.4 MB • PDF Document</span>
            </div>
            <button className="chat-attachment-dl" aria-label="Download">
              <DownloadIcon />
            </button>
          </div>
        </div>

        {/* Outgoing message */}
        <div className="chat-msg-group chat-msg-group-out">
          <span className="chat-msg-sender chat-msg-sender-out"><span className="chat-msg-time">11:15 AM</span> You</span>
          <div className="chat-bubble chat-bubble-out">
            These look incredible, Sarah. The minimalist approach really fits the brand guidelines we discussed.
          </div>
        </div>

        {/* Milestone card */}
        <div className="chat-milestone-card">
          <div className="chat-milestone-confetti">
            <img src={coffette} alt="" aria-hidden="true" className="chat-milestone-coffette" />
            <img src={successTick} alt="" aria-hidden="true" className="chat-milestone-tick" />
          </div>
          <p className="chat-milestone-title">Milestone 1 Completed</p>
          <p className="chat-milestone-sub">Wireframe delivery approved. Funds for this milestone have been released to talent.</p>
          <button className="chat-milestone-btn">View Milestone Details</button>
        </div>

        {/* Typing indicator */}
        <div className="chat-typing">
          <span /><span /><span />
        </div>
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <button className="chat-input-attach" aria-label="Attach file"><AttachIcon /></button>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="chat-input-send" aria-label="Send"><SendIcon /></button>
      </div>

    </main>
  );
}
