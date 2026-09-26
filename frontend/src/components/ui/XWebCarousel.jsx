import React from 'react';
import binIconSvg from '../../assets/bin_icon.svg';

export const XWebCarousel = ({ slides = [], aspectRatio = 'aspect-[4/3]', onRemove }) => {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full flex items-center gap-[12px] overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
      {slides.map((slide) => (
        <div
          key={slide.id}
          className={`relative shrink-0 w-[140px] ${aspectRatio} rounded-[16px] overflow-hidden border border-[#F3F4F6] bg-[#FDFDFD] snap-start group`}
        >
          <img
            src={slide.src}
            alt={slide.alt || 'Project slide'}
            className="w-full h-full object-cover"
          />
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(slide.id)}
              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-sm"
              aria-label="Remove image"
            >
              <img src={binIconSvg} alt="Delete" className="w-4 h-4 filter invert" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default XWebCarousel;
