import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { API_BASE_URL } from "../lib/api"; // Ensure path matches your project structure]

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: "customer" | "worker" | "freelancer" | string;
  avatar_url?: string;
  one_liner?: string;
  phone?: string;
  onboarding_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (partialData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // AuthContext.tsx
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("jaradeck_token");
      const storedUser = localStorage.getItem("jaradeck_user");

      if (storedToken && storedUser) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          if (res.ok) {
            const freshUserData = await res.json();
            setToken(storedToken);
            setUser(freshUserData);
          } else {
            // Token expired or invalid -> clear stale session
            logout();
          }
        } catch (err) {
          console.error("Auth validation failed", err);
          // Do not call logout on network glitch/offline state to avoid wiping session
          setToken(storedToken);
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("jaradeck_token", authToken);
    localStorage.setItem("jaradeck_user", JSON.stringify(userData));
  };

  // AuthContext.tsx

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error("Failed to notify backend on logout", err);
      }
    }

    // Clear local auth state and storage
    setUser(null);
    setToken(null);
    localStorage.removeItem("jaradeck_token");
    localStorage.removeItem("jaradeck_user");
  };

  const updateUser = (partialData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;

      const updated = { ...prev, ...partialData };

      localStorage.setItem("jaradeck_user", JSON.stringify(updated));

      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};;;;

export const useAuthStore = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }

  return context;
};
