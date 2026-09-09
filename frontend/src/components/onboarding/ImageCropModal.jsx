import React, { useState, useRef, useEffect, useCallback } from 'react';

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function ImageCropModal({ imageSrc, isOpen, onClose, onSave }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const [sheetStartY, setSheetStartY] = useState(0);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setDragOffset(0);
    }
  }, [isOpen, imageSrc]);

  const clampPosition = useCallback((pos, currentZoom) => {
    if (!imageRef.current) return pos;
    const img = imageRef.current;
    const container = containerRef.current;
    if (!container) return pos;

    const containerSize = container.clientWidth;
    const scaledWidth = img.naturalWidth * currentZoom;
    const scaledHeight = img.naturalHeight * currentZoom;

    const maxX = Math.max(0, (scaledWidth - containerSize) / 2);
    const maxY = Math.max(0, (scaledHeight - containerSize) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, pos.x)),
      y: Math.max(-maxY, Math.min(maxY, pos.y)),
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('.ob2-sheet-handle-wrap')) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.ob2-sheet-handle-wrap')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newPos = clampPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }, zoom);
    setPosition(newPos);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newPos = clampPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    }, zoom);
    setPosition(newPos);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchEnd = () => setIsDragging(false);

  const handleSheetDragStart = (y) => {
    setIsSheetDragging(true);
    setSheetStartY(y);
  };

  const handleSheetDrag = (y) => {
    if (!isSheetDragging) return;
    const delta = y - sheetStartY;
    if (delta > 0) {
      setDragOffset(delta);
    } else {
      setDragOffset(delta * 0.15);
    }
  };

  const handleSheetDragEnd = () => {
    if (!isSheetDragging) return;
    if (dragOffset > 100) {
      onClose();
    } else {
      setDragOffset(0);
    }
    setIsSheetDragging(false);
  };

  const handleSave = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setIsSaving(true);
    try {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerSize = container.clientWidth;
      const outputSize = 600;

      const scaledWidth = img.naturalWidth * zoom;
      const scaledHeight = img.naturalHeight * zoom;

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = outputSize;
      cropCanvas.height = outputSize;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.imageSmoothingEnabled = true;
      cropCtx.imageSmoothingQuality = 'high';

      const sourceX = (scaledWidth - containerSize) / 2 - position.x;
      const sourceY = (scaledHeight - containerSize) / 2 - position.y;
      const sourceSize = containerSize;

      cropCtx.drawImage(
        img,
        (sourceX / zoom),
        (sourceY / zoom),
        (sourceSize / zoom),
        (sourceSize / zoom),
        0,
        0,
        outputSize,
        outputSize
      );

      const croppedDataUrl = cropCanvas.toDataURL('image/webp', 0.92);
      onSave(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="ob2-sheet-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onMouseMove={(e) => handleSheetDrag(e.clientY)}
      onMouseUp={handleSheetDragEnd}
      onMouseLeave={handleSheetDragEnd}
      onTouchMove={(e) => handleSheetDrag(e.touches[0].clientY)}
      onTouchEnd={handleSheetDragEnd}
    >
      <div
        className="ob2-sheet-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: dragOffset !== 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isSheetDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="ob2-sheet-handle-wrap"
          onMouseDown={(e) => handleSheetDragStart(e.clientY)}
          onTouchStart={(e) => handleSheetDragStart(e.touches[0].clientY)}
        >
          <div className="ob2-sheet-handle" />
        </div>

        <div className="ob2-sheet-header">
          <h2 className="ob2-sheet-title">Crop your photo</h2>
          <p className="ob2-sheet-subtitle">
            For best results, use a PNG, JPG, or GIF image at least 300 × 300 px.
          </p>
        </div>

        <div
          className="ob2-sheet-cropper-frame"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              maxWidth: 'none',
              maxHeight: 'none',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
        </div>

        <div className="ob2-sheet-zoom-row">
          <CameraIcon />
          <input
            type="range"
            min={1}
            max={3}
            step={0.02}
            value={zoom}
            onChange={(e) => {
              const newZoom = Number(e.target.value);
              const centeredPos = clampPosition(position, newZoom);
              setZoom(newZoom);
              setPosition(centeredPos);
            }}
            className="ob2-sheet-slider"
          />
          <CameraIcon />
        </div>

        <div className="ob2-sheet-actions">
          <button type="button" className="ob2-sheet-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="ob2-sheet-save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
