import React, { useState } from 'react';
import { Cancel01Icon, Add01Icon } from 'hugeicons-react';
import portfolioRiseAppPreviewImg from '../../assets/portfolio_rise_app_preview.png';

export const AddPortfolioWorkModal = ({ isOpen, onClose, onWorkAdded }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Product Design');
  const [year, setYear] = useState('2024');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBlock = {
      id: `work-${Date.now()}`,
      projectId: 'profile_portfolio_default',
      type: 'image',
      positionIndex: Date.now(),
      title: title.trim(),
      bodyText: `${category} • ${year}`,
      storagePath: portfolioRiseAppPreviewImg,
      synced: true,
      updatedAt: Date.now(),
    };

    if (onWorkAdded) onWorkAdded(newBlock);
    setTitle('');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-4 select-none">
      <div className="w-full max-w-[390px] bg-white rounded-[24px] p-[20px] flex flex-col gap-[16px] animate-fade-in shadow-2xl relative">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-medium text-[#0D0D0D]">
            Add Portfolio Work
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
          >
            <Cancel01Icon size={18} color="#6B7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
          <div>
            <label className="text-[12px] font-medium text-[#6B7280] block mb-[4px]">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Rise Mobile App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-[44px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[14px] px-[14px] text-[14px] outline-none focus:border-[#0048B3]"
              required
            />
          </div>

          <div className="flex gap-[10px]">
            <div className="flex-1">
              <label className="text-[12px] font-medium text-[#6B7280] block mb-[4px]">
                Category
              </label>
              <input
                type="text"
                placeholder="Product Design"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[44px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[14px] px-[14px] text-[14px] outline-none focus:border-[#0048B3]"
              />
            </div>
            <div className="w-[100px]">
              <label className="text-[12px] font-medium text-[#6B7280] block mb-[4px]">
                Year
              </label>
              <input
                type="text"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full h-[44px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[14px] px-[14px] text-[14px] outline-none focus:border-[#0048B3]"
              />
            </div>
          </div>

          <div className="flex gap-[10px] pt-[8px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[44px] rounded-full border border-[#E5E7EB] text-[#4B5563] text-[14px] font-medium hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-[44px] rounded-full bg-[#0048B3] text-white text-[14px] font-medium hover:bg-[#003A91] cursor-pointer flex items-center justify-center gap-[4px]"
            >
              <Add01Icon size={16} color="#FFFFFF" />
              <span>Save Work</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPortfolioWorkModal;
