import React from 'react';

export type OfferCardVariant =
  | 'default'
  | 'counter'
  | 'accepted'
  | 'review'
  | 'variant5';

export interface OfferCardProps {
  variant?: OfferCardVariant;
  scope?: string;
  duration?: string;
  budget?: string;
  reviewerName?: string;
  counterName?: string;
  className?: string;
  onAcceptOffer?: () => void;
  onCounter?: () => void;
  onAcceptCounter?: () => void;
  onDecline?: () => void;
  testId?: string;
}

/**
 * OfferCard Component
 * Implements Figma Node 1831:2834 Component Set ("Offer Card")
 * Supports all 5 variants:
 * - default: Project Offer (Draft) with "Awaiting [Name]'s review" status button
 * - counter: [Name]'s Counter (Draft) with "Accept Counter" and "Decline" buttons
 * - accepted: Offer Accepted (Awaiting Funding) with status button
 * - review: Project Offer (Draft) with "Accept Offer" and "Counter" buttons
 * - variant5: Project Offer (Draft) variant with status button
 */
export const OfferCard: React.FC<OfferCardProps> = ({
  variant = 'default',
  scope = 'Instagram Mgmt',
  duration = '4 Weeks',
  budget = '120,000',
  reviewerName = 'Sarah',
  counterName = 'Sarah',
  className = '',
  onAcceptOffer,
  onCounter,
  onAcceptCounter,
  onDecline,
  testId,
}) => {
  // Title text & colors
  let titleText = 'Project Offer';
  let titleColor = '#0048B3';
  let badgeText = 'Draft';
  let badgeBg = '#E0F2FE';
  let badgeTextColor = '#0369A1';

  if (variant === 'counter') {
    titleText = `${counterName}’s Counter`;
    titleColor = '#B45309';
    badgeText = 'Draft';
    badgeBg = '#FEF3C7';
    badgeTextColor = '#B45309';
  } else if (variant === 'accepted') {
    titleText = 'Offer Accepted';
    titleColor = '#0048B3';
    badgeText = 'Awaiting Funding';
    badgeBg = '#E0F2FE';
    badgeTextColor = '#0369A1';
  }

  const awaitingReviewerFirstName = reviewerName.split(' ')[0] || 'Sarah';

  return (
    <div
      data-testid={testId || `offer-card-${variant}`}
      className={`w-[280px] bg-[#FCFCFC] rounded-[16px] px-[16px] py-[22px] flex flex-col justify-between select-none ${className}`}
    >
      {/* Top Section: Header, Divider, Details Grid (Frame 4502) */}
      <div className="w-full flex flex-col">
        {/* Card Title Row */}
        <div className="w-full flex items-center justify-between">
          <span
            className="text-[14px] font-medium leading-[17px]"
            style={{ color: titleColor }}
          >
            {titleText}
          </span>
          <div
            className="rounded-[22px] px-[10px] py-[3px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: badgeBg }}
          >
            <span
              className="text-[8px] font-medium leading-[10px]"
              style={{ color: badgeTextColor }}
            >
              {badgeText}
            </span>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-[#E5E7EB] my-[14px]" />

        {/* Details Grid (Frame 4502 / Details Grid) */}
        <div className="w-full flex flex-col gap-[8px]">
          {/* Scope Row */}
          <div className="w-full flex items-center justify-between text-[12px] leading-[14px]">
            <span className="text-[#6B7280]">Scope</span>
            <span className="font-medium text-[#272931]">{scope}</span>
          </div>

          {/* Duration Row */}
          <div className="w-full flex items-center justify-between text-[12px] leading-[14px]">
            <span className="text-[#6B7280]">Duration</span>
            <span className="font-medium text-[#272931]">{duration}</span>
          </div>

          {/* Budget Row */}
          <div className="w-full flex items-center justify-between text-[12px] leading-[14px]">
            <span className="text-[#6B7280]">Budget</span>
            <span className="font-medium text-[#272931]">{budget}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="w-full mt-[24px]">
        {variant === 'counter' ? (
          /* Dual Action: Accept Counter / Decline (Frame 4504) */
          <div className="w-full flex items-center gap-[8px]">
            <button
              type="button"
              data-testid="offer-card-accept-counter-button"
              onClick={onAcceptCounter}
              style={{
                boxShadow:
                  'inset 2px 2px 4px 0px rgba(255, 255, 255, 0.35), inset 0px -2px 4px 0px rgba(255, 255, 255, 0.3)',
              }}
              className="flex-1 h-[33px] rounded-[22px] bg-[#0048B3] flex items-center justify-center cursor-pointer hover:opacity-95 active:scale-[0.98] transition-all outline-none"
            >
              <span className="text-[12px] font-medium leading-[13px] text-white text-center">
                Accept Counter
              </span>
            </button>
            <button
              type="button"
              data-testid="offer-card-decline-button"
              onClick={onDecline}
              className="flex-1 h-[35px] rounded-[22px] border border-[#CFCFCF] bg-transparent flex items-center justify-center cursor-pointer hover:bg-black/5 active:scale-[0.98] transition-all outline-none"
            >
              <span className="text-[12px] font-medium leading-[13px] text-[#0D0D0D] text-center">
                Decline
              </span>
            </button>
          </div>
        ) : variant === 'review' ? (
          /* Dual Action: Accept Offer / Counter (Frame 4504) */
          <div className="w-full flex items-center gap-[8px]">
            <button
              type="button"
              data-testid="offer-card-accept-offer-button"
              onClick={onAcceptOffer}
              style={{
                boxShadow:
                  'inset 2px 2px 4px 0px rgba(255, 255, 255, 0.35), inset 0px -2px 4px 0px rgba(255, 255, 255, 0.3)',
              }}
              className="flex-1 h-[33px] rounded-[22px] bg-[#0048B3] flex items-center justify-center cursor-pointer hover:opacity-95 active:scale-[0.98] transition-all outline-none"
            >
              <span className="text-[12px] font-medium leading-[13px] text-white text-center">
                Accept Offer
              </span>
            </button>
            <button
              type="button"
              data-testid="offer-card-counter-button"
              onClick={onCounter}
              className="flex-1 h-[35px] rounded-[22px] border border-[#CFCFCF] bg-transparent flex items-center justify-center cursor-pointer hover:bg-black/5 active:scale-[0.98] transition-all outline-none"
            >
              <span className="text-[12px] font-medium leading-[13px] text-[#0D0D0D] text-center">
                Counter
              </span>
            </button>
          </div>
        ) : (
          /* Single Status Pill: Awaiting [Name]'s review (Frame 3) */
          <div
            data-testid="offer-card-awaiting-button"
            className="w-full h-[33px] rounded-[22px] bg-[#6B7280] flex items-center justify-center pointer-events-none"
            style={{
              boxShadow:
                'inset 2px 2px 4px 0px rgba(255, 255, 255, 0.35), inset 0px -2px 4px 0px rgba(255, 255, 255, 0.3)',
            }}
          >
            <span className="text-[12px] font-medium leading-[13px] text-white text-center">
              Awaiting {awaitingReviewerFirstName}’s review
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
