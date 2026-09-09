import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/waitlist" ? "join" : "why",
  );

  useEffect(() => {
    if (location.pathname === "/waitlist") {
      setActiveTab((prev) => (prev !== "join" ? "join" : prev));
    } else if (location.pathname === "/") {
      setActiveTab((prev) => (prev === "join" ? "why" : prev));
    }
  }, [location.pathname]);

  const navigateTo = (path, e, extraState) => {
    if (e && (e.clientX || e.currentTarget)) {
      const rect = e.currentTarget?.getBoundingClientRect();
      const originX = rect ? rect.left + rect.width / 2 : e.clientX;
      const originY = rect ? rect.top + rect.height / 2 : e.clientY;
      navigate(path, {
        state: { origin: { x: originX, y: originY }, ...extraState },
      });
    } else {
      navigate(path, { state: extraState });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mainPillRef = useRef(null);
  const hireRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const joinRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  useEffect(() => {
    const updateIndicator = () => {
      const activeRef = {
        hire: hireRef.current,
        how: howRef.current,
        why: whyRef.current,
        join: joinRef.current,
      }[activeTab];

      if (activeRef && mainPillRef.current) {
        const pillRect = mainPillRef.current.getBoundingClientRect();
        const activeRect = activeRef.getBoundingClientRect();

        if (activeRect.width > 0) {
          setIndicatorStyle({
            left: activeRect.left - pillRect.left,
            width: activeRect.width,
            height: activeRect.height,
            opacity: 1,
          });
        } else {
          setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    document.fonts.ready.then(updateIndicator);
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <>
      <header className="nav-header">
        <div className="nav-header-wrapper">
          <div
            className="nav-logo"
            title="Jaradeck"
            onClick={() => navigateTo("/")}
            style={{ cursor: "pointer" }}
          >
            <BrandLogo width={41} />
          </div>

          <nav className="nav-main-pill" ref={mainPillRef}>
            <div className="nav-active-indicator" style={indicatorStyle}></div>

            <button
              ref={hireRef}
              className={`nav-link-btn ${activeTab === "hire" && location.pathname === "/" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("hire");
                navigateTo("/");
              }}
            >
              Hire Talent
            </button>

            <button
              ref={howRef}
              className={`nav-link-btn ${activeTab === "how" && location.pathname === "/" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("how");
                navigateTo("/");
              }}
            >
              How It Works
            </button>

            <button
              ref={whyRef}
              className={`nav-link-btn ${activeTab === "why" && location.pathname === "/" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("why");
                navigateTo("/");
              }}
            >
              Why Jaradeck
            </button>

            <button
              ref={joinRef}
              className={`nav-link-btn ${activeTab === "join" || location.pathname === "/waitlist" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("join");
                navigateTo("/waitlist");
              }}
            >
              Use Jaradeck
            </button>
          </nav>

          <div className="nav-header-right">
            <button
              className="nav-signup-btn"
              onClick={() => navigateTo("/signup")}
            >
              Sign up
            </button>
            <button
              className="nav-login-btn"
              onClick={() => navigateTo("/login")}
            >
              Log in
            </button>
            <button
              className="nav-hamburger"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
            <div className="mobile-menu-header-actions">
              <button
                className="mobile-action-circle"
                aria-label="Jaradeck Logo Action"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo("/");
                }}
              >
                <BrandLogo width={22} tone="blue" />
              </button>
              <button
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="mobile-menu-list">
            <button
              className={`mobile-nav-row ${activeTab === "hire" && location.pathname === "/" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("hire");
                setIsMobileMenuOpen(false);
                navigateTo("/");
              }}
            >
              <span className="mobile-row-text">Hire Talent</span>
            </button>

            <button
              className={`mobile-nav-row ${activeTab === "how" && location.pathname === "/" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("how");
                setIsMobileMenuOpen(false);
                navigateTo("/");
              }}
            >
              <span className="mobile-row-text">How It Works</span>
            </button>

            <button
              className={`mobile-nav-row ${activeTab === "why" && location.pathname === "/" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("why");
                setIsMobileMenuOpen(false);
                navigateTo("/");
              }}
            >
              <span className="mobile-row-text">Why Jaradeck</span>
            </button>

            <button
              className={`mobile-nav-row ${location.pathname === "/waitlist" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("join");
                setIsMobileMenuOpen(false);
                navigateTo("/waitlist");
              }}
            >
              <span className="mobile-row-text">Use Jaradeck</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
