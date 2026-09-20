import React, { useState } from 'react';
import {
  CreditCardIcon,
  Wallet02Icon,
  Coins01Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
} from 'hugeicons-react';
import { useProject } from '../../context/ProjectContext';
import { BottomSheetModal } from '../ui/BottomSheetModal';

interface EscrowFundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EscrowFundingModal: React.FC<EscrowFundingModalProps> = ({ isOpen, onClose }) => {
  const { contract, fundEscrow, isProcessing } = useProject();
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'card' | 'crypto'>('wallet');

  if (!isOpen || typeof document === 'undefined') return null;

  const handleFund = async () => {
    const success = await fundEscrow(selectedMethod);
    if (success) {
      onClose();
    }
  };

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose}>

        {/* Content Stack */}
        <div className="w-full flex flex-col gap-[20px] items-start animate-fadeIn">
          {/* Header (Figma Frame 4482: Left-aligned Title & Subtitle, No Circle 'X') */}
          <div className="w-full flex flex-col gap-[4px] items-start text-left">
            <h3 className="text-[20px] font-medium leading-[30px] text-[#0D0D0D] tracking-[-0.01em]">
              Fund Escrow Contract
            </h3>
            <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
              Dual-Custody Security Guarantee
            </p>
          </div>

          {/* Amount Card (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
          <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[8px] text-left">
            <span className="text-[12px] font-normal text-[#9E9E9E]">Contract Milestone Total</span>
            <div className="flex items-baseline gap-[8px]">
              <span className="text-[28px] font-semibold tracking-tight text-[#0D0D0D]">
                ${contract.totalAmount.toLocaleString()}
              </span>
              <span className="text-[12px] font-medium text-[#0048B3] bg-[#0048B3]/8 px-[8px] py-[2px] rounded-full">
                Zero Buyer Fees
              </span>
            </div>
            <p className="text-[12px] font-normal text-[#6B7280] leading-[16px]">
              Project: <strong className="text-[#0D0D0D] font-medium">Social Media Management</strong> with Marcus Vance
            </p>
          </div>

          {/* Payment Methods (Figma Frame 4485: Option tiles, gap: 8px) */}
          <div className="w-full flex flex-col gap-[8px] text-left">
            <span className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">Select Payment Source</span>

            {/* Option 1: Jaradeck Wallet */}
            <button
              type="button"
              onClick={() => setSelectedMethod('wallet')}
              className={`w-full h-[62px] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer transition-all outline-none select-none ${
                selectedMethod === 'wallet'
                  ? 'bg-[#F0F5FF]'
                  : 'bg-[#FDFDFD] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0048B3] shrink-0">
                  <Wallet02Icon size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-medium text-[#0D0D0D]">Jaradeck Wallet</span>
                  <span className="text-[11px] text-[#9E9E9E]">Available: $2,400.00</span>
                </div>
              </div>
              {selectedMethod === 'wallet' && (
                <CheckmarkCircle02Icon size={20} className="text-[#0048B3] shrink-0" />
              )}
            </button>

            {/* Option 2: Debit Card */}
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`w-full h-[62px] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer transition-all outline-none select-none ${
                selectedMethod === 'card'
                  ? 'bg-[#F0F5FF]'
                  : 'bg-[#FDFDFD] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#272931] shrink-0">
                  <CreditCardIcon size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-medium text-[#0D0D0D]">Mastercard ending in 4242</span>
                  <span className="text-[11px] text-[#9E9E9E]">Expires 08/28</span>
                </div>
              </div>
              {selectedMethod === 'card' && (
                <CheckmarkCircle02Icon size={20} className="text-[#0048B3] shrink-0" />
              )}
            </button>

            {/* Option 3: Crypto USDC */}
            <button
              type="button"
              onClick={() => setSelectedMethod('crypto')}
              className={`w-full h-[62px] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer transition-all outline-none select-none ${
                selectedMethod === 'crypto'
                  ? 'bg-[#F0F5FF]'
                  : 'bg-[#FDFDFD] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#272931] shrink-0">
                  <Coins01Icon size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14px] font-medium text-[#0D0D0D]">USDC (Base / Polygon)</span>
                  <span className="text-[11px] text-[#9E9E9E]">Instant escrow lock</span>
                </div>
              </div>
              {selectedMethod === 'crypto' && (
                <CheckmarkCircle02Icon size={20} className="text-[#0048B3] shrink-0" />
              )}
            </button>
          </div>

          {/* Dual-Custody Notice (Borderless) */}
          <div className="w-full bg-[#FDFDFD] rounded-[16px] p-[14px] flex items-start gap-[10px] text-left">
            <p className="text-[11px] font-normal leading-[16px] text-[#6B7280]">
              <strong className="text-[#0D0D0D] font-medium">Dual-Custody Protection:</strong> Funds are locked securely in escrow and cannot be released to the freelancer until you inspect and approve the milestone deliverables.
            </p>
          </div>

          {/* Action Buttons (Figma Frame 4: 44px, #0048B3, 22px rounded, inset shadow) */}
          <div className="w-full flex flex-col gap-[10px] pt-[4px]">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleFund}
              className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center gap-[8px] text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loading03Icon size={16} className="animate-spin" />
                  <span>Locking Funds in Escrow...</span>
                </>
              ) : (
                <span>Fund Escrow (${contract.totalAmount.toLocaleString()})</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
    </BottomSheetModal>
  );
};
