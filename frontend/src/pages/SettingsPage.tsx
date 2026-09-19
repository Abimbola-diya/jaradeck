  import { useNavigate } from "react-router-dom";
  import { ArrowLeft, ChevronRight, Trash2 } from "lucide-react";
  import WorkerBottomNav from "../components/WorkerBottomNav";
  import { useAuthStore } from "../context/AuthContext";

  interface SettingsItem {
    label: string;
    path: string;
  }

  export default function SettingsPage() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const settingsItems: SettingsItem[] = [
      {
        label: "Profile & Portfolio",
        path: "/dashboard/freelancer/settings/profile-portfolio",
      },
      { label: "Availability", path: "/dashboard/freelancer/settings/availability" },
      { label: "Payouts", path: "/dashboard/freelancer/settings/payout" },
      {
        label: "Account & Security",
        path: "/dashboard/freelancer/settings/",
      },
    ];

    const handleSignOut = async () => {
      await logout();
      navigate("/login", { replace: true });
    };

    return (
      <main className="min-h-screen bg-slate-50 px-4 pt-6 pb-24 max-w-md mx-auto relative font-sans">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        </div>

        {/* Settings Navigation List */}
        <div className="space-y-3 mb-12">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              onClick={() => item.path && navigate(item.path)}
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100/60 active:scale-[0.99] transition-all"
            >
              <span className="text-xs font-bold text-slate-800">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-slate-50 px-4 text-xs font-semibold text-rose-600">
            Danger zone
          </span>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-3.5 bg-white border border-rose-500 text-rose-600 font-semibold text-xs rounded-full hover:bg-rose-50 transition-colors"
          >
            Sign out
          </button>
          <button
            type="button"
            className="w-full py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            Delete account <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <WorkerBottomNav />
      </main>
    );
  }
