import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Edit2, X } from "lucide-react";

export default function ProfilePortfolioPage({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();

  // Dynamic back navigation handler
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Mode states: 'view' (done) | 'edit' (empty/active)
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Profile Form Data
  const [formData, setFormData] = useState({
    name: "Mayowa Ali",
    about:
      "I am a passionate social media strategist with 6 years of experience, leading the line at various companies like Rise.",
    primarySkill: "Product Design",
    portfolio: "www.ayooluwabamideke.vercel.app",
  });

  const skillOptions = [
    "Product Design",
    "Software Development",
    "Content Creation",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 pb-28 text-slate-800 font-sans">
      {/* Top Header */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-4 bg-white">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">
          Profile & Portfolio
        </h1>
      </div>

      <div className="max-w-md mx-auto px-6 pt-4">
        {/* Profile Avatar & Name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {isEditing ? (
            <div className="relative flex items-center bg-slate-100/70 border border-slate-200 rounded-2xl px-4 py-2 w-full max-w-xs">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="What's your name"
                className="bg-transparent w-full text-center text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <Edit2 className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
            </div>
          ) : (
            <div className="bg-slate-100/70 border border-slate-100 rounded-2xl px-6 py-2.5">
              <span className="font-semibold text-sm text-slate-900">
                {formData.name || "What's your name"}
              </span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* About You */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              About you
            </label>
            {isEditing ? (
              <textarea
                rows={4}
                value={formData.about}
                onChange={(e) => handleInputChange("about", e.target.value)}
                placeholder="Tell us about you"
                className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-sm resize-none"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-100 text-sm text-slate-800 leading-relaxed shadow-sm">
                {formData.about || "Tell us about you"}
              </div>
            )}
          </div>

          {/* Primary Skill */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              Primary Skill
            </label>
            {isEditing ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm flex items-center justify-between text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                >
                  <span
                    className={
                      formData.primarySkill
                        ? "text-slate-900 font-medium"
                        : "text-slate-400"
                    }
                  >
                    {formData.primarySkill || "What's your strongest skill"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div className="mt-2 bg-white border border-slate-100 rounded-2xl p-2 shadow-xl space-y-1">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          handleInputChange("primarySkill", skill);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                          formData.primarySkill === skill
                            ? "bg-slate-100 font-semibold text-slate-900"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-100 text-sm font-medium text-slate-900 shadow-sm flex items-center justify-between">
                <span>
                  {formData.primarySkill || "What's your strongest skill"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              Portfolio
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.portfolio}
                onChange={(e) => handleInputChange("portfolio", e.target.value)}
                placeholder="Your custom or portfolio link"
                className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-sm"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-100 text-sm font-medium text-slate-800 shadow-sm">
                {formData.portfolio || "Your custom or portfolio link"}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="w-full py-4 bg-[#0052CC] hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-md transition-colors"
            >
              Update your profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-4 bg-[#0052CC] hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-md transition-colors"
            >
              Edit your profile
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xs bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Blue Verified Icon */}
            <div className="my-4 flex justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-16 h-16 text-blue-600 fill-current"
                >
                  <path d="M12 2L15.09 3.26L18.36 2.76L19.82 5.76L22.95 6.91L22.5 10.24L24 13.16L22.09 15.89L22.14 19.23L18.91 20.07L16.82 22.68L13.56 21.96L10.84 23.95L8.33 21.73L5.04 22.25L3.81 19.14L0.86 17.78L1.57 14.49L0 11.45L2.12 8.87L2.34 5.53L5.64 4.95L7.91 2.52L11.13 3.51L12 2Z" />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-white absolute stroke-current"
                  strokeWidth="3"
                  fill="none"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Succesful!
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Your profile has been updated successfully. Your profile is
              visible to customers now
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
