import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext(null);

const DEFAULT_FREELANCER_STATE = {
  emailVerified: false,
  profileCompleted: false,
  payoutsConfigured: false,
  availabilitySet: false,
  dismissedChecklistIds: [],
};

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // User state from localStorage or default
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jaradeck_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          fullName: parsed.full_name || parsed.name || 'Emmanuel Taiwo',
          first_name: parsed.first_name || 'Emmanuel',
          avatar_url: parsed.avatar_url || parsed.picture || null,
          email: parsed.email || 'emmanuel@example.com',
          ...parsed,
        };
      }
    } catch (e) {
      console.warn('Failed to parse jaradeck_user from localStorage', e);
    }
    return {
      fullName: 'Emmanuel Taiwo',
      first_name: 'Emmanuel',
      avatar_url: null,
      email: 'emmanuel@example.com',
    };
  });

  // Freelancer checklist state
  const [freelancerState, setFreelancerState] = useState(() => {
    try {
      const stored = localStorage.getItem('jaradeck_freelancer_state');
      if (stored) {
        return { ...DEFAULT_FREELANCER_STATE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse jaradeck_freelancer_state from localStorage', e);
    }
    return DEFAULT_FREELANCER_STATE;
  });

  // Sync freelancer state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jaradeck_freelancer_state', JSON.stringify(freelancerState));
    } catch (e) {
      console.warn('Failed to save jaradeck_freelancer_state to localStorage', e);
    }
  }, [freelancerState]);

  const updateFreelancerState = (updates) => {
    setFreelancerState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const toggleChecklistItem = (itemId) => {
    setFreelancerState((prev) => {
      const keyMap = {
        'verify-email': 'emailVerified',
        'setup-profile': 'profileCompleted',
        'payout-details': 'payoutsConfigured',
        'availability': 'availabilitySet',
      };
      const key = keyMap[itemId];
      if (!key) return prev;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const resetChecklist = () => {
    setFreelancerState(DEFAULT_FREELANCER_STATE);
  };

  // Determine current freelancer stage
  const currentFreelancerStage = (() => {
    const checklistIds = ['verify-email', 'setup-profile', 'payout-details', 'availability'];
    const dismissed = freelancerState.dismissedChecklistIds || [];
    const remainingVisible = checklistIds.filter((id) => !dismissed.includes(id));

    if (remainingVisible.length > 0) {
      return 'checklist';
    }
    return 'empty';
  })();

  const [withdrawalAmount, setWithdrawalAmount] = useState(20000);

  const navigateTo = (path, extraState = {}) => {
    if (!path) return;
    const routeMap = {
      'shared/otp-verification': '/onboarding',
      'shared/profile-portfolio': '/dashboard/profile-portfolio',
      'shared/add-portfolio-work': '/dashboard/add-portfolio-work',
      'shared/payouts': '/dashboard/wallet',
      'shared/availability': '/dashboard/settings',
      'freelancer/project-details': '/dashboard/projects',
      'freelancer/withdraw-options': '/dashboard/withdraw-options',
      'freelancer/withdraw-bank': '/dashboard/withdraw-bank',
      'freelancer/confirm-withdraw': '/dashboard/confirm-withdraw',
      'freelancer/enter-pin': '/dashboard/enter-pin',
      'freelancer/withdraw-success': '/dashboard/withdraw-success',
      'freelancer/wallet': '/dashboard/wallet',
      'freelancer/chat': '/dashboard/chat',
      'freelancer/chat-thread': '/dashboard/chat-thread',
      'freelancer/fresh-chat': '/dashboard/fresh-chat',
    };
    const targetPath = routeMap[path] || (path.startsWith('/') ? path : `/${path}`);
    const safeState = extraState && (extraState.nativeEvent || extraState.preventDefault || extraState._reactName)
      ? {}
      : extraState;
    navigate(targetPath, { state: safeState });
  };

  // Conversations state matching Figma chat screens
  const INITIAL_CONVERSATIONS = [
    {
      id: '1',
      name: 'Sarah Jenkins',
      lastMessage: 'Are you available for a quick sync?',
      timestamp: '10:20AM',
      unreadCount: 1,
      isOnline: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: '2',
      name: 'Match: E-commerce build',
      lastMessage: 'System: You have been matched with Alex',
      timestamp: '10:20AM',
      unreadCount: 1,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: '3',
      name: 'Marcus Chen',
      lastMessage: 'Thanks for the update. Talk soon!',
      timestamp: '10:20AM',
      unreadCount: 0,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [role, setRole] = useState('freelancer');

  const clearConversations = () => {
    setConversations([]);
  };

  const restoreConversations = () => {
    setConversations(INITIAL_CONVERSATIONS);
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        navigateTo,
        goBack,
        role,
        setRole,
        conversations,
        setConversations,
        clearConversations,
        restoreConversations,
        freelancerState,
        updateFreelancerState,
        toggleChecklistItem,
        resetChecklist,
        currentFreelancerStage,
        withdrawalAmount,
        setWithdrawalAmount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
