import React, { useRef } from 'react';
import uploadIconSvg from '../../assets/portfolio_upload_icon.svg';
import progressFileIconSvg from '../../assets/upload_progress_file_icon.svg';
import progressCancelXSvg from '../../assets/upload_progress_cancel_x.svg';

export interface PortfolioUploadFieldProps {
  state?: 'idle' | 'in_progress';
  fileName?: string;
  statusText?: string;
  progressPercent?: number;
  uploadTitle?: string;
  descriptionTitle?: string;
  descriptionPlaceholder?: string;
  maxSizeMB?: number;
  onFilesChange?: (files: File[]) => void;
  onDescriptionChange?: (description: string) => void;
  onCancel?: () => void;
  descriptionValue?: string;
}

export const PortfolioUploadField: React.FC<PortfolioUploadFieldProps> = ({
  state = 'in_progress',
  fileName = 'Image 1',
  statusText = 'Upload in progress',
  progressPercent = 54,
  uploadTitle = 'Portfolio Upload',
  descriptionTitle = 'Description',
  descriptionPlaceholder = 'Describe your work',
  maxSizeMB = 50,
  onFilesChange,
  onDescriptionChange,
  onCancel,
  descriptionValue,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    if (onFilesChange) {
      onFilesChange(Array.from(filesList));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-[350px] flex flex-col gap-[16px] text-left">
      {/* 1. Portfolio Upload Section */}
      <div className="w-[350px] flex flex-col gap-[8px]">
        {/* Label (Node 1427:1247 / 1427:1174) */}
        <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B] select-none">
          {uploadTitle}
        </label>

        {state === 'in_progress' ? (
          /* UPLOAD IN PROGRESS STATE (Node 1427:1270 - 350x74px, border #FCFCFC, rad 8px) */
          <div className="w-[350px] h-[74px] bg-[#FFFFFF] border border-[#FCFCFC] rounded-[8px] p-[13px] flex items-center justify-between gap-[12px] shadow-sm select-none">
            {/* Left: PDF Badge Icon (Node 1427:1271 - 40x40px) */}
            <div className="w-[40px] h-[40px] rounded-[6px] overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={progressFileIconSvg}
                alt="PDF icon"
                className="w-[40px] h-[40px] object-contain"
              />
            </div>

            {/* Center: Details Stack (Node 1427:1275 - 236x48px) */}
            <div className="w-[236px] h-[48px] flex flex-col justify-between items-start text-left">
              {/* File Name (Node 1427:1277) */}
              <span className="text-[13px] font-medium leading-[16px] text-[#000000] truncate">
                {fileName}
              </span>

              {/* Status Subtext + Progress Bar (Node 1427:1300) */}
              <div className="w-full flex flex-col gap-[6px]">
                <span className="text-[12px] font-normal leading-[16px] text-[#6B7280]">
                  {statusText}
                </span>

                {/* Progress Bar Track (Node 1427:1293 - width: 192px) */}
                <div className="w-[192px] h-[4px] bg-[#B7B6B6] rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#0048B3] rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Cancel Button (Node 1427:1301 - 24x24px) */}
            <button
              type="button"
              onClick={onCancel}
              className="w-[24px] h-[24px] flex items-center justify-center shrink-0 cursor-pointer outline-none hover:opacity-70 transition-opacity"
              aria-label="Cancel upload"
            >
              <img
                src={progressCancelXSvg}
                alt="Cancel"
                className="w-[24px] h-[24px] object-contain"
              />
            </button>
          </div>
        ) : (
          /* IDLE DROPZONE STATE (Node 1427:1175 - 350x202px, dashed border #CFCFCF, rad 8px) */
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-[350px] h-[202px] border border-dashed border-[#CFCFCF] rounded-[8px] p-[33px_62px_33px_63px] flex flex-col items-center justify-between bg-white cursor-pointer select-none"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* SVG Badge Icon (Node 1427:1176 - 64x72px) */}
            <div className="w-[64px] h-[72px] flex items-center justify-center shrink-0">
              <img
                src={uploadIconSvg}
                alt="Upload file icon"
                className="w-[64px] h-[72px] object-contain"
              />
            </div>

            {/* Text Stack (Node 1427:1183 - 225x48px, gap: 4px) */}
            <div className="w-[225px] h-[48px] flex flex-col items-center justify-between">
              <span className="w-[225px] text-[16px] font-medium leading-[24px] text-[#000000] text-center">
                Click to browse or drag and drop
              </span>
              <span className="w-[144px] text-[14px] font-normal leading-[20px] text-[#6B7280] text-center">
                Maximum file size {maxSizeMB}MB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Description Section (Frame 4469 Node 1427:1261 - 350x128px) */}
      <div className="w-[350px] flex flex-col gap-[8px]">
        {/* Label (Node 1427:1262) */}
        <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B] select-none">
          {descriptionTitle}
        </label>

        {/* Textarea Container (Node 1427:1263 - 350x90px, bg #FDFDFD, rad 20px) */}
        <div className="w-[350px] h-[90px] bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col justify-start">
          <textarea
            value={descriptionValue}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            placeholder={descriptionPlaceholder}
            className="w-full h-full bg-transparent resize-none outline-none text-[14px] font-medium leading-[22px] text-[#1A1C1F] placeholder:text-[#7B7B7B]"
          />
        </div>
      </div>
    </div>
  );
};
