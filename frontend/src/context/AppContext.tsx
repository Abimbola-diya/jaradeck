import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "./AuthContext";

export type AppRole = "customer" | "freelancer" | "worker" | "admin";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  role: AppRole | null;
  avatarUrl?: string;
  phone?: string;
  onboardingCompleted?: boolean;
}

export interface AppContextValue {
  user: AppUser;
  role: AppRole | null;
  currentScreen: string;
  navigateTo: (screen: string) => void;
  updateUser: (partialData: Partial<AppUser>) => void;
}

const EMPTY_USER: AppUser = {
  id: "",
  email: "",
  fullName: "",
  role: null,
};

/** Logical screen keys used across the app mapped to router paths. */
const SCREEN_PATHS: Record<string, string> = {
  "/": "/",
  "/login": "/login",
  "/signup": "/signup",
  "/waitlist": "/waitlist",
  "/apply": "/apply",
  "/onboarding": "/onboarding",
  "shared/role-selection": "/onboarding",
  "shared/otp-verification": "/onboarding",
  "shared/settings": "/dashboard/settings",
  "shared/payouts": "/dashboard/settings/payout",
  "shared/profile-portfolio": "/dashboard/settings/profile-portfolio",
  "shared/portfolio-upload": "/dashboard/settings/profile-portfolio",
  "shared/availability": "/dashboard/settings/availability",
  "freelancer/dashboard": "/dashboard",
  "freelancer/wallet": "/dashboard/wallet",
  "freelancer/withdraw": "/dashboard/wallet/withdraw",
  "freelancer/withdraw-bank": "/dashboard/wallet/withdraw-bank",
  "freelancer/confirm-withdraw": "/dashboard/wallet/confirm-withdraw",
  "freelancer/enter-pin": "/dashboard/wallet/enter-pin",
  "freelancer/chat": "/dashboard/chat",
  "freelancer/chat-thread": "/dashboard/chat-thread",
  "freelancer/fresh-chat": "/dashboard/fresh-chat",
  "customer/home": "/dashboard",
  "customer/chat": "/dashboard/chat",
  "customer/project-details": "/dashboard",
  "customer/recommendations": "/dashboard",
  "customer/freelancer-profile": "/dashboard",
};

const PATH_SCREENS: { prefix: string; screen: string }[] = Object.entries(SCREEN_PATHS)
  .map(([screen, path]) => ({ prefix: path, screen }))
  .sort((a, b) => b.prefix.length - a.prefix.length);

const AppContext = createContext<AppContextValue | undefined>(undefined);

const toRole = (value?: string): AppRole | null => {
  if (value === "customer" || value === "freelancer" || value === "worker" || value === "admin") {
    return value;
  }
  return null;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAuthStore().user;

  const [user, setUser] = useState<AppUser>(EMPTY_USER);

  useEffect(() => {
    if (!authUser) {
      setUser(EMPTY_USER);
      return;
    }
    setUser({
      id: authUser.id,
      email: authUser.email,
      fullName: authUser.full_name ?? "",
      role: toRole(authUser.role),
      avatarUrl: authUser.avatar_url,
      phone: authUser.phone,
      onboardingCompleted: authUser.onboarding_completed,
    });
  }, [authUser]);

  const navigateTo = useCallback(
    (screen: string) => {
      const path = SCREEN_PATHS[screen] ?? screen;
      navigate(path);
    },
    [navigate],
  );

  const updateUser = useCallback((partialData: Partial<AppUser>) => {
    setUser((prev) => ({ ...prev, ...partialData }));
  }, []);

  const currentScreen = useMemo(() => {
    const match = PATH_SCREENS.find(({ prefix }) =>
      prefix === "/" ? location.pathname === "/" : location.pathname.startsWith(prefix),
    );
    return match?.screen ?? location.pathname;
  }, [location.pathname]);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      role: user.role,
      currentScreen,
      navigateTo,
      updateUser,
    }),
    [user, currentScreen, navigateTo, updateUser],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
};
