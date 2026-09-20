import React, { useState } from 'react';
import {
  Loading03Icon,
  SentIcon,
} from 'hugeicons-react';
import { useProject } from '../../context/ProjectContext';
import { BottomSheetModal } from '../ui/BottomSheetModal';

interface RequestRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_TAGS = [
  'Update color scheme',
  'Adjust copy & captions',
  'Figma layout spacing',
  'Export in higher resolution',
];

export const RequestRevisionModal: React.FC<RequestRevisionModalProps> = ({ isOpen, onClose }) => {
  const { requestRevision, isProcessing } = useProject();
  const [feedback, setFeedback] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleAddTag = (tag: string) => {
    setFeedback((prev) => (prev ? `${prev}. ${tag}` : tag));
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setFormError('Please enter detailed revision instructions for the freelancer.');
      return;
    }
    setFormError(null);
    const success = await requestRevision(feedback);
    if (success) {
      setFeedback('');
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
              Request Revisions
            </h3>
            <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
              Milestone 2 • Content Creation
            </p>
          </div>

          {/* Description */}
          <p className="text-[13px] font-normal leading-[19px] text-[#6B7280] text-left">
            Specify the adjustments needed. Escrow funds will remain safely locked until you inspect and approve the updated deliverables.
          </p>

          {/* Quick Suggestion Chips (Borderless, Figma pill style) */}
          <div className="flex flex-wrap gap-[8px] items-center">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="text-[12px] font-medium bg-[#FDFDFD] text-[#272931] px-[12px] py-[6px] rounded-full hover:bg-[#EBF3FF] hover:text-[#0048B3] cursor-pointer transition-colors outline-none select-none"
              >
                + {tag}
              </button>
            ))}
          </div>

          {/* Feedback Textarea (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
          <div className="w-full flex flex-col gap-[6px] text-left">
            <span className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
              Revision instructions
            </span>
            <div className="w-full h-[120px] bg-[#FDFDFD] rounded-[20px] p-[16px]">
              <textarea
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Describe what needs to be changed, reference specific pages or timestamps..."
                className="w-full h-full text-[14px] font-normal leading-[20px] text-[#0D0D0D] placeholder:text-[#9E9E9E] resize-none outline-none bg-transparent"
              />
            </div>
            {formError && (
              <span className="text-[12px] text-[#E11D48] font-medium">{formError}</span>
            )}
          </div>

          {/* Action Buttons (Figma Frame 4: 44px, #0048B3, 22px rounded, inset shadow) */}
          <div className="w-full flex flex-col gap-[10px] pt-[4px]">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmit}
              className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center gap-[8px] text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loading03Icon size={16} className="animate-spin" />
                  <span>Submitting Revision Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Revision Request</span>
                  <SentIcon size={16} />
                </>
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
