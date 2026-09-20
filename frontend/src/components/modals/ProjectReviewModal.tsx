import React, { useState } from 'react';
import {
  StarIcon,
  Loading03Icon,
  SentIcon,
} from 'hugeicons-react';
import { useProject } from '../../context/ProjectContext';
import { BottomSheetModal } from '../ui/BottomSheetModal';

interface ProjectReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectReviewModal: React.FC<ProjectReviewModalProps> = ({ isOpen, onClose }) => {
  const { submitReview, isProcessing } = useProject();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = async () => {
    const success = await submitReview(rating, comment);
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
              Rate & Review
            </h3>
            <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E]">
              Marcus Vance • Social Media Management
            </p>
          </div>

          {/* Star Rating Picker (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
          <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col items-center gap-[10px]">
            <span className="text-[14px] font-medium leading-[20px] text-[#4C4546]">Overall Satisfaction</span>
            <div className="flex items-center gap-[8px]">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110 outline-none"
                    aria-label={`Rate ${star} star`}
                  >
                    <StarIcon
                      size={32}
                      className={`w-[32px] h-[32px] transition-colors ${
                        active
                          ? 'text-[#F59E0B] fill-[#F59E0B]'
                          : 'text-[#D1D5DB] fill-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-[12px] font-medium text-[#0048B3]">
              {rating === 5
                ? 'Exceptional Work (5/5)'
                : rating === 4
                ? 'Great Experience (4/5)'
                : rating === 3
                ? 'Good (3/5)'
                : rating === 2
                ? 'Needs Improvement (2/5)'
                : 'Unsatisfactory (1/5)'}
            </span>
          </div>

          {/* Review Comment Textarea (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
          <div className="w-full flex flex-col gap-[6px] text-left">
            <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">Public Testimonial</label>
            <div className="w-full h-[120px] bg-[#FDFDFD] rounded-[20px] p-[16px]">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What made Marcus Vance stand out? How was the communication, turnaround time, and quality?"
                className="w-full h-full text-[14px] font-normal leading-[20px] text-[#0D0D0D] placeholder:text-[#9E9E9E] resize-none outline-none bg-transparent"
              />
            </div>
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
                  <span>Publishing Review...</span>
                </>
              ) : (
                <>
                  <span>Publish Review</span>
                  <SentIcon size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center"
            >
              Skip for now
            </button>
          </div>
        </div>
    </BottomSheetModal>
  );
};
