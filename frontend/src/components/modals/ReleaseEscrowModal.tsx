import React, { useState, useRef, useEffect } from 'react';
import {
  Alert02Icon,
  Loading03Icon,
  CheckmarkCircle02Icon,
  ArrowLeft02Icon,
} from 'hugeicons-react';
import { useProject, DeliverableFile } from '../../context/ProjectContext';
import { getFileTypeConfig } from '../../utils/fileTypeUtils';
import { BottomSheetModal } from '../ui/BottomSheetModal';
import profileSuccessBadgeImg from '../../assets/profile_success_badge.png';
import portfolioWork1 from '../../assets/portfolio_work_1.png';
import marcusAvatarSvg from '../../assets/marcus_avatar.svg';

interface ReleaseEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRelease?: () => void;
  onRequestRevision?: () => void;
  initialStep?: 'review' | 'preview' | 'pin';
}

export const ReleaseEscrowModal: React.FC<ReleaseEscrowModalProps> = ({
  isOpen,
  onClose,
  onSuccessRelease,
  onRequestRevision,
  initialStep = 'review',
}) => {
  const { contract, deliverables, freelancerNote, approveAndReleaseEscrow, isProcessing, error, clearError } = useProject();
  const [step, setStep] = useState<'review' | 'preview' | 'pin' | 'success'>(initialStep);
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableFile | null>(null);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setPin(['', '', '', '']);
      setLocalError(null);
      setSelectedDeliverable(deliverables[0] || null);
      clearError();
    }
  }, [isOpen, initialStep, deliverables, clearError]);

  useEffect(() => {
    if (step === 'pin') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setLocalError(null);

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmRelease = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      setLocalError('Please enter your 4-digit security PIN.');
      return;
    }

    const res = await approveAndReleaseEscrow(enteredPin);
    if (res.success) {
      setStep('success');
      setTimeout(() => {
        if (onSuccessRelease) onSuccessRelease();
      }, 1600);
    } else {
      setLocalError(res.error || 'Failed to authorize release.');
    }
  };

  const defaultNote =
    'All 15 social posts, visual deck wireframes, and copy calendar have been completed according to the project brief. Please inspect the attached deliverables for Milestone 2 approval.';

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose}>

        {/* STEP 1: COMPREHENSIVE MILESTONE & DELIVERABLES REVIEW */}
        {step === 'review' && (
          <div className="w-full flex flex-col gap-[20px] items-start animate-fadeIn">
            {/* Header (Figma Frame 4482: Left-aligned Title & Subtitle, No Circle 'X') */}
            <div className="w-full flex flex-col gap-[4px] items-start text-left">
              <h3 className="text-[20px] font-medium leading-[30px] text-[#0D0D0D] tracking-[-0.01em]">
                Review Milestone 2
              </h3>
              <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
                Content Creation & Design • ${contract.milestoneAmount.toLocaleString()}
              </p>
            </div>

            {/* Submitted Deliverables Card (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
            <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[12px] text-left">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">Submitted Work</span>
                <span className="text-[11px] font-medium text-[#498905] bg-[#498905]/10 px-[8px] py-[2px] rounded-full">
                  15 Creatives Ready
                </span>
              </div>

              {/* Deliverable File Row with Dynamic Icon (Clickable to Preview) */}
              {deliverables.map((file) => {
                const config = getFileTypeConfig(file.name, file.type);
                const IconComponent = config.icon;
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      setSelectedDeliverable(file);
                      setStep('preview');
                    }}
                    className="w-full bg-[#F5F6F8] hover:bg-[#EBF3FF] rounded-[16px] p-[12px] flex items-center justify-between gap-[10px] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-[10px] min-w-0">
                      <div
                        className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: config.bgColor }}
                      >
                        <IconComponent size={20} color={config.color} className="w-[20px] h-[20px] shrink-0" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-[13px] font-medium text-[#0D0D0D] truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-[11px] text-[#9E9E9E]">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB • {config.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-[4px] shrink-0 text-[#0048B3] text-[12px] font-medium">
                      <span>View</span>
                      <ArrowLeft02Icon size={14} className="rotate-180" />
                    </div>
                  </div>
                );
              })}

              {/* Visual Thumbnail Preview Banner */}
              <div
                onClick={() => setStep('preview')}
                className="w-full h-[110px] rounded-[16px] overflow-hidden relative cursor-pointer group select-none"
              >
                <img
                  src={portfolioWork1}
                  alt="Deliverables preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-between p-[12px]">
                  <span className="text-[12px] font-medium text-white">Tap to inspect full preview</span>
                  <span className="text-[10px] font-mono text-white/90 bg-white/20 backdrop-blur-xs px-[8px] py-[2px] rounded-full">
                    15 Slides
                  </span>
                </div>
              </div>
            </div>

            {/* Note from Freelancer (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
            <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[8px] text-left">
              <div className="flex items-center gap-[8px]">
                <img src={marcusAvatarSvg} alt="Freelancer" className="w-[20px] h-[20px] rounded-full" />
                <span className="text-[14px] font-medium text-[#7B7B7B]">Note from Marcus Vance</span>
              </div>
              <p className="text-[13px] font-normal leading-[19px] text-[#272931]">
                {freelancerNote || defaultNote}
              </p>
            </div>

            {/* Financial Summary Card (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
            <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[10px] text-left">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#7B7B7B]">Milestone Escrow Payout</span>
                <span className="font-medium text-[#0D0D0D]">${contract.milestoneAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#7B7B7B]">Jaradeck Service Fee</span>
                <span className="font-medium text-[#0048B3]">0% (Free)</span>
              </div>
              <div className="w-full h-[1px] bg-[#F0F0F0] my-[2px]" />
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-[#0D0D0D]">Total to Release</span>
                <span className="text-[20px] font-semibold text-[#0048B3]">
                  ${contract.milestoneAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Irreversible Warning Notice */}
            <div className="w-full bg-[#FFFBEB] rounded-[16px] p-[14px] flex items-start gap-[10px] text-left">
              <Alert02Icon size={16} color="#D97706" className="shrink-0 mt-[2px]" />
              <p className="text-[12px] font-normal leading-[16px] text-[#92400E]">
                <strong>Escrow Protection:</strong> Once released, funds transfer immediately to the freelancer. Only approve if you have reviewed and are satisfied with the milestone deliverables.
              </p>
            </div>

            {/* Action Buttons (Figma Frame 4: 44px, #0048B3, 22px rounded, inset shadow) */}
            <div className="w-full flex flex-col gap-[10px] pt-[2px]">
              {/* Primary: Approve & Release Escrow */}
              <button
                type="button"
                onClick={() => setStep('pin')}
                className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
              >
                <span>Approve & Authorize Release (${contract.milestoneAmount.toLocaleString()})</span>
              </button>

              {/* Secondary: Request Revisions */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRequestRevision) onRequestRevision();
                }}
                className="w-full h-[44px] rounded-[22px] bg-[#F3F4F5] text-[#4C4546] text-[14px] font-medium hover:bg-[#E5E7EB] active:scale-[0.99] transition-all cursor-pointer outline-none flex items-center justify-center"
              >
                <span>Request Modifications / Revisions</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center"
              >
                Close Review
              </button>
            </div>
          </div>
        )}

        {/* STEP 1b: FULL DELIVERABLE INSPECTION / PREVIEW */}
        {step === 'preview' && (() => {
          const activeFile = selectedDeliverable || deliverables[0];
          const config = activeFile ? getFileTypeConfig(activeFile.name, activeFile.type) : null;
          const IconComponent = config?.icon;
          return (
            <div className="w-full flex flex-col gap-[16px] items-start animate-fadeIn">
              {/* Header with Back */}
              <div className="w-full flex items-center gap-[12px] text-left">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="w-[36px] h-[36px] rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#4C4546] hover:bg-[#E5E7EB] transition-colors cursor-pointer outline-none shrink-0"
                  aria-label="Back to review"
                >
                  <ArrowLeft02Icon size={18} />
                </button>
                <div className="flex flex-col text-left">
                  <h3 className="text-[17px] font-medium text-[#0D0D0D]">
                    Deliverable Preview
                  </h3>
                  <span className="text-[12px] font-medium text-[#9E9E9E] truncate max-w-[260px]">
                    {activeFile?.name || 'Deliverable Document'}
                  </span>
                </div>
              </div>

              {/* High Fidelity Mockup Preview Container */}
              <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[14px] flex flex-col items-center gap-[12px]">
                <div className="w-full max-h-[300px] overflow-hidden rounded-[16px] bg-[#F5F6F8] flex items-center justify-center">
                  {config?.category === 'image' ? (
                    <img
                      src={activeFile?.previewUrl || portfolioWork1}
                      alt={activeFile?.name}
                      className="w-full h-[260px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[220px] flex flex-col items-center justify-center gap-[12px] p-[20px] text-center">
                      <div
                        className="w-[56px] h-[56px] rounded-[14px] flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: config?.bgColor || '#F3F4F6' }}
                      >
                        {IconComponent && (
                          <IconComponent size={30} color={config?.color || '#000000'} />
                        )}
                      </div>
                      <div className="flex flex-col gap-[4px] items-center">
                        <span className="text-[14px] font-medium text-[#0D0D0D] max-w-[280px] truncate">
                          {activeFile?.name}
                        </span>
                        <span className="text-[12px] text-[#6B7280]">
                          {config?.label} • {activeFile ? (activeFile.size / (1024 * 1024)).toFixed(1) : '2.4'} MB
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full flex items-center justify-between text-left px-[4px]">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-[#0D0D0D]">
                      {activeFile?.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#6B7280]">
                      {activeFile?.hash?.substring(0, 24) || 'sha256-verified'}...
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 px-[8px] py-[3px] rounded-full flex items-center gap-[4px]">
                    <CheckmarkCircle02Icon size={12} />
                    <span>Integrity Verified</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-[8px] pt-[4px]">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
                >
                  <span>Return to Milestone Decision</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* STEP 2: PIN AUTHORIZATION */}
        {step === 'pin' && (
          <div className="w-full flex flex-col gap-[20px] items-start animate-fadeIn">
            {/* Header (Figma Frame 4482: Left-aligned Title & Subtitle, No Circle 'X') */}
            <div className="w-full flex flex-col gap-[4px] items-start text-left">
              <h3 className="text-[20px] font-medium leading-[30px] text-[#0D0D0D] tracking-[-0.01em]">
                Security Authorization
              </h3>
              <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
                Escrow Dual-Custody Settlement
              </p>
            </div>

            {/* Instructions */}
            <div className="w-full flex flex-col items-center gap-[16px] py-[4px]">
              <p className="text-[13px] font-normal text-[#6B7280] text-center max-w-[300px]">
                Enter your 4-digit transaction PIN to release{' '}
                <strong className="text-[#0D0D0D] font-medium">${contract.milestoneAmount.toLocaleString()}</strong> from escrow.
              </p>

              {/* 4-Digit Input Cells (Borderless, recessed fill) */}
              <div className="flex items-center justify-center gap-[12px] py-[4px]">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="password"
                    maxLength={1}
                    value={pin[idx]}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-[52px] h-[56px] text-[24px] font-semibold text-center text-[#0D0D0D] bg-[#FDFDFD] focus:bg-[#EBF3FF] focus:text-[#0048B3] rounded-[16px] outline-none transition-all"
                  />
                ))}
              </div>

              <span className="text-[11px] text-[#9E9E9E]">
                (Demo mode: enter any 4 digits or 1234)
              </span>

              {(localError || error) && (
                <div className="w-full p-[12px] rounded-[14px] bg-[#FFF1F2] text-[12px] text-[#E11D48] text-center font-medium">
                  {localError || error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-[10px] pt-[4px]">
              <button
                type="button"
                disabled={isProcessing || pin.join('').length !== 4}
                onClick={handleConfirmRelease}
                className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-[8px]">
                    <Loading03Icon size={16} className="animate-spin" />
                    <span>Verifying & Transferring...</span>
                  </span>
                ) : (
                  <span>Confirm & Release ${contract.milestoneAmount.toLocaleString()}</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('review')}
                className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center"
              >
                Back to Milestone Review
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="w-full flex flex-col items-center gap-[20px] py-[10px] text-center select-none animate-fadeIn">
            {/* 3D Checkmark Badge per Jaradeck design system */}
            <img
              src={profileSuccessBadgeImg}
              alt="Success"
              className="w-[88px] h-[90px] object-contain animate-badge-pop"
            />

            <div className="flex flex-col items-center gap-[6px]">
              <h3 className="text-[24px] font-medium leading-[29px] text-[#0A0A0A] tracking-[-0.01em]">
                Succesful!
              </h3>
              <p className="text-[14px] font-medium leading-[21px] text-[#7B7B7B] max-w-[270px]">
                ${contract.milestoneAmount.toLocaleString()} has been credited to {contract.payeeName}'s wallet.
              </p>
            </div>

            <div className="w-full bg-[#FDFDFD] rounded-[16px] p-[12px] text-center">
              <span className="text-[11px] font-mono text-[#9E9E9E]">
                Tx: {contract.txHash || '0x4c9e81d2f78a'} • 256-bit Dual Custody Settlement
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
            >
              Done
            </button>
          </div>
        )}
      </BottomSheetModal>
  );
};
