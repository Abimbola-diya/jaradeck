import  { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function NavIcon({ type, isActive } : { type: "projects" | "wallet" | "chat" | "settings" ; isActive: boolean }) {
  const icons = {
    projects: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M8 5V3h8v2M7 11h10" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" />
        <path d="M16 13h.01" />
      </>
    ),
    chat: (
      <>
        <path d="M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" />
        <path d="M8 10h8M8 13h5" />
      </>
    ),
    settings: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 8h10M7 12h10M7 16h10" />
        <circle cx="9" cy="8" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="11" cy="16" r="1" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={isActive ? "#0A0A0A" : "#6E6E6E"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-[20px] h-[20px] transition-colors duration-300"
    >
      {icons[type]}
    </svg>
  );
}

export default function WorkerBottomNav() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentRole = searchParams.get("role");

  // Determine current role subpath if using /dashboard/customer or /dashboard/freelancer
  const isCustomerPath = location.pathname.includes("/dashboard/customer");
  const isFreelancerPath = location.pathname.includes("/dashboard/freelancer");

  let basePath = "/dashboard";
  if (isCustomerPath) basePath = "/dashboard/customer";
  else if (isFreelancerPath) basePath = "/dashboard/freelancer";

  const getTargetUrl = (path : string) => {
    const fullPath = path === "/dashboard" ? basePath : `/dashboard${path}`;
    return currentRole ? `${fullPath}?role=${currentRole}` : fullPath;
  };

  const TABS : { label: string; to: string; icon: "projects" | "wallet" | "chat" | "settings"; end?: boolean }[] = [
    {
      label: "Projects",
      to: getTargetUrl("/dashboard"),
      icon: "projects",
      end: true,
    },
    { label: "Wallet", to: getTargetUrl("/wallet"), icon: "wallet" },
    { label: "Chat", to: getTargetUrl("/chat"), icon: "chat" },
    { label: "Settings", to: getTargetUrl("/settings"), icon: "settings" },
  ];

  const getActiveIndex = () => {
    const foundIndex = TABS.findIndex((tab) => {
      const cleanTabPath = tab.to.split("?")[0];
      const cleanCurrentPath = location.pathname;

      if (tab.end) {
        return (
          cleanCurrentPath === "/dashboard" ||
          cleanCurrentPath === "/dashboard/customer" ||
          cleanCurrentPath === "/dashboard/freelancer"
        );
      }
      return cleanCurrentPath.startsWith(cleanTabPath);
    });
    return foundIndex !== -1 ? foundIndex : 0;
  };

  const activeIndex = getActiveIndex();
  const [prevIndex, setPrevIndex] = useState(activeIndex);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (activeIndex !== prevIndex) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setIsSliding(false);
        setPrevIndex(activeIndex);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, prevIndex]);

  return (
    <nav
      aria-label="Worker dashboard navigation"
      className="fixed bottom-[16px] left-0 right-0 z-50 bg-white border-t border-slate-100 py-3 px-6 justify-around max-w-md w-[350px] h-[58px] rounded-[44px] p-[5px] flex items-center select-none overflow-hidden mx-auto"
      style={{
        background:
          "linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(245, 246, 248, 0.65) 50%, rgba(255, 255, 255, 0.78) 100%)",
        backdropFilter:
          "blur(36px) saturate(220%) contrast(105%) brightness(108%)",
        WebkitBackdropFilter:
          "blur(36px) saturate(220%) contrast(105%) brightness(108%)",
        border: "1px solid rgba(255, 255, 255, 0.92)",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.04), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1.5px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <div
        className="absolute inset-0 rounded-[44px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      <div
        className="absolute top-[5px] left-[5px] w-[73px] h-[48px] rounded-[34px] pointer-events-none z-0"
        style={{
          transform: `translateX(${activeIndex * 89}px) scaleX(${isSliding ? 1.05 : 1})`,
          transformOrigin:
            activeIndex >= prevIndex ? "left center" : "right center",
          transition: "transform 420ms cubic-bezier(0.34, 1.45, 0.64, 1)",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(235, 237, 242, 0.90) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.98)",
          boxShadow:
            "0 4px 14px rgba(0, 0, 0, 0.05), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.04)",
        }}
      />

      <div className="w-full flex items-center justify-between relative z-10">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className="w-[73px] h-[48px] rounded-[34px] flex flex-col items-center justify-center gap-[2px] transition-transform duration-180 active:scale-[0.88] ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none group select-none no-underline"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`transition-all duration-300 transform ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isActive
                      ? "scale-110 -translate-y-[1px]"
                      : "group-hover:scale-105"
                  }`}
                >
                  <NavIcon type={tab.icon} isActive={isActive} />
                </div>
                <span
                  className={`text-[10px] leading-[10px] text-center tracking-[-0.01em] transition-colors duration-300 ${
                    isActive
                      ? "text-[#0A0A0A] font-semibold"
                      : "text-[#6E6E6E] font-medium"
                  }`}
                >
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
