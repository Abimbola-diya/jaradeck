import { useEffect, useRef, useState } from 'react';

// Center navigation pill. The four primary marketing links, plus the sliding
// white "active" indicator that animates behind whichever tab is active.
const NAV_TABS = [
  { key: 'hire', label: 'Hire Talent', path: '/' },
  { key: 'how', label: 'How It Works', path: '/' },
  { key: 'why', label: 'Why Jaradeck', path: '/' },
  { key: 'join', label: 'Use Jaradeck', path: '/waitlist' },
];

export default function Nav({ activeTab, pathname, onSelect }) {
  const mainPillRef = useRef(null);
  const btnRefs = useRef({});

  // Absolute position of the sliding indicator inside the pill.
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // A tab is "active" only on its own route: the homepage tabs light up on
  // "/", and "Use Jaradeck" also lights up whenever we're on /waitlist.
  const isTabActive = (key) =>
    key === 'join'
      ? activeTab === 'join' || pathname === '/waitlist'
      : activeTab === key && pathname === '/';

  // Move the sliding indicator to sit behind the active tab.
  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = btnRefs.current[activeTab];

      if (activeEl && mainPillRef.current) {
        const pillRect = mainPillRef.current.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        if (activeRect.width > 0) {
          setIndicatorStyle({
            left: activeRect.left - pillRect.left,
            width: activeRect.width,
            height: activeRect.height,
            opacity: 1,
          });
          return;
        }
      }
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    };

    updateIndicator();
    document.fonts.ready.then(updateIndicator);
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  return (
    <nav className="nav-main-pill" ref={mainPillRef}>
      {/* Sliding active white pill background indicator */}
      <div className="nav-active-indicator" style={indicatorStyle}></div>

      {NAV_TABS.map(({ key, label, path }) => (
        <button
          key={key}
          ref={(el) => { btnRefs.current[key] = el; }}
          className={`nav-link-btn ${isTabActive(key) ? 'active' : ''}`}
          onClick={() => onSelect(key, path)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
