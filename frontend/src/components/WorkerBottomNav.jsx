import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavIcon({ type }) {
  if (type === 'home') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1.66675 11.6666C1.66675 9.32584 1.66675 8.15543 2.22851 7.31469C2.47171 6.95072 2.78421 6.63822 3.14818 6.39502C3.98892 5.83325 5.15931 5.83325 7.50008 5.83325H12.5001C14.8408 5.83325 16.0112 5.83325 16.852 6.39502C17.2159 6.63822 17.5284 6.95072 17.7717 7.31469C18.3334 8.15543 18.3334 9.32584 18.3334 11.6666C18.3334 14.0073 18.3334 15.1778 17.7717 16.0185C17.5284 16.3824 17.2159 16.6949 16.852 16.9382C16.0112 17.4999 14.8408 17.4999 12.5001 17.4999H7.50008C5.15931 17.4999 3.98892 17.4999 3.14818 16.9382C2.78421 16.6949 2.47171 16.3824 2.22851 16.0185C1.66675 15.1778 1.66675 14.0073 1.66675 11.6666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.3334 5.83333C13.3334 4.26198 13.3334 3.47631 12.8452 2.98816C12.3571 2.5 11.5714 2.5 10.0001 2.5C8.42875 2.5 7.64306 2.5 7.15491 2.98816C6.66675 3.47631 6.66675 4.26198 6.66675 5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 9.16675L5.54331 9.33508C8.40425 10.2217 11.5957 10.2217 14.4567 9.33508L15 9.16675M10 10.0001V11.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  if (type === 'wallet') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M1.66675 9.99992C1.66675 6.85722 1.66675 5.28588 2.64306 4.30956C3.61937 3.33325 5.19071 3.33325 8.33342 3.33325H11.6667C14.8094 3.33325 16.3808 3.33325 17.3571 4.30956C18.3334 5.28588 18.3334 6.85722 18.3334 9.99992C18.3334 13.1426 18.3334 14.714 17.3571 15.6903C16.3808 16.6666 14.8094 16.6666 11.6667 16.6666H8.33342C5.19071 16.6666 3.61937 16.6666 2.64306 15.6903C1.66675 14.714 1.66675 13.1426 1.66675 9.99992Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1.66675 8.33325H5.16443C5.75991 8.33325 6.05765 8.33325 6.32468 8.42659C6.48775 8.48359 6.64096 8.56559 6.77884 8.66967C7.00461 8.84009 7.16977 9.08775 7.50008 9.58325C7.83039 10.0788 7.99555 10.3264 8.22132 10.4968C8.35916 10.6009 8.51241 10.6829 8.6755 10.7399C8.9425 10.8333 9.24025 10.8333 9.83575 10.8333H10.1644C10.7599 10.8333 11.0577 10.8333 11.3247 10.7399C11.4877 10.6829 11.641 10.6009 11.7788 10.4968C12.0046 10.3264 12.1697 10.0788 12.5001 9.58325C12.8304 9.08775 12.9956 8.84009 13.2213 8.66967C13.3592 8.56559 13.5124 8.48359 13.6755 8.42659C13.9425 8.33325 14.2402 8.33325 14.8357 8.33325H18.3334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  if (type === 'chat') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6.25 7.08325H13.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.25 10H10.4167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2.0835 9.99992C2.0835 6.26797 2.0835 4.40199 3.24286 3.24262C4.40224 2.08325 6.26821 2.08325 10.0002 2.08325C13.7321 2.08325 15.5981 2.08325 16.7575 3.24262C17.9168 4.40199 17.9168 6.26797 17.9168 9.99992C17.9168 13.7318 17.9168 15.5978 16.7575 16.7573C15.5981 17.9166 13.7321 17.9166 10.0002 17.9166C9.28935 17.9166 8.61868 17.8465 8.00016 17.7145C7.40474 17.5875 7.10703 17.524 6.86431 17.5458C6.6216 17.5676 6.3686 17.6885 5.86261 17.9304L3.89679 18.87C3.12595 19.2386 2.74052 19.4229 2.45037 19.2736C2.16022 19.1243 2.0835 18.6997 2.0835 17.8506V16.6666C2.0835 9.99992 2.0835 9.99992 2.0835 9.99992Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    );
  }

  if (type === 'settings') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2.0835 9.99992C2.0835 6.26797 2.0835 4.40199 3.24286 3.24262C4.40224 2.08325 6.26821 2.08325 10.0002 2.08325C13.7321 2.08325 15.5981 2.08325 16.7575 3.24262C17.9168 4.40199 17.9168 6.26797 17.9168 9.99992C17.9168 13.7318 17.9168 15.5978 16.7575 16.7573C15.5981 17.9166 13.7321 17.9166 10.0002 17.9166C6.26821 17.9166 4.40224 17.9166 3.24286 16.7573C2.0835 15.5978 2.0835 13.7318 2.0835 9.99992Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7.0835 8.33325C6.39314 8.33325 5.8335 7.77361 5.8335 7.08325C5.8335 6.39289 6.39314 5.83325 7.0835 5.83325C7.77385 5.83325 8.3335 6.39289 8.3335 7.08325C8.3335 7.77361 7.77385 8.33325 7.0835 8.33325Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12.9165 14.1667C13.6068 14.1667 14.1665 13.6071 14.1665 12.9167C14.1665 12.2264 13.6068 11.6667 12.9165 11.6667C12.2262 11.6667 11.6665 12.2264 11.6665 12.9167C11.6665 13.6071 12.2262 14.1667 12.9165 14.1667Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8.3335 7.08325H14.1668" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11.6668 12.9167H5.8335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  return null;
}

const tabs = [
  { label: 'Home', to: '/dashboard', icon: 'home', end: true },
  { label: 'Wallet', to: '/dashboard/wallet', icon: 'wallet' },
  { label: 'Chat', to: '/dashboard/chat', icon: 'chat' },
  { label: 'Settings', to: '/dashboard/settings', icon: 'settings' },
];

export default function WorkerBottomNav() {
  return (
    <nav className="dashboard-bottom-nav" aria-label="Worker dashboard navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `dashboard-nav-item ${isActive ? 'dashboard-nav-active' : ''}`}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="activeWorkerTabPill"
                  className="dashboard-nav-active-pill"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 26,
                    mass: 0.65,
                  }}
                />
              )}
              <motion.div
                className="dashboard-nav-content"
                whileTap={{ scale: 0.93 }}
                animate={isActive ? { scale: [0.95, 1.05, 1] } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, duration: 0.2 }}
              >
                <span className="dashboard-nav-icon-wrapper">
                  <NavIcon type={tab.icon} />
                </span>
                <span className="dashboard-nav-label">{tab.label}</span>
              </motion.div>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
