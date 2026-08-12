import BrandLogo from './BrandLogo';

// Full-screen mobile navigation drawer. Rendered only while open.
export default function MobileMenu({ activeTab, pathname, onSelect, onClose }) {
  // Primary rows navigate; secondary rows are placeholders that just close.
  const isTabActive = (key) =>
    key === 'join'
      ? pathname === '/waitlist'
      : activeTab === key && pathname === '/';

  return (
    <div className="mobile-menu-overlay">
      {/* Top Bar inside Overlay */}
      <div className="mobile-menu-header">
        <div className="mobile-menu-header-actions">
          <button
            className="mobile-action-circle"
            aria-label="Jaradeck Logo Action"
            onClick={() => { onClose(); onSelect('why', '/'); }}
          >
            <BrandLogo width={22} tone="blue" />
          </button>

          <button
            className="mobile-menu-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Sectioned Menu Items List */}
      <div className="mobile-menu-list">
        <button
          className={`mobile-nav-row ${isTabActive('hire') ? 'active' : ''}`}
          onClick={() => onSelect('hire', '/')}
        >
          <span className="mobile-row-text">Hire Talent</span>
        </button>

        <button
          className={`mobile-nav-row ${isTabActive('how') ? 'active' : ''}`}
          onClick={() => onSelect('how', '/')}
        >
          <span className="mobile-row-text">How It Works</span>
        </button>

        <button
          className={`mobile-nav-row ${isTabActive('why') ? 'active' : ''}`}
          onClick={() => onSelect('why', '/')}
        >
          <span className="mobile-row-text">Why Jaradeck</span>
        </button>

        <button
          className={`mobile-nav-row ${isTabActive('join') ? 'active' : ''}`}
          onClick={() => onSelect('join', '/waitlist')}
        >
          <span className="mobile-row-text">Use Jaradeck</span>
        </button>

        <button className="mobile-nav-row" onClick={onClose}>
          <span className="mobile-row-text">Contact Us</span>
        </button>

        <button className="mobile-nav-row" onClick={onClose}>
          <span className="mobile-row-text">FAQs</span>
        </button>

        <button className="mobile-nav-row" onClick={onClose}>
          <span className="mobile-row-text">Blog</span>
        </button>
      </div>
    </div>
  );
}
