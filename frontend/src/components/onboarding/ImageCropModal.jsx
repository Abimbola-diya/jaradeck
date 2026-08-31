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
    <div className="ob2-sheet-overlay" onClick={onClose}>
      <div className="ob2-sheet-card" onClick={(e) => e.stopPropagation()}>
        {/* Drag Handle Bar */}
        <div className="ob2-sheet-handle-wrap">
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
            aspect={1}
            cropShape="round"
            showGrid={false}
            restrictPosition={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropAreaStyle={{
              border: '2px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.25)',
            }}
          />
        </div>

        {/* Zoom Slider flanked by photo icons */}
        <div className="ob2-sheet-zoom-row">
          <Image03Icon size={18} color="#000000" />
          <input
            type="range"
            min={1}
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
