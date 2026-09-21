import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheetModal } from './ui/BottomSheetModal';
import {
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  Delete02Icon,
  Alert02Icon,
} from 'hugeicons-react';
import { useApp } from '../context/AppContext';

export const WorkerSettingsScreen = () => {
  const navigate = useNavigate();
  const { role, setRole, navigateTo, goBack } = useApp?.() || {
    role: 'freelancer',
    setRole: () => {},
    navigateTo: (path) => navigate(path.startsWith('/') ? path : `/${path}`),
    goBack: () => navigate(-1),
  };

  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleBack = () => {
    if (goBack) {
      goBack();
    } else if (navigateTo) {
      navigateTo('freelancer/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // Freelancer Settings Menu Items starting from Profile & Portfolio (Switch Mode removed)
  const menuItems = [
    {
      id: 'profile',
      label: 'Profile & Portfolio',
      onClick: () => {
        if (navigateTo) navigateTo('shared/profile-portfolio');
      },
    },
    {
      id: 'availability',
      label: 'Availability',
      onClick: () => {
        if (navigateTo) {
          navigateTo('dashboard/availability');
        } else {
          navigate('/dashboard/availability');
        }
      },
    },
    {
      id: 'payouts',
      label: 'Payouts',
      onClick: () => {
        if (navigateTo) {
          navigateTo('dashboard/payouts');
        } else {
          navigate('/dashboard/payouts');
        }
      },
    },
    {
      id: 'security',
      label: 'Account & Security',
      onClick: () => {
        if (navigateTo) navigateTo('shared/security');
      },
    },
  ];

  const handleConfirmSignout = () => {
    setShowSignoutModal(false);
    if (navigateTo) {
      navigateTo('shared/role-selection');
    } else {
      navigate('/login');
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (navigateTo) {
      navigateTo('shared/role-selection');
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[21px] pt-[20px] pb-[100px] relative overflow-y-auto mx-auto select-none"
      style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Content Container (max 388px width) */}
      <div className="w-full max-w-[388px] flex flex-col gap-[32px] flex-1">
        
        {/* Header Navigation Bar */}
        <div className="w-full h-[50px] flex items-center gap-[16px] sticky top-0 bg-white/95 backdrop-blur-md z-30 py-2">
          {/* Back Circular Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-[44px] h-[44px] rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] active:scale-95 flex items-center justify-center cursor-pointer transition-all outline-none border-none shrink-0 shadow-xs"
            aria-label="Go back"
          >
            <ArrowLeft02Icon size={20} color="#141B34" className="w-[20px] h-[20px] shrink-0" />
          </button>

          {/* Title */}
          <h1 className="text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-[#272931] text-left">
            Settings
          </h1>
        </div>

        {/* Main Menu & Actions Stack */}
        <div className="w-full flex flex-col gap-[56px] flex-1">
          {/* Menu Cards Stack */}
          <div className="w-full flex flex-col gap-[12px]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="w-full h-[62px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[18px] py-[16px] flex items-center justify-between cursor-pointer hover:bg-gray-50 active:scale-[0.99] transition-all outline-none text-left shadow-2xs"
              >
                <span className="text-[14px] font-medium leading-[20px] text-[#1A1C1F]">
                  {item.label}
                </span>
                <ArrowRight01Icon size={16} color="#9CA3AF" className="shrink-0 ml-2" />
              </button>
            ))}
          </div>

          {/* Danger Zone Section */}
          <div className="w-full flex flex-col gap-[16px] mt-auto pb-[20px]">
            {/* Danger Zone Header with Divider Lines */}
            <div className="w-full h-[20px] flex items-center justify-center px-[20px] gap-[12px]">
              <div className="flex-1 h-[1px] bg-[#BA1A1A]/20 shrink-0" />
              <span className="text-[13px] font-medium leading-[20px] text-[#BA1A1A] shrink-0 text-center px-1">
                Danger zone
              </span>
              <div className="flex-1 h-[1px] bg-[#BA1A1A]/20 shrink-0" />
            </div>

            {/* Sign out Button (Outlined Red Pill) */}
            <button
              type="button"
              onClick={() => setShowSignoutModal(true)}
              className="w-full h-[46px] rounded-full border border-[#BA1A1A] text-[#BA1A1A] text-[14px] font-medium flex items-center justify-center gap-[6px] cursor-pointer hover:bg-[#BA1A1A]/5 active:scale-95 transition-all outline-none"
            >
              <span>Sign out</span>
              <ArrowRight02Icon size={16} color="#BA1A1A" className="shrink-0" />
            </button>

            {/* Delete account Button (Solid Red Pill with Trash Icon on Right) */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full h-[46px] rounded-full bg-[#BA1A1A] text-white text-[14px] font-medium shadow-[inset_2px_2px_4px_0px_rgba(255,255,255,0.35),_inset_0px_-2px_4px_0px_rgba(0,0,0,0.2)] flex items-center justify-center gap-[6px] cursor-pointer hover:bg-[#A01616] active:scale-95 transition-all outline-none"
            >
              <span>Delete account</span>
              <Delete02Icon size={18} color="#FFFFFF" className="shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <BottomSheetModal
        isOpen={showSignoutModal}
        onClose={() => setShowSignoutModal(false)}
      >
        <div className="w-full flex flex-col gap-[20px] items-start animate-fadeIn">
          <div className="w-full flex flex-col gap-[4px] items-start text-left">
            <h3 className="text-[20px] font-medium leading-[30px] text-[#0D0D0D] tracking-[-0.01em]">
              Sign out?
            </h3>
            <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
              You can always sign back in using your email and PIN.
            </p>
          </div>

          <div className="w-full flex flex-col gap-[10px] pt-[4px]">
            <button
              type="button"
              onClick={handleConfirmSignout}
              className="w-full h-[44px] bg-[#BA1A1A] hover:bg-[#9E1414] active:scale-[0.99] rounded-[22px] shadow-sm flex items-center justify-center text-white text-[14px] font-medium cursor-pointer transition-all outline-none border-none"
            >
              Sign out
            </button>

            <button
              type="button"
              onClick={() => setShowSignoutModal(false)}
              className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center border-none bg-transparent"
            >
              Cancel
            </button>
          </div>
        </div>
      </BottomSheetModal>

      {/* Delete Account Confirmation Modal */}
      <BottomSheetModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="w-full flex flex-col gap-[20px] items-start animate-fadeIn">
          <div className="w-full flex flex-col gap-[4px] items-start text-left">
            <h3 className="text-[20px] font-medium leading-[30px] text-[#BA1A1A] tracking-[-0.01em]">
              Delete Account?
            </h3>
            <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
              This action is permanent and cannot be reversed.
            </p>
          </div>

          <div className="w-full bg-[#FFF1F2] border border-[#FFE4E6] rounded-[20px] p-[16px] flex items-start gap-[10px] text-left">
            <Alert02Icon size={20} color="#E11D48" className="shrink-0 mt-[2px]" />
            <p className="text-[13px] font-normal leading-[19px] text-[#E11D48]">
              <strong>Irreversible Action:</strong> All active contracts, deliverables, milestone histories, and wallet balances associated with this account will be erased immediately.
            </p>
          </div>

          <div className="w-full flex flex-col gap-[10px] pt-[4px]">
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="w-full h-[44px] bg-[#BA1A1A] hover:bg-[#9E1414] active:scale-[0.99] rounded-[22px] shadow-sm flex items-center justify-center text-white text-[14px] font-medium cursor-pointer transition-all outline-none border-none"
            >
              Delete my account permanently
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center border-none bg-transparent"
            >
              Cancel
            </button>
          </div>
        </div>
      </BottomSheetModal>
    </div>
  );
};

export default WorkerSettingsScreen;
