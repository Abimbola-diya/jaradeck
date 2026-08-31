import React, { useState, useCallback } from 'react';
import { Image03Icon } from 'hugeicons-react';
import EasyCropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';

const Cropper = EasyCropper?.default || EasyCropper;



export default function ImageCropModal({ imageSrc, isOpen, onClose, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Drag-to-dismiss state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const startDrag = (y) => {
    setStartY(y);
    setIsDragging(true);
  };

  const onDrag = (y) => {
    if (!isDragging) return;
    const delta = y - startY;
    if (delta > 0) {
      setDragOffset(delta);
    } else {
      setDragOffset(delta * 0.15);
    }
  };

  const endDrag = () => {
    if (!isDragging) return;
    if (dragOffset > 100) {
      onClose();
    } else {
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  if (!isOpen || !imageSrc) return null;

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const croppedDataUrl = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0, // rotation
        { horizontal: false, vertical: false }, // flip
        'none', // filter
        100, // brightness
        100, // contrast
        600 // output size
      );
      onSave(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="ob2-sheet-overlay" 
      onClick={onClose}
      onMouseMove={(e) => onDrag(e.clientY)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={(e) => onDrag(e.touches[0].clientY)}
      onTouchEnd={endDrag}
    >
      <div 
        className="ob2-sheet-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: dragOffset !== 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drag Handle Bar */}
        <div 
          className="ob2-sheet-handle-wrap"
          onMouseDown={(e) => startDrag(e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
        >
          <div className="ob2-sheet-handle" />
        </div>

        {/* Header & Instructions */}
        <div className="ob2-sheet-header">
          <h2 className="ob2-sheet-title">Crop your photo</h2>
          <p className="ob2-sheet-subtitle">
            For best results, use a PNG, JPG, or GIF image at least 300 × 300 px.
          </p>
        </div>

        {/* Cropper Container Frame */}
        <div className="ob2-sheet-cropper-frame">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            minZoom={0.5}
            aspect={1}
            cropShape="round"
            cropSize={{ width: 200, height: 200 }}
            showGrid={false}
            restrictPosition={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropAreaStyle={{
              border: '2px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.4)',
            }}
          />
        </div>

        {/* Zoom Slider flanked by photo icons */}
        <div className="ob2-sheet-zoom-row">
          <Image03Icon size={18} color="#000000" />
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.02}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="ob2-sheet-slider"
          />
          <Image03Icon size={24} color="#000000" />
        </div>

        {/* Action Buttons */}
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
