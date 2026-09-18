import React from 'react';
import { Briefcase01Icon, Wallet05Icon, Chat01Icon, Settings05Icon } from 'hugeicons-react';

import { useApp } from '../../context/AppContext';

export type NavTab = 'home' | 'wallet' | 'chat' | 'settings';

interface BottomNavProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

const TABS: {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; className?: string }>;
}[] = [
  { id: 'home', label: 'Home', icon: Briefcase01Icon },
  { id: 'wallet', label: 'Wallet', icon: Wallet05Icon },
  { id: 'chat', label: 'Chat', icon: Chat01Icon },
  { id: 'settings', label: 'Settings', icon: Settings05Icon },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab: explicitActiveTab, onTabChange }) => {
  const { role, currentScreen, navigateTo } = useApp();

  // Determine active tab automatically from current screen if not explicitly passed
  const getTabFromScreen = (): NavTab => {
    if (
      currentScreen === 'shared/settings' ||
      currentScreen === 'shared/payouts' ||
      currentScreen === 'shared/profile-portfolio' ||
      currentScreen === 'shared/portfolio-upload'
    ) {
      return 'settings';
    }
    if (
      currentScreen === 'shared/availability' ||
      currentScreen === 'freelancer/chat' ||
      currentScreen === 'freelancer/chat-thread' ||
      currentScreen === 'freelancer/fresh-chat' ||
      currentScreen === 'customer/chat'
    ) {
      return 'chat';
    }
    if (
      currentScreen === 'customer/project-details' ||
      currentScreen.startsWith('freelancer/wallet') ||
      currentScreen.startsWith('freelancer/withdraw') ||
      currentScreen === 'freelancer/confirm-withdraw' ||
      currentScreen === 'freelancer/enter-pin'
    ) {
      return 'wallet';
    }
    return 'home';
  };

  const resolvedActiveTab = explicitActiveTab ?? getTabFromScreen();
  const activeIndex = Math.max(0, TABS.findIndex((tab) => tab.id === resolvedActiveTab));
  const [prevIndex, setPrevIndex] = React.useState<number>(activeIndex);
  const [isSliding, setIsSliding] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (activeIndex !== prevIndex) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setIsSliding(false);
        setPrevIndex(activeIndex);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, prevIndex]);

  const handleTabClick = (tab: NavTab) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }

    // Default global tab routing based on active role
    if (tab === 'home') {
      navigateTo(role === 'customer' ? 'customer/home' : 'freelancer/dashboard');
    } else if (tab === 'wallet') {
      navigateTo(role === 'customer' ? 'customer/project-details' : 'freelancer/wallet');
    } else if (tab === 'chat') {
      navigateTo(role === 'customer' ? 'customer/chat' : 'freelancer/chat');
    } else if (tab === 'settings') {
      navigateTo('shared/settings');
    }
  };

  return (
    <nav
      className="w-[350px] h-[58px] rounded-[44px] p-[5px] relative flex items-center select-none overflow-hidden"
      style={{
        background:
          'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(245, 246, 248, 0.65) 50%, rgba(255, 255, 255, 0.78) 100%)',
        backdropFilter: 'blur(36px) saturate(220%) contrast(105%) brightness(108%)',
        WebkitBackdropFilter: 'blur(36px) saturate(220%) contrast(105%) brightness(108%)',
        border: '1px solid rgba(255, 255, 255, 0.92)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.04), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1.5px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Specular Ambient Glow Overlay */}
      <div
        className="absolute inset-0 rounded-[44px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% -20%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      {/* Sliding Liquid Glass Pill Indicator */}
      <div
        className="absolute top-[5px] left-[5px] w-[73px] h-[48px] rounded-[34px] pointer-events-none z-0"
        style={{
          transform: `translateX(${activeIndex * 89}px) scaleX(${isSliding ? 1.05 : 1})`,
          transformOrigin: activeIndex >= prevIndex ? 'left center' : 'right center',
          transition: 'transform 420ms cubic-bezier(0.34, 1.45, 0.64, 1)',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(235, 237, 242, 0.90) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.98)',
          boxShadow:
            '0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.04)',
        }}
      />

      {/* Nav Tab Buttons */}
      <div className="w-full flex items-center justify-between relative z-10">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = resolvedActiveTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className="w-[73px] h-[48px] rounded-[34px] flex flex-col items-center justify-center gap-[2px] transition-transform duration-180 active:scale-[0.88] ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none cursor-pointer group select-none"
              aria-label={tab.label}
            >
              <div
                className={`transition-all duration-300 transform ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  isActive ? 'scale-110 -translate-y-[1px]' : 'group-hover:scale-105'
                }`}
              >
                <IconComponent
                  size={20}
                  color={isActive ? '#0A0A0A' : '#6E6E6E'}
                  className="w-[20px] h-[20px] transition-colors duration-300"
                />
              </div>
              <span
                className={`text-[10px] font-medium leading-[10px] text-center tracking-[-0.01em] transition-colors duration-300 ${
                  isActive ? 'text-[#0A0A0A] font-semibold' : 'text-[#6E6E6E]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
