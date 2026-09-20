import React from 'react';
import {
  Download02Icon,
  CheckmarkCircle02Icon,
} from 'hugeicons-react';
import { DeliverableFile } from '../../context/ProjectContext';
import { getFileTypeConfig, formatFileSize } from '../../utils/fileTypeUtils';
import { BottomSheetModal } from '../ui/BottomSheetModal';
import portfolioWork1 from '../../assets/portfolio_work_1.png';
import portfolioWork2 from '../../assets/portfolio_work_2.png';

interface DeliverablePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: DeliverableFile | null;
}

export const DeliverablePreviewModal: React.FC<DeliverablePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  if (!file) return null;

  const config = getFileTypeConfig(file.name, file.type);
  const IconComponent = config.icon;

  // Select realistic preview image based on category
  const previewImage = file.previewUrl || (config.category === 'image' ? portfolioWork2 : portfolioWork1);

  const handleDownload = () => {
    // If file has downloadUrl, trigger download, otherwise simulate
    if (file.downloadUrl) {
      const a = document.createElement('a');
      a.href = file.downloadUrl;
      a.download = file.name;
      a.click();
    } else {
      console.log('Downloading deliverable file:', file.name);
      // Simulate file download
      const blob = new Blob(['Mock deliverable payload: ' + file.name], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose}>
      {/* Header (Figma Frame 4482: Left-aligned Title & Subtitle, Zero X button) */}
      <div className="w-full flex flex-col gap-[4px] items-start text-left">
        <div className="flex items-center gap-[10px] w-full">
          <div
            className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: config.bgColor }}
          >
            <IconComponent size={20} color={config.color} className="shrink-0" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-[18px] font-medium leading-[26px] text-[#0D0D0D] tracking-[-0.01em] truncate">
              {file.name}
            </h3>
            <p className="text-[12px] font-medium leading-[18px] text-[#9E9E9E] truncate">
              {formatFileSize(file.size)} • {config.label} • {file.uploadedAt}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Deliverable Preview Card (Figma Frame 4422: #FDFDFD, rounded-[20px]) */}
      <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[14px] flex flex-col items-center gap-[12px]">
        {/* Main Display Area */}
        <div className="w-full max-h-[320px] overflow-hidden rounded-[16px] bg-[#F5F6F8] flex items-center justify-center relative select-none">
          {config.category === 'image' || config.category === 'pdf' ? (
            <img
              src={previewImage}
              alt={file.name}
              className="w-full h-[260px] object-cover rounded-[16px]"
            />
          ) : config.category === 'figma' ? (
            <div className="w-full h-[240px] bg-gradient-to-br from-[#F3E8FF] to-[#EDE9FE] rounded-[16px] flex flex-col items-center justify-center gap-[12px] p-[20px]">
              <div className="w-[64px] h-[64px] rounded-[20px] bg-white shadow-sm flex items-center justify-center">
                <IconComponent size={36} color="#9333EA" />
              </div>
              <div className="text-center">
                <span className="text-[14px] font-medium text-[#0D0D0D] block">Figma Design Canvas</span>
                <span className="text-[12px] text-[#6B7280]">Component Library & Design Tokens</span>
              </div>
            </div>
          ) : config.category === 'archive' ? (
            <div className="w-full h-[240px] bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-[16px] flex flex-col items-center justify-center gap-[12px] p-[20px]">
              <div className="w-[64px] h-[64px] rounded-[20px] bg-white shadow-sm flex items-center justify-center">
                <config.icon size={36} color="#D97706" />
              </div>
              <div className="text-center">
                <span className="text-[14px] font-medium text-[#0D0D0D] block">ZIP Package</span>
                <span className="text-[12px] text-[#6B7280]">Archive containing milestone source files</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-[240px] bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] rounded-[16px] flex flex-col items-center justify-center gap-[12px] p-[20px]">
              <div className="w-[64px] h-[64px] rounded-[20px] bg-white shadow-sm flex items-center justify-center">
                <config.icon size={36} color="#4B5563" />
              </div>
              <div className="text-center">
                <span className="text-[14px] font-medium text-[#0D0D0D] block">{config.label}</span>
                <span className="text-[12px] text-[#6B7280]">{file.name}</span>
              </div>
            </div>
          )}

          {/* Visual Preview Tag */}
          <div className="absolute bottom-[10px] right-[10px]">
            <span className="text-[11px] font-medium text-white/95 bg-black/60 backdrop-blur-md px-[10px] py-[4px] rounded-full">
              {config.category === 'image'
                ? 'High-Res Preview'
                : config.category === 'pdf'
                ? '15 Slides'
                : config.label}
            </span>
          </div>
        </div>

        {/* Cryptographic Integrity Footer */}
        <div className="w-full flex items-center justify-between text-left px-[4px] pt-[2px]">
          <div className="flex flex-col min-w-0 pr-[8px]">
            <span className="text-[13px] font-medium text-[#0D0D0D] truncate">
              Deliverable Checksum
            </span>
            <span className="text-[11px] font-mono text-[#6B7280] truncate">
              {file.hash || 'sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4...'}
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#10B981] bg-[#10B981]/10 px-[8px] py-[3px] rounded-full flex items-center gap-[4px] shrink-0">
            <CheckmarkCircle02Icon size={12} />
            <span>Verified</span>
          </span>
        </div>
      </div>

      {/* Action Buttons (Figma Frame 4: 44px primary, 36px secondary) */}
      <div className="w-full flex flex-col gap-[10px] pt-[4px]">
        {/* Primary Action: Download */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center gap-[8px] text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
        >
          <Download02Icon size={18} />
          <span>Download Deliverable</span>
        </button>

        {/* Secondary Action: Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-[36px] rounded-[18px] text-[#7A7A7A] hover:text-[#0D0D0D] text-[13px] font-medium transition-colors cursor-pointer outline-none flex items-center justify-center"
        >
          Close Preview
        </button>
      </div>
    </BottomSheetModal>
  );
};
