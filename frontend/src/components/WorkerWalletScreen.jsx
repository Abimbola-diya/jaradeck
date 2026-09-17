import React, { useState } from 'react';
import {
  ArrowLeft02Icon,
  ViewOffSlashIcon,
} from 'hugeicons-react';
import { JaradeckLogo } from './ui/JaradeckLogo';
import { useApp } from '../context/AppContext';

// Import the new SVGs & Images
import eyeImg from '../assets/eye.svg';
import jetImg from '../assets/jet.svg';
import jakeTaiwoImg from '../assets/Jake Taiwo.png';

export const WorkerWalletScreen = () => {
  const { navigateTo } = useApp();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [historyTab, setHistoryTab] = useState('completed');

  // Populated state matching Figma standard
  const walletBalance = 200000;
  const transactions = [
    {
      id: '1',
      title: 'Social Media Management',
      clientName: 'Jake Taiwo',
      status: 'completed',
      avatar: jakeTaiwoImg,
    },
    {
      id: '2',
      title: 'Social Media Manager',
      clientName: 'Jake Taiwo',
      status: 'completed',
      avatar: jakeTaiwoImg,
    },
    {
      id: '3',
      title: 'Social Media Manager',
      clientName: 'Jake Taiwo',
      status: 'completed',
      avatar: jakeTaiwoImg,
    },
    {
      id: '4',
      title: 'UI/UX Design Review',
      clientName: 'Jake Taiwo',
      status: 'completed',
      avatar: jakeTaiwoImg,
    },
    {
      id: '5',
      title: 'Brand Identity & Strategy',
      clientName: 'Jake Taiwo',
      status: 'completed',
      avatar: jakeTaiwoImg,
    },
  ];

  const hasBalance = walletBalance > 0 || transactions.length > 0;

  const handleBack = () => {
    navigateTo('freelancer/dashboard');
  };

  const filteredTransactions = transactions.filter((tx) => tx.status === historyTab);

  return (
    <div
      className="w-full max-w-[390px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] relative overflow-hidden mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}
    >
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col min-h-[704px]">
        {/* Header Navigation */}
        <div className="w-full flex flex-col items-start gap-[16px]">
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#F5F5F7] flex items-center justify-center cursor-pointer hover:bg-[#EBEBEF] active:scale-95 transition-all shrink-0 outline-none border-none"
            aria-label="Go back"
          >
            <ArrowLeft02Icon size={20} color="#0D0D0D" className="w-[20px] h-[20px] shrink-0" />
          </button>

          <div className="flex flex-col gap-[2px] items-start text-left">
            <h1 className="text-[20px] font-medium leading-[26px] tracking-[-0.015em] text-[#0D0D0D]">
              Your Wallet
            </h1>
            <p className="text-[13px] font-normal leading-[16px] text-[#8E8E93]">
              Your money, in safe hands
            </p>
          </div>
        </div>

        {hasBalance ? (
          <>
            {/* Total Balance & Withdraw Block */}
            <div className="w-full flex flex-col items-center gap-[24px] pt-[64px] pb-[60px]">
              {/* Balance Text & Amount */}
              <div className="flex flex-col items-center gap-[8px]">
                <span className="text-[15px] font-normal leading-[19px] text-[#6E6E6E]">
                  Total Balance
                </span>

                <div className="flex items-center justify-center gap-[8px]">
                  <span className="text-[38px] font-medium leading-[38px] tracking-[-0.015em] text-[#0D0D0D]">
                    {isBalanceVisible ? `₦${walletBalance.toLocaleString()}` : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="text-[#0D0D0D] hover:opacity-75 transition-opacity p-1 cursor-pointer outline-none bg-transparent border-none flex items-center"
                    aria-label={isBalanceVisible ? 'Hide balance' : 'Show balance'}
                  >
                    {isBalanceVisible ? (
                      <img src={eyeImg} alt="View" className="w-[20px] h-[20px]" />
                    ) : (
                      <ViewOffSlashIcon size={20} className="w-[20px] h-[20px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Withdraw Button - Primary Pill Design */}
              <button
                type="button"
                onClick={() => navigateTo('freelancer/withdraw-options')}
                className="h-[38px] px-[18px] rounded-full bg-[#0048B3] flex items-center justify-center gap-[8px] text-white text-[14px] font-medium leading-none cursor-pointer hover:bg-[#003EA3] active:scale-[0.96] transition-all outline-none border-none shadow-sm"
              >
                <span className="leading-none flex items-center">Withdraw</span>
                <img src={jetImg} alt="Withdraw" className="w-[14px] h-[14px] shrink-0" />
              </button>
            </div>

            {/* Transaction History Section */}
            <div className="w-full flex flex-col gap-[18px]">
              {/* Header Row: Title & Filter Tabs */}
              <div className="w-full flex items-center justify-between">
                <h2 className="text-[16px] font-medium leading-[20px] tracking-[-0.01em] text-[#0D0D0D]">
                  Transaction history
                </h2>

                {/* Segmented Filter Pill */}
                <div className="h-[36px] bg-[#F4F4F6] rounded-full p-[3px] flex items-center gap-[2px]">
                  <button
                    type="button"
                    onClick={() => setHistoryTab('completed')}
                    className={`px-[14px] h-[30px] rounded-full text-[13px] transition-all outline-none border-none cursor-pointer flex items-center justify-center ${
                      historyTab === 'completed'
                        ? 'bg-white text-[#0D0D0D] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                        : 'bg-transparent text-[#8E8E93] font-normal hover:text-[#0D0D0D]'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryTab('pending')}
                    className={`px-[14px] h-[30px] rounded-full text-[13px] transition-all outline-none border-none cursor-pointer flex items-center justify-center ${
                      historyTab === 'pending'
                        ? 'bg-white text-[#0D0D0D] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                        : 'bg-transparent text-[#8E8E93] font-normal hover:text-[#0D0D0D]'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>

              {/* List or Empty State */}
              {filteredTransactions.length > 0 ? (
                <div className="relative w-full">
                  <div className="w-full flex flex-col gap-[16px] text-left mt-[4px] max-h-[285px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-[52px]">
                    {filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="w-full flex items-center gap-[14px] py-[2px] cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      >
                        <img
                          src={tx.avatar || jakeTaiwoImg}
                          alt={tx.clientName}
                          className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
                        />
                        <div className="flex flex-col gap-[2px] items-start text-left">
                          <span className="text-[15.5px] font-medium leading-[21px] text-[#0D0D0D]">
                            {tx.title}
                          </span>
                          <span className="text-[13px] font-normal leading-[16px] text-[#8E8E93]">
                            {tx.clientName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Smooth Bottom Gradient Fade Mask */}
                  <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-10" />
                </div>
              ) : (
                /* Empty Tab State */
                <div className="w-full flex flex-col items-center justify-center gap-[16px] pt-[36px] pb-[32px]">
                  <div className="w-[34px] h-[24px] opacity-35 grayscale flex items-center justify-center">
                    <JaradeckLogo size="md" interactive={false} />
                  </div>
                  <p className="text-[13px] font-medium leading-[19px] text-[#8E8E93] text-center max-w-[220px]">
                    {historyTab === 'pending' ? (
                      <>
                        You have no pending
                        <br />
                        transactions
                      </>
                    ) : (
                      <>
                        You have no completed
                        <br />
                        transactions
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Zero Balance Screen State (Strict Match to Figma Standard) */
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-[16px] pb-[80px]">
            <div className="w-[34px] h-[24px] opacity-35 grayscale flex items-center justify-center">
              <JaradeckLogo size="md" interactive={false} />
            </div>
            <p className="text-[13px] font-normal leading-[19px] text-[#8E8E93] text-center max-w-[240px]">
              No transactions yet.
              <br />
              Complete your first project on Jaradeck
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

