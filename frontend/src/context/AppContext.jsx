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
      'shared/profile-portfolio': '/onboarding',
      'shared/payouts': '/dashboard/wallet',
      'shared/availability': '/dashboard/settings',
      'freelancer/project-details': '/dashboard/projects',
      'freelancer/withdraw-options': '/dashboard/withdraw-options',
      'freelancer/withdraw-bank': '/dashboard/withdraw-bank',
      'freelancer/confirm-withdraw': '/dashboard/confirm-withdraw',
      'freelancer/enter-pin': '/dashboard/enter-pin',
      'freelancer/withdraw-success': '/dashboard/withdraw-success',
      'freelancer/wallet': '/dashboard/wallet',
    };
    const targetPath = routeMap[path] || (path.startsWith('/') ? path : `/${path}`);
    const safeState = extraState && (extraState.nativeEvent || extraState.preventDefault || extraState._reactName)
      ? {}
      : extraState;
    navigate(targetPath, { state: safeState });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        navigateTo,
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
