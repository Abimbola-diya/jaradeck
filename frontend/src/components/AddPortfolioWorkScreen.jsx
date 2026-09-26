import React, { useState, useRef } from 'react';
import {
  ArrowLeft02Icon,
  Image01Icon,
  Pdf02Icon,
  Delete02Icon,
  Add01Icon,
} from 'hugeicons-react';
import { useApp } from '../context/AppContext';
import { stageLocalBlock } from '../lib/db/clientWorkspace';
import { computeSHA256 } from '../lib/media/clientCompute';

import { SelectField } from './ui/SelectField';
import { XWebCarousel } from './ui/XWebCarousel';

// Figma Vector Assets
import portfolioRiseAppPreviewImg from '../assets/portfolio_rise_app_preview.png';

export const AddPortfolioWorkScreen = ({
  initialCover,
  initialTitle,
  initialCategory = 'Product Design',
  initialYear = '2024',
  initialDescription = 'Case study on redesigning the financial wealth management experience for youth in Nigeria, focusing on simplified investment goals.',
  initialFeatured = true,
  initialProjectImages,
  forceErrorState = false,
}) => {
  const { navigateTo } = useApp();

  // If forceErrorState is true, title starts empty to match Figma 1728:2964 placeholder
  const resolvedInitialTitle =
    initialTitle !== undefined ? initialTitle : forceErrorState ? '' : 'Rise Mobile App';

  // Form State initialized to exact Figma defaults
  const [coverPreview, setCoverPreview] = useState(initialCover ?? null);
  const [title, setTitle] = useState(resolvedInitialTitle);
  const [category, setCategory] = useState(initialCategory);
  const [year, setYear] = useState(initialYear);
  const [description, setDescription] = useState(initialDescription);
  const [isFeatured, setIsFeatured] = useState(initialFeatured);

  // Field Validation Errors (matches Figma Node 1728:2964)
  const [errors, setErrors] = useState(() => {
    if (forceErrorState) {
      return {
        cover: true,
        title: true,
        category: true,
        year: true,
        description: true,
      };
    }
    return {};
  });

  // File Attachment State (matches Node 1724:2854 / 1728:3025)
  const [uploadedImages, setUploadedImages] = useState(
    () => initialProjectImages || []
  );
  const [hasFileAttachment, setHasFileAttachment] = useState(true);
  const [attachedFileName] = useState('rise-case-study-final.pdf');
  const [attachedFileDetails] = useState('4.2 MB • PDF file');
  const [attachedDocs, setAttachedDocs] = useState([]);

  // Loading & Inputs
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);

  const categories = [
    'Product Design',
    'UI/UX Design',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Brand Identity',
  ];

  // Photo Adjustment & Framing State
  const [imageAdjustment, setImageAdjustment] = useState({
    zoom: 1,
    x: 0,
    y: 0,
  });
  const [tempAdjustment, setTempAdjustment] = useState({
    zoom: 1,
    x: 0,
    y: 0,
  });
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({
    x: 0,
    y: 0,
    initialX: 0,
    initialY: 0,
  });

  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      initialX: tempAdjustment.x,
      initialY: tempAdjustment.y,
    };
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    // Panning range scales with zoom: e.g. at 1x allows +/- 110px, at 3x allows +/- 250px
    const maxPanX = Math.round(110 * tempAdjustment.zoom);
    const maxPanY = Math.round(90 * tempAdjustment.zoom);
    const newX = Math.max(-maxPanX, Math.min(maxPanX, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(-maxPanY, Math.min(maxPanY, dragStartRef.current.initialY + deltaY));
    setTempAdjustment((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
      setImageAdjustment({ zoom: 1, x: 0, y: 0 });
      setTempAdjustment({ zoom: 1, x: 0, y: 0 });
      setErrors((prev) => ({ ...prev, cover: false }));
    }
  };

  const handleDocUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [];
    const newDocs = [];

    Array.from(files).forEach((file) => {
      const isImage =
        file.type.startsWith('image/') ||
        /\.(png|jpe?g|webp|svg|gif|avif)$/i.test(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';

      if (isImage) {
        const url = URL.createObjectURL(file);
        newImages.push({
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          url,
          size: `${sizeMb} MB`,
        });
      } else {
        newDocs.push({
          id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: `${sizeMb} MB • ${ext} file`,
          ext,
        });
      }
    });

    if (newImages.length > 0) {
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
    if (newDocs.length > 0) {
      setAttachedDocs((prev) => [...prev, ...newDocs]);
    }
    e.target.value = '';
  };

  const handlePublish = async () => {
    if (isPublishing) return;

    // Validate required fields (matches Figma Node 1728:2964 error rules)
    const newErrors = {};

    if (!coverPreview) {
      newErrors.cover = true;
    }
    if (!title.trim()) {
      newErrors.title = true;
    }
    if (!category.trim()) {
      newErrors.category = true;
    }
    if (!year.trim()) {
      newErrors.year = true;
    }
    if (!description.trim()) {
      newErrors.description = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsPublishing(true);

    try {
      const workTitle = title.trim();
      const workCategory = category.trim();
      const workYear = year.trim();
      const storagePath = coverPreview || portfolioRiseAppPreviewImg;

      const contentBlob = new Blob([
        workTitle + workCategory + workYear + (description || '') + Date.now().toString(),
      ]);
      const contentHash = await computeSHA256(contentBlob);

      const newBlock = {
        id: `work_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        projectId: 'profile_portfolio_default',
        type: 'image',
        positionIndex: isFeatured ? 0 : Date.now(),
        title: workTitle,
        bodyText: `${workCategory} • ${workYear}`,
        contentHash,
        synced: false,
        storagePath,
        updatedAt: Date.now(),
      };

      await stageLocalBlock(newBlock);
      navigateTo('shared/profile-portfolio');
    } catch (err) {
      console.error('Failed to publish portfolio work:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div
      id="add-portfolio-work-screen"
      className="w-full max-w-[390px] min-h-[1168px] bg-white mx-auto flex flex-col items-center text-left font-sans select-none relative pt-[16px] pb-[120px] px-[16px]"
    >
      <div className="w-full flex flex-col items-center">
        {/* Header Bar (Node 1728:2975: 390px x 40px) */}
        <div className="w-full max-w-[358px] h-[40px] flex items-center gap-[12px] mb-[24px]">
          {/* Back Button (Frame 4423 Node 1728:3110: 40px x 40px) */}
          <button
            type="button"
            id="add-work-back-btn"
            onClick={() => navigateTo('shared/profile-portfolio')}
            className="w-[40px] h-[40px] rounded-full bg-[#FCFCFC] flex items-center justify-center cursor-pointer hover:bg-[#F3F4F6] active:scale-[0.94] transition-[background-color,transform] duration-150 ease-out outline-none shrink-0"
            aria-label="Go back to Profile"
          >
            <ArrowLeft02Icon size={20} color="#272931" />
          </button>

          {/* Screen Title (Node 1728:2980) */}
          <h1 className="text-[18px] font-medium leading-[22px] text-[#0D0D0D]">
            Add Work
          </h1>
        </div>

        {/* Form Body (Node 1728:2983: 390px x 1081px, padding 24px 16px 40px, gap 24px) */}
        <div className="w-full max-w-[358px] flex flex-col gap-[24px]">
          {/* 1. Project Cover Image (Node 1728:2984) */}
          <div className="w-full flex flex-col gap-[8px]">
            {/* Label */}
            <div className="flex items-center gap-[4px]">
              <span className="text-[13px] font-medium leading-[16px] text-[#7B7B7B]">
                Project Cover Image
              </span>
              <span className="text-[13px] font-medium leading-[16px] text-[#EF4444]">
                *
              </span>
            </div>

            {/* Dropzone Box: Error State (Node 1728:3082) vs Normal State (Node 1723:4173) */}
            {errors.cover ? (
              <div
                id="cover-upload-error-dropzone"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[91px] bg-[#FEF2F2] border border-[#FCA5A5] rounded-[20px] flex flex-col items-center justify-between py-[20px] px-[20px] cursor-pointer hover:bg-[#FEE2E2] transition-colors"
              >
                {/* 24x24px Error Icon (Node 1728:3083) */}
                <Image01Icon
                  size={24}
                  color="#EF4444"
                  className="shrink-0"
                />
                {/* Error Text (Node 1728:3086) */}
                <span className="text-[14px] font-medium text-[#991B1B] leading-[17px] text-center whitespace-nowrap">
                  Cover photo is required
                </span>
              </div>
            ) : (
              <div
                id="cover-upload-dropzone"
                className={`w-full aspect-[4/3] bg-[#FDFDFD] ${
                  isAdjusting ? 'border-2 border-[#0048B3]' : 'border border-dashed border-[#E5E7EB]'
                } rounded-[20px] flex flex-col items-center justify-center transition-colors relative overflow-hidden group select-none ${
                  coverPreview
                    ? isAdjusting
                      ? isDragging
                        ? 'p-0 cursor-grabbing'
                        : 'p-0 cursor-grab'
                      : 'p-0 cursor-pointer'
                    : 'gap-[12px] px-[24px] py-[24px] hover:bg-[#F9FAFB] cursor-pointer'
                }`}
                onClick={() => {
                  if (!coverPreview) {
                    fileInputRef.current?.click();
                  }
                }}
                onMouseDown={(e) => {
                  if (coverPreview && isAdjusting) {
                    handleDragStart(e.clientX, e.clientY);
                  }
                }}
                onMouseMove={(e) => {
                  if (coverPreview && isAdjusting) {
                    handleDragMove(e.clientX, e.clientY);
                  }
                }}
                onMouseUp={() => {
                  if (coverPreview && isAdjusting) {
                    handleDragEnd();
                  }
                }}
                onMouseLeave={() => {
                  if (coverPreview && isAdjusting && isDragging) {
                    handleDragEnd();
                  }
                }}
                onTouchStart={(e) => {
                  if (coverPreview && isAdjusting && e.touches[0]) {
                    handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (coverPreview && isAdjusting && e.touches[0]) {
                    handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchEnd={() => {
                  if (coverPreview && isAdjusting) {
                    handleDragEnd();
                  }
                }}
              >
                {coverPreview ? (
                  <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      style={{
                        transform: `translate3d(${
                          isAdjusting ? tempAdjustment.x : imageAdjustment.x
                        }px, ${isAdjusting ? tempAdjustment.y : imageAdjustment.y}px, 0) scale(${
                          isAdjusting ? tempAdjustment.zoom : imageAdjustment.zoom
                        })`,
                        transformOrigin: 'center center',
                      }}
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-75"
                    />

                    {/* Adjusting Mode Overlay */}
                    {isAdjusting ? (
                      <>
                        {/* Rule of Thirds Grid */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                          <div className="border-r border-b border-white/25"></div>
                          <div className="border-r border-b border-white/25"></div>
                          <div className="border-b border-white/25"></div>
                          <div className="border-r border-b border-white/25"></div>
                          <div className="border-r border-b border-white/25"></div>
                          <div className="border-b border-white/25"></div>
                          <div className="border-r border-b border-white/25"></div>
                          <div className="border-r border-b border-white/25"></div>
                          <div></div>
                        </div>

                        {/* Top instruction badge */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-medium flex items-center gap-1.5 shadow-sm pointer-events-none">
                          <svg
                            className="w-3.5 h-3.5 text-white/90"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M5 9l-3 3m0 0l3 3m-3-3h20m-3-3l3 3m0 0l-3 3M9 5l3-3m0 0l3 3m-3-3v20m-3-3l3 3m0 0l3-3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Drag to adjust view</span>
                        </div>

                        {/* Bottom adjustment controls */}
                        <div
                          className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/85 backdrop-blur-md rounded-[14px] px-3.5 py-2 flex flex-col gap-2 shadow-xl border border-white/10"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                        >
                          {/* Zoom Slider Row */}
                          <div className="flex items-center justify-between gap-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                setTempAdjustment((prev) => ({
                                  ...prev,
                                  zoom: Math.max(1, +(prev.zoom - 0.2).toFixed(2)),
                                }))
                              }
                              className="text-white/80 hover:text-white p-0.5 cursor-pointer transition-colors"
                              aria-label="Zoom out"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="8" y1="11" x2="14" y2="11" />
                              </svg>
                            </button>

                            <input
                              type="range"
                              id="photo-zoom-slider"
                              min="1"
                              max="3"
                              step="0.05"
                              value={tempAdjustment.zoom}
                              onChange={(e) =>
                                setTempAdjustment((prev) => ({
                                  ...prev,
                                  zoom: parseFloat(e.target.value),
                                }))
                              }
                              className="w-full accent-[#0048B3] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setTempAdjustment((prev) => ({
                                  ...prev,
                                  zoom: Math.min(3, +(prev.zoom + 0.2).toFixed(2)),
                                }))
                              }
                              className="text-white/80 hover:text-white p-0.5 cursor-pointer transition-colors"
                              aria-label="Zoom in"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                <line x1="11" y1="8" x2="11" y2="14" />
                                <line x1="8" y1="11" x2="14" y2="11" />
                              </svg>
                            </button>

                            <span className="text-white/90 text-[11px] font-mono w-7 text-right shrink-0">
                              {tempAdjustment.zoom.toFixed(1)}x
                            </span>
                          </div>

                          {/* Action Buttons Row */}
                          <div className="flex items-center justify-between border-t border-white/15 pt-1.5">
                            <button
                              type="button"
                              id="reset-photo-adjustment-btn"
                              onClick={() => setTempAdjustment({ zoom: 1, x: 0, y: 0 })}
                              className="text-white/70 hover:text-white text-[11px] font-medium py-0.5 px-1.5 cursor-pointer transition-colors"
                            >
                              Reset
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                id="cancel-photo-adjustment-btn"
                                onClick={() => {
                                  setTempAdjustment(imageAdjustment);
                                  setIsAdjusting(false);
                                }}
                                className="text-white/80 hover:text-white text-[11px] font-medium py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                id="apply-photo-adjustment-btn"
                                onClick={() => {
                                  setImageAdjustment(tempAdjustment);
                                  setIsAdjusting(false);
                                }}
                                className="bg-[#0048B3] hover:bg-[#003A91] text-white text-[11px] font-medium py-1 px-3.5 rounded-full shadow cursor-pointer transition-colors"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Standard View: Persistent Bottom-Right Actions */
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          id="adjust-cover-photo-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTempAdjustment(imageAdjustment);
                            setIsAdjusting(true);
                          }}
                          className="bg-black/65 hover:bg-black/85 active:scale-95 text-white text-[12px] font-medium px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/10"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M5 9l-3 3m0 0l3 3m-3-3h20m-3-3l3 3m0 0l-3 3M9 5l3-3m0 0l3 3m-3-3v20m-3-3l3 3m0 0l3-3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Adjust</span>
                        </button>

                        <button
                          type="button"
                          id="change-cover-photo-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="bg-black/65 hover:bg-black/85 active:scale-95 text-white text-[12px] font-medium px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/10"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                          <span>Change</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Upload Icon (Node 1723:4174: 48px x 48px) */}
                    <div className="w-[48px] h-[48px] rounded-[12px] bg-[#F0F4FC] flex items-center justify-center shrink-0">
                      <Image01Icon size={24} color="#0048B3" />
                    </div>

                    {/* Upload Text Stack (Node 1723:4176) */}
                    <div className="flex flex-col items-center gap-[4px] text-center">
                      <p className="text-[14px] font-medium text-[#0D0D0D] leading-[17px]">
                        Upload cover photo
                      </p>
                      <p className="text-[11px] text-[#6B7280] leading-[13px] text-center">
                        PNG, JPG or WEBP up to 5MB (4:3 ratio recommended)
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>

          {/* 2. Inputs Group (Node 1728:2995: 358px x 374px in error state) */}
          <div className="w-full flex flex-col gap-[16px]">
            {/* Field 2a: Project Title (Node 1728:2996) */}
            <div className="w-full flex flex-col gap-[8px]">
              <div className="flex items-center gap-[4px]">
                <span className="text-[13px] font-medium leading-[30px] text-[#7B7B7B]">
                  Project Title
                </span>
                <span className="text-[13px] font-medium leading-[16px] text-[#EF4444]">
                  *
                </span>
              </div>
              <div className="w-full h-[48px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[16px] px-[16px] flex items-center">
                <input
                  id="project-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, title: false }));
                    }
                  }}
                  placeholder="e.g., Rise Mobile App"
                  className="w-full bg-transparent text-[14px] leading-[17px] text-[#0D0D0D] placeholder-[#9E9E9E] outline-none font-normal"
                />
              </div>
              {/* Error Message (Node 1728:3088: 73px x 20px) */}
              {errors.title && (
                <div id="project-title-error" className="h-[20px] flex items-center">
                  <span className="text-[12px] font-medium text-[#991B1B] leading-[20px]">
                    Required field
                  </span>
                </div>
              )}
            </div>

            {/* Field 2b: Category / Primary Skill (Node 1728:3002) using established SelectField */}
            <SelectField
              id="category-selector-btn"
              label={
                <div className="flex items-center gap-[4px]">
                  <span className="text-[13px] font-medium leading-[30px] text-[#7B7B7B]">
                    Category / Primary Skill
                  </span>
                  <span className="text-[13px] font-medium leading-[16px] text-[#EF4444]">
                    *
                  </span>
                </div>
              }
              value={category}
              options={categories}
              onChange={(newCat) => {
                setCategory(newCat);
                setErrors((prev) => ({ ...prev, category: false }));
              }}
              rounded="rounded-[16px]"
              error={
                errors.category ? (
                  <span id="category-error" className="text-[12px] font-medium text-[#991B1B] leading-[20px]">
                    Choose a category/primary skill
                  </span>
                ) : undefined
              }
            />

            {/* Field 2c: Year Completed (Node 1728:3010) */}
            <div className="w-full flex flex-col gap-[8px]">
              <div className="flex items-center gap-[4px]">
                <span className="text-[13px] font-medium leading-[30px] text-[#7B7B7B]">
                  Year Completed
                </span>
                <span className="text-[13px] font-medium leading-[16px] text-[#EF4444]">
                  *
                </span>
              </div>
              <div className="w-full h-[48px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[16px] px-[16px] flex items-center">
                <input
                  id="year-completed-input"
                  type="text"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, year: false }));
                    }
                  }}
                  placeholder="2024"
                  className="w-full bg-transparent text-[14px] leading-[17px] text-[#0D0D0D] placeholder-[#9E9E9E] outline-none font-normal"
                />
              </div>
              {/* Error Message (Node 1728:3100: 73px x 20px) */}
              {errors.year && (
                <div id="year-error" className="h-[20px] flex items-center">
                  <span className="text-[12px] font-medium text-[#991B1B] leading-[20px]">
                    Required field
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Description (Node 1728:3016: 358px x 152px in error state) */}
          <div className="w-full flex flex-col gap-[8px]">
            <div className="flex items-center gap-[4px]">
              <span className="text-[13px] font-medium leading-[16px] text-[#7B7B7B]">
                Description
              </span>
              <span className="text-[13px] font-medium leading-[16px] text-[#EF4444]">
                *
              </span>
            </div>
            <div className="w-full min-h-[100px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[16px] p-[16px] flex items-start">
              <textarea
                id="project-description-input"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, description: false }));
                  }
                }}
                placeholder="Case study on redesigning the financial wealth management experience for youth in Nigeria, focusing on simplified investment goals."
                className="w-full h-[68px] bg-transparent text-[12px] leading-[16px] text-[#0D0D0D] placeholder-[#6B7280] resize-none outline-none font-normal"
              />
            </div>
            {/* Error Message (Node 1728:3107: 73px x 20px) */}
            {errors.description && (
              <div id="description-error" className="h-[20px] flex items-center">
                <span className="text-[12px] font-medium text-[#991B1B] leading-[20px]">
                  Required field
                </span>
              </div>
            )}
          </div>

          {/* 4. Project Files (Node 1728:3022: 358px x 148px, gap 12px) */}
          <div className="w-full flex flex-col gap-[12px]">
            <span className="text-[13px] font-medium leading-[16px] text-[#7B7B7B]">
              Project Files
            </span>

            {/* 4a. Horizontal Carousel for Uploaded Project Images using XWebCarousel */}
            {uploadedImages.length > 0 && (
              <div id="project-images-carousel-section" className="w-full">
                <XWebCarousel
                  slides={uploadedImages.map((img) => ({
                    id: img.id,
                    src: img.url,
                    alt: img.name,
                  }))}
                  aspectRatio="aspect-[4/3]"
                  onRemove={(id) => {
                    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
                  }}
                />
              </div>
            )}

            {/* 4b. Attached File Row (Node 1728:3025: 350px x 64px, bg #FCFCFC, rounded 8px, padding 12px) */}
            {hasFileAttachment && (
              <div
                id="file-attachment-row"
                className="w-full h-[64px] bg-[#FCFCFC] border border-[#F3F4F6] rounded-[8px] p-[12px] flex items-center justify-between gap-[12px]"
              >
                {/* File Icon (Node 1728:3028: 40px x 40px) */}
                <div className="w-[40px] h-[40px] rounded-[6px] bg-[#FFDAD6] flex items-center justify-center shrink-0">
                  <Pdf02Icon size={24} color="#93000A" />
                </div>

                {/* File Metadata (Node 1728:3032: 238px x 40px) */}
                <div className="flex-1 flex flex-col justify-between h-[40px] overflow-hidden">
                  <span className="text-[13px] font-medium text-[#000000] leading-[20px] truncate">
                    {attachedFileName}
                  </span>
                  <span className="text-[11px] text-[#6B7280] leading-[20px]">
                    {attachedFileDetails}
                  </span>
                </div>

                {/* Delete / Action Icon (Node 1728:3036: 24px x 24px) */}
                <button
                  type="button"
                  id="remove-file-attachment-btn"
                  onClick={() => setHasFileAttachment(false)}
                  className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-75 active:scale-95 transition-transform"
                  aria-label="Remove attached file"
                >
                  <Delete02Icon size={20} color="#6B7280" />
                </button>
              </div>
            )}

            {/* Additional Attached Documents */}
            {attachedDocs.map((doc) => (
              <div
                key={doc.id}
                className="w-full h-[64px] bg-[#FCFCFC] border border-[#F3F4F6] rounded-[8px] p-[12px] flex items-center justify-between gap-[12px]"
              >
                <div className="w-[40px] h-[40px] rounded-[6px] bg-[#FFDAD6] flex items-center justify-center shrink-0">
                  <Pdf02Icon size={24} color="#93000A" />
                </div>
                <div className="flex-1 flex flex-col justify-between h-[40px] overflow-hidden">
                  <span className="text-[13px] font-medium text-[#000000] leading-[20px] truncate">
                    {doc.name}
                  </span>
                  <span className="text-[11px] text-[#6B7280] leading-[20px]">
                    {doc.size}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                  className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-75 active:scale-95 transition-transform"
                  aria-label="Remove attached file"
                >
                  <Delete02Icon size={20} color="#6B7280" />
                </button>
              </div>
            ))}

            {/* Attach PDF, Figma links or Images Button (Node 1728:3042: 350px x 44px, bg #FCFCFC, rounded 16px) */}
            <button
              type="button"
              id="attach-files-btn"
              onClick={() => docInputRef.current?.click()}
              className="w-full h-[44px] bg-[#FCFCFC] border border-[#F3F4F6] hover:bg-[#F3F4F6] active:scale-[0.98] rounded-[16px] flex items-center justify-center gap-[10px] cursor-pointer transition-colors"
            >
              <Add01Icon size={16} color="#0048B3" className="shrink-0" />
              <span className="text-[13px] font-medium text-[#0048B3] leading-[16px]">
                Attach PDF, Figma links or Images
              </span>
            </button>

            {/* Hidden Document / Image Input */}
            <input
              ref={docInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.fig,.sketch"
              onChange={handleDocUpload}
              className="hidden"
            />
          </div>

          {/* 5. Featured Project Toggle (Node 1728:3046: 358px x 64px, bg #FDFDFD, rounded 16px, padding 16px) */}
          <div className="w-full h-[64px] bg-[#FDFDFD] border border-[#F3F4F6] rounded-[16px] p-[16px] flex items-center justify-between gap-[12px]">
            <div className="flex flex-col justify-between h-[32px]">
              <span className="text-[14px] font-medium text-[#0D0D0D] leading-[17px]">
                Featured Project
              </span>
              <span className="text-[11px] text-[#6B7280] leading-[13px]">
                Pin this project to the top of your portfolio display.
              </span>
            </div>

            {/* Toggle Switch (Node 1728:3050: 44px x 24px) */}
            <button
              type="button"
              id="featured-project-toggle"
              onClick={() => setIsFeatured((prev) => !prev)}
              className={`w-[44px] h-[24px] rounded-full p-[2px] transition-colors duration-200 cursor-pointer flex items-center ${
                isFeatured ? 'bg-[#0048B3] justify-end' : 'bg-[#E5E7EB] justify-start'
              }`}
              aria-label="Toggle featured project"
            >
              <div className="w-[20px] h-[20px] rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* 6. Publish Project CTA (Node 1728:3052: 358px x 44px, bg #0048B3, rounded 22px) */}
          <div className="w-full h-[44px]">
            <button
              type="button"
              id="publish-project-btn"
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.98] transition-all rounded-[22px] flex items-center justify-center shadow-[inset_2px_2px_4px_0px_rgba(255,255,255,0.35),inset_0px_-2px_4px_0px_rgba(255,255,255,0.3)] cursor-pointer disabled:opacity-70"
            >
              <span className="text-[14px] font-medium text-white text-center leading-[15px]">
                {isPublishing ? 'Publishing...' : 'Publish Project'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPortfolioWorkScreen;
