import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheetModal } from './ui/BottomSheetModal';
import {
  ArrowLeft02Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Building01Icon,
  Coins01Icon,
  SecurityLockIcon,
  CheckmarkCircle02Icon,
} from 'hugeicons-react';
import { useApp } from '../context/AppContext';
import bankIsometricImg from '../assets/bank_isometric_3d.png';
import blueTickImg from '../assets/blue_tick.png';
import bankIconSvg from '../assets/bank_icon.svg';
import padlockIconSvg from '../assets/padlock_icon.svg';
import rightIconSvg from '../assets/right_icon.svg';

const ChevronDownIcon = ({ className = "shrink-0" }) => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 2.5L7 7.5L12 2.5" stroke="#7B7B7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NIGERIAN_BANKS = [
  'Guaranty Trust Bank',
  'Access Bank',
  'Zenith Bank',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Kuda Bank',
  'Opay',
  'Palmpay',
];

export const PayoutsScreen = () => {
  const navigate = useNavigate();
  const { navigateTo, goBack } = useApp?.() || {
    navigateTo: (path) => navigate(path.startsWith('/') ? path : `/${path}`),
    goBack: () => navigate(-1),
  };

  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState('select'); // 'select' | 'bank_ngn' | 'success'
  const [selectedMethod, setSelectedMethod] = useState('ngn'); // 'ngn' | 'crypto'
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle' | 'verifying' | 'verified'

  // Bank selection dropdown state inside modal
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

  // Automatic verification simulation as user types account number
  useEffect(() => {
    let timer = null;
    if (accountNumber.length > 0 && accountNumber.length < 10) {
      setVerificationStatus('verifying');
      setAccountName('');
    } else if (accountNumber.length === 10) {
      setVerificationStatus('verifying');
      timer = setTimeout(() => {
        setVerificationStatus('verified');
        setAccountName('Adeyemo Christiana');
      }, 700);
    } else {
      setVerificationStatus('idle');
      setAccountName('');
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [accountNumber]);

  const handleBack = () => {
    if (goBack) {
      goBack();
    } else if (navigateTo) {
      navigateTo('dashboard/settings');
    } else {
      navigate('/dashboard/settings');
    }
  };

  const handleAddPayoutAccount = () => {
    setSelectedBank('');
    setAccountNumber('');
    setAccountName('');
    setVerificationStatus('idle');
    setIsModalOpen(true);
    setModalStep('select');
  };

  const handleEditPayoutDetails = () => {
    setIsModalOpen(true);
    setModalStep('bank_ngn');
  };

  const handleCloseModal = () => {
    if (modalStep === 'success') {
      setIsAccountLinked(true);
    }
    setIsModalOpen(false);
    setTimeout(() => {
      setModalStep('select');
      setIsBankDropdownOpen(false);
    }, 300);
  };

  const handleSelectNgn = () => {
    setSelectedMethod('ngn');
    setModalStep('bank_ngn');
  };

  const handleContinue = () => {
    if (modalStep === 'select') {
      if (selectedMethod === 'ngn') {
        setModalStep('bank_ngn');
      }
    } else if (modalStep === 'bank_ngn') {
      if (!selectedBank) setSelectedBank('Guaranty Trust Bank');
      if (!accountNumber) setAccountNumber('11006776712');
      if (!accountName) setAccountName('Adeyemi Christiana');
      setModalStep('success');
    }
  };

  return (
    <div
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[21px] pt-[20px] pb-[100px] relative overflow-y-auto mx-auto select-none"
      style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Content Container (max 388px width) */}
      <div className="w-full max-w-[388px] flex flex-col items-start gap-[24px] flex-1">
        
        {/* Header Bar */}
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
            Payouts
          </h1>
        </div>

        {/* LINKED STATE DETAILS */}
        {isAccountLinked ? (
          <div className="w-full flex flex-col gap-[20px] items-start animate-fadeIn flex-1">
            {/* Bank Account Category Card */}
            <div className="w-full h-[62px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[18px] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-[10px]">
                <img src={bankIconSvg} alt="Bank" className="w-[24px] h-[24px] object-contain shrink-0" />
                <span className="text-[14px] font-medium leading-[20px] text-[#0D0D0D]">
                  Bank Account - Nigerian
                </span>
              </div>
            </div>

            {/* Field: Bank Name */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[13px] font-medium text-[#7B7B7B]">
                Bank name
              </label>
              <div className="w-full h-[50px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[18px] flex items-center justify-between shadow-2xs">
                <span className="text-[14px] font-medium text-[#0D0D0D]">
                  {selectedBank || 'Guaranty Trust Bank'}
                </span>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Field: Account Number */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[13px] font-medium text-[#7B7B7B]">
                Account number
              </label>
              <div className="w-full h-[50px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[18px] flex items-center shadow-2xs">
                <span className="text-[14px] font-medium text-[#0D0D0D] font-mono tracking-wide">
                  {accountNumber || '11006776712'}
                </span>
              </div>
            </div>

            {/* Field: Account Name */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[13px] font-medium text-[#7B7B7B]">
                Account name
              </label>
              <div className="w-full h-[50px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[18px] flex items-center shadow-2xs">
                <span className="text-[14px] font-medium text-[#7B7B7B]">
                  {accountName || 'Adeyemi Christiana'}
                </span>
              </div>
            </div>

            {/* Edit Payout Details CTA */}
            <div className="w-full mt-auto pt-[24px] pb-[20px]">
              <button
                type="button"
                onClick={handleEditPayoutDetails}
                className="w-full h-[48px] bg-[#0048B3] hover:bg-[#003EA3] active:scale-[0.99] rounded-full text-white text-[15px] font-medium shadow-button-inset flex items-center justify-center cursor-pointer transition-all outline-none border-none"
              >
                Edit payout details
              </button>
            </div>
          </div>
        ) : (
          /* UNLINKED INITIAL HERO STATE */
          <div className="w-full flex flex-col items-center justify-center gap-[24px] my-auto py-[20px] flex-1 animate-fadeIn">
            {/* 3D Isometric Bank Building Graphic & Text */}
            <div className="flex flex-col items-center gap-[12px] text-center w-full">
              <img
                src={bankIsometricImg}
                alt="Bank Building"
                className="w-[178px] h-[118px] object-contain select-none pointer-events-none"
              />

              <div className="flex flex-col items-center gap-[4px] max-w-[290px]">
                <h2 className="text-[14px] font-medium text-[#0D0D0D] text-center">
                  Add a payout account
                </h2>
                <p className="text-[12px] font-normal text-[#7B7B7B] leading-[18px] text-center">
                  Link your preferred payout account to start earning<br />
                  commission free
                </p>
              </div>
            </div>

            {/* Add Payout Account Button (Positioned close to text & centered) */}
            <button
              type="button"
              onClick={handleAddPayoutAccount}
              className="w-full h-[48px] bg-[#0048B3] hover:bg-[#003EA3] active:scale-[0.99] rounded-full text-white text-[15px] font-medium shadow-button-inset flex items-center justify-center cursor-pointer transition-all outline-none border-none"
            >
              Add payout account
            </button>
          </div>
        )}

      </div>

      {/* BOTTOM SHEET MODAL (3 STEPS) */}
      <BottomSheetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {modalStep === 'select' ? (
          /* STEP 1: SELECT METHOD */
          <div className="w-full flex flex-col gap-[24px] items-start animate-fadeIn">
            <div className="w-full flex flex-col gap-[4px] text-left">
              <h3 className="text-[20px] font-medium text-[#0D0D0D] tracking-[-0.01em]">
                Add a payout account
              </h3>
              <p className="text-[12px] font-normal text-[#9E9E9E] leading-[18px]">
                Link your preferred payout account to start earning<br />
                commission free
              </p>
            </div>

            {/* Method Cards */}
            <div className="w-full flex flex-col gap-[10px]">
              {/* Option 1: Nigerian Bank Account */}
              <button
                type="button"
                onClick={handleSelectNgn}
                className="w-full h-[62px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all outline-none"
              >
                <div className="flex items-center gap-[10px]">
                  <img src={bankIconSvg} alt="Bank" className="w-[24px] h-[24px] object-contain shrink-0" />
                  <span className="text-[14px] font-medium text-[#0D0D0D]">
                    Bank Account - Nigerian
                  </span>
                </div>
                <img src={rightIconSvg} alt="Right" className="w-[7px] h-[10px] object-contain shrink-0" />
              </button>

              {/* Option 2: Stablecoin (Locked) */}
              <button
                type="button"
                onClick={() => setSelectedMethod('crypto')}
                className="w-full h-[62px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all outline-none"
              >
                <div className="flex items-center gap-[10px]">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] shrink-0">
                    <Coins01Icon size={18} color="#6B7280" />
                  </div>
                  <span className="text-[14px] font-medium text-[#6B7280]">
                    Stablecoin
                  </span>
                </div>
                <img src={padlockIconSvg} alt="Lock" className="w-[24px] h-[24px] object-contain shrink-0" />
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-[48px] bg-[#0048B3] hover:bg-[#003EA3] active:scale-[0.99] rounded-full text-white text-[15px] font-medium shadow-button-inset flex items-center justify-center cursor-pointer transition-all outline-none border-none mt-2"
            >
              Continue
            </button>
          </div>
        ) : modalStep === 'bank_ngn' ? (
          /* STEP 2: CONFIGURE BANK ACCOUNT */
          <div className="w-full flex flex-col gap-[20px] items-start animate-fadeIn">
            <div className="w-full flex flex-col gap-[4px] text-left">
              <h3 className="text-[20px] font-medium text-[#0D0D0D] tracking-[-0.01em]">
                Add a payout account
              </h3>
              <p className="text-[12px] font-normal text-[#9E9E9E] leading-[18px]">
                Link your preferred payout account to start earning<br />
                commission free
              </p>
            </div>

            {/* Selected Method Badge */}
            <div className="w-full h-[62px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[20px] px-[16px] flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <img src={bankIconSvg} alt="Bank" className="w-[24px] h-[24px] object-contain shrink-0" />
                <span className="text-[14px] font-medium text-[#0D0D0D]">
                  Bank Account - Nigerian
                </span>
              </div>
              <img src={rightIconSvg} alt="Right" className="w-[7px] h-[10px] object-contain shrink-0" />
            </div>

            {/* Bank Name Dropdown Field */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[13px] font-medium text-[#7B7B7B]">
                Bank name
              </label>

              <button
                type="button"
                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                className="w-full h-[50px] bg-[#FDFDFD] border border-[#F3F4F6] hover:border-gray-300 rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer transition-all outline-none"
              >
                <span className={`text-[14px] font-medium ${selectedBank ? 'text-[#0D0D0D]' : 'text-[#9CA3AF]'}`}>
                  {selectedBank || 'Select the bank'}
                </span>
                <ChevronDownIcon className={`shrink-0 transition-transform duration-200 ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Bank Options Inline List */}
              <AnimatePresence>
                {isBankDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full flex flex-col gap-[2px] pt-[4px] pb-[4px] max-h-[170px] overflow-y-auto no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {NIGERIAN_BANKS.map((bank) => {
                      const isSelected = selectedBank === bank;
                      return (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => {
                            setSelectedBank(bank);
                            setIsBankDropdownOpen(false);
                          }}
                          className={`w-full px-[14px] py-[10px] rounded-[12px] text-left transition-all cursor-pointer outline-none border-none text-[14px] ${
                            isSelected
                              ? 'bg-[#F4F5F8] text-[#0D0D0D] font-medium'
                              : 'bg-transparent text-[#7B7B7B] font-normal hover:bg-[#F9FAFB] hover:text-[#0D0D0D]'
                          }`}
                        >
                          {bank}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Account Number Input Field */}
            <div className="w-full flex flex-col gap-[8px] items-start text-left">
              <label className="text-[13px] font-medium text-[#7B7B7B]">
                Account number
              </label>

              <div className="w-full h-[50px] bg-[#FDFDFD] border border-[#F3F4F6] focus-within:border-[#0048B3]/40 rounded-[20px] px-[16px] flex items-center transition-all">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="What’s your account number?"
                  className="w-full bg-transparent text-[14px] font-medium text-[#0D0D0D] placeholder-[#9CA3AF] outline-none font-mono tabular-nums tracking-wide"
                />
              </div>

              {/* Verification Name Indicator */}
              {accountNumber.length > 0 && (
                <div className="w-full text-left pl-[2px] mt-[1px]">
                  {verificationStatus === 'verifying' ? (
                    <span className="text-[13px] font-normal text-[#9E9E9E]">
                      Verifying......
                    </span>
                  ) : (
                    <span className="text-[13px] font-medium text-[#0048B3] animate-fadeIn">
                      {accountName || 'Adeyemo Christiana'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              className="w-full h-[48px] bg-[#0048B3] hover:bg-[#003EA3] active:scale-[0.99] rounded-full text-white text-[15px] font-medium shadow-button-inset flex items-center justify-center cursor-pointer transition-all outline-none border-none mt-2"
            >
              Continue
            </button>
          </div>
        ) : (
          /* STEP 3: SUCCESS CONFIRMATION */
          <div className="w-full flex flex-col items-center gap-[24px] py-[12px] text-center animate-fadeIn">
            {/* 3D Blue Tick Badge Asset */}
            <img
              src={blueTickImg}
              alt="Successful"
              className="w-[80px] h-[80px] object-contain select-none pointer-events-none drop-shadow-md animate-bounce-short"
            />

            <div className="flex flex-col items-center gap-[6px] text-center">
              <h3 className="text-[22px] font-medium text-[#0A0A0A] tracking-[-0.01em]">
                Successful!
              </h3>
              <p className="text-[13px] font-normal text-[#7B7B7B] max-w-[270px] leading-[20px]">
                Your payout account has been linked successfully.
              </p>
            </div>

            {/* Done CTA Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full h-[48px] bg-[#0048B3] hover:bg-[#003EA3] active:scale-[0.99] rounded-full text-white text-[15px] font-medium shadow-button-inset flex items-center justify-center cursor-pointer transition-all outline-none border-none"
            >
              Done
            </button>
          </div>
        )}
      </BottomSheetModal>
    </div>
  );
};

export default PayoutsScreen;
