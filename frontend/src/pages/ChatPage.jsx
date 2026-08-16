import { useNavigate } from 'react-router-dom';
import WorkerBottomNav from '../components/WorkerBottomNav';
import BackButton from '../components/BackButton';
import emmanuelProfile from '../assets/emmanuel.png';
import jakeTaiwo from '../assets/Jake Taiwo.png';

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    avatar: emmanuelProfile,
    preview: 'Are you available for a quick sync?',
    time: '10:20AM',
    unread: true,
    online: true,
  },
  {
    id: '2',
    name: 'Match: E-commerce build',
    avatar: jakeTaiwo,
    preview: 'System: You have been matched with Alex',
    time: '10:20AM',
    unread: true,
    online: false,
  },
  {
    id: '3',
    name: 'Marcus Chen',
    avatar: emmanuelProfile,
    preview: 'Thanks for the update. Talk soon!',
    time: '10:20AM',
    unread: false,
    online: false,
  },
];

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <main className="worker-dashboard chat-page">
      <BackButton to="/dashboard" />

      <header className="chat-list-header">
        <h1>Chat</h1>
        <button className="dashboard-icon-btn" aria-label="Notifications">
          <BellIcon />
        </button>
      </header>

      <div className="chat-search-bar">
        <SearchIcon />
        <input type="text" placeholder="Search messages..." />
      </div>

      <ul className="chat-list">
        {CONVERSATIONS.map((c) => (
          <li key={c.id} className="chat-list-item" onClick={() => navigate(`/dashboard/chat/${c.id}`)}>
            <div className="chat-avatar-wrap">
              <img src={c.avatar} alt={c.name} className="chat-avatar" />
              {c.online && <span className="chat-online-dot" />}
            </div>
            <div className="chat-item-body">
              <div className="chat-item-top">
                <span className={`chat-item-name${!c.online && !c.unread ? ' chat-item-name-inactive' : ''}`}>{c.name}</span>
                <span className="chat-item-time">{c.time}</span>
              </div>
              <div className="chat-item-bottom">
                <span className="chat-item-preview">{c.preview}</span>
                {c.unread && <span className="chat-unread-dot" />}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <WorkerBottomNav />
    </main>
  );
}
