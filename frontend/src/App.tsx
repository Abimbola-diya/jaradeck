import { useLocation } from "react-router-dom";
import BackgroundGrid from "./components/BackgroundGrid";
import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const location = useLocation();

  const isProductRoute =
    ["/onboarding", "/admin_view", "/apply", "/apply/success"].includes(
      location.pathname,
    ) || location.pathname.startsWith("/dashboard");

  return (
    <div className={isProductRoute ? "product-page" : "hero-page"}>
      {!isProductRoute && <BackgroundGrid />}
      {!isProductRoute && <Header />}

      <AppRoutes />
    </div>
  );
}
  