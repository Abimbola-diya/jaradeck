import React, { useState, useRef } from 'react';

export interface XSlide {
  id: string;
  src: string;
  alt: string;
  name?: string;
  size?: string;
}

export interface XWebCarouselProps {
  slides: XSlide[];
  aspectRatio?: string;
  rounded?: string;
  border?: string;
  showArrows?: boolean;
  onRemove?: (id: string) => void;
  className?: string;
}

export const XWebCarousel: React.FC<XWebCarouselProps> = ({
  slides,
  aspectRatio = 'aspect-[4/3]',
  rounded = '',
  border = '',
  showArrows = false,
  onRemove,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    if (clientWidth > 0) {
      const nextIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex(Math.max(0, Math.min(slides.length - 1, nextIndex)));
    }
  };

  const navigateTo = (index: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({
      left: index * scrollContainerRef.current.clientWidth,
      behavior: 'smooth',
    });
  };

  if (!slides.length) return null;

  return (
    <div
      id="x-web-carousel"
      className={`group relative w-full max-w-[550px] ${aspectRatio} overflow-hidden ${rounded} ${border} bg-black select-none ${className}`}
    >
      {/* Scrollable Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ overscrollBehaviorX: 'contain' }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="h-full w-full flex-shrink-0 snap-start snap-always relative"
          >
            <img
              src={slide.src}
              alt={slide.alt || 'Carousel image'}
              className="h-full w-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Remove Button for Current Slide */}
      {onRemove && slides[activeIndex] && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(slides[activeIndex].id);
          }}
          aria-label="Remove image"
          className="absolute top-2.5 right-2.5 z-20 rounded-full bg-black/60 hover:bg-black/85 p-1.5 text-white backdrop-blur-md transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Prev Button */}
      {showArrows && activeIndex > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(activeIndex - 1);
          }}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/70 p-2 text-white opacity-85 transition-opacity duration-150 hover:bg-black/90 md:opacity-0 md:group-hover:opacity-100 cursor-pointer shadow-md"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {showArrows && activeIndex < slides.length - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(activeIndex + 1);
          }}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/70 p-2 text-white opacity-85 transition-opacity duration-150 hover:bg-black/90 md:opacity-0 md:group-hover:opacity-100 cursor-pointer shadow-md"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Indicator Pill */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1.5 backdrop-blur-md">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                idx === activeIndex ? 'w-3.5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default XWebCarousel;
