import React, { useState, useEffect, useRef } from 'react';
import OBShell from './OBShell';
import ArrowRight02Icon from '../ArrowRight02Icon';
import { CameraAiIcon, Delete02Icon } from 'hugeicons-react';
import { validatePhone } from '../../utils/validation';
import { compressImageToWebP } from '../../utils/imageCompressor';
import ImageCropModal from './ImageCropModal';

const PLACEHOLDERS = [
  "Marketer driving growth through execution and strategy",
  "Product Designer crafting intuitive user-centric experiences",
  "Fullstack Developer building high-scale web applications",
  "Creative Copywriter delivering bold brand stories",
];

const MAX_CHARS = 120;

export default function ProfileStep({ role, onNext, onSignIn, onBack }) {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [rawSelectedImage, setRawSelectedImage] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [oneLiner, setOneLiner] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const fileInputRef = useRef(null);
  const isWorker = role === 'worker';

  // Rotate bio placeholder every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const wordCount = oneLiner.trim() ? oneLiner.trim().split(/\s+/).length : 0;
  const charCount = oneLiner.length;

  const isFormValid = isWorker
    ? Boolean(oneLiner.trim() && phone.trim())
    : Boolean(oneLiner.trim());

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'];
    const fileExt = file.name ? file.name.substring(file.name.lastIndexOf('.')).toLowerCase() : '';

    const isImageMime = file.type && file.type.startsWith('image/');
    const isAllowedMime = allowedMimeTypes.includes(file.type.toLowerCase()) || isImageMime;
    const isAllowedExt = allowedExtensions.includes(fileExt);

    if (!isAllowedMime || !isAllowedExt) {
      setError('Only image files (JPG, PNG, WebP, GIF, or HEIC) can be uploaded as profile photo. Videos and documents are not allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB.');
      e.target.value = '';
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setRawSelectedImage(reader.result);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarCircleClick = () => {
    if (avatarPreview || rawSelectedImage) {
      setIsCropModalOpen(true);
    }
  };

  const handleCropSave = (croppedWebpDataUrl) => {
    setAvatarPreview(croppedWebpDataUrl);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setAvatarPreview(null);
    setRawSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oneLiner.trim()) {
      setError('Please write a brief one-liner about yourself.');
      return;
    }

    if (oneLiner.length > MAX_CHARS) {
      setError(`One-liner must be ${MAX_CHARS} characters or less.`);
      return;
    }

    if (isWorker) {
      const phoneCheck = validatePhone(phone);
      if (!phoneCheck.isValid) {
        setError(phoneCheck.error);
        return;
      }
    }

    setError('');
    onNext({
      avatar: avatarPreview,
      oneLiner: oneLiner.trim(),
      ...(isWorker && { phone }),
    });
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSignIn} onBack={onBack} hideBack={true} hideAuthSwitch={true} isCropActive={isCropModalOpen}>
      {/* Top Header */}
      <div className="ob2-profile-header-wrap">
        <h1 className="ob2-title ob2-title-centered">Let's set up your profile</h1>
        <p className="ob2-subtitle ob2-subtitle-centered">
          Add a few details about yourself so clients know who they're dealing with.
        </p>
      </div>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        {/* Photo Upload Section */}
        <div className="ob2-avatar-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif"
            className="ob2-hidden-file-input"
          />

          {/* Centered Avatar Circle */}
          <div
            className={`ob2-avatar-circle ${avatarPreview ? 'has-image' : ''}`}
            onClick={handleAvatarCircleClick}
            title={avatarPreview ? "Click to edit photo" : ""}
            style={{ cursor: avatarPreview ? 'pointer' : 'default' }}
          >
            {avatarPreview ? (
              <>
                <img src={avatarPreview} alt="Profile preview" className="ob2-avatar-img" />
                <button
                  type="button"
                  className="ob2-avatar-remove-badge"
                  onClick={handleRemovePhoto}
                  title="Remove photo"
                >
                  <Delete02Icon size={14} />
                </button>
              </>
            ) : (
              <div className="ob2-avatar-placeholder">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="28" cy="20" r="9" fill="#FFFFFF" />
                  <path d="M12 46C12 36.0589 19.1634 28 28 28C36.8366 28 44 36.0589 44 46" fill="#FFFFFF" />
                </svg>
              </div>
            )}
          </div>

          {/* Centered Upload Photo Pill Button */}
          <button
            type="button"
            className="ob2-upload-pill-btn"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              fileInputRef.current?.click();
            }}
          >
            <CameraAiIcon size={18} />
            <span>{avatarPreview ? 'Change photo' : 'Upload photo'}</span>
          </button>
        </div>

        {/* One-Liner / Bio Field */}
        <div className="ob2-field">
          <div className="ob2-label-row">
            <label className="ob2-label">One-liner</label>
            <span className="ob2-char-counter">
              {charCount}/{MAX_CHARS}
            </span>
          </div>
          <textarea
            className="ob2-textarea"
            rows={3}
            maxLength={MAX_CHARS}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            value={oneLiner}
            onChange={(e) => {
              setOneLiner(e.target.value);
              setError('');
            }}
          />
          <p className="ob2-field-helper">
            This is the first thing potential clients see about you.
          </p>
        </div>

        {/* Phone Number — Worker only */}
        {isWorker && (
          <div className="ob2-field">
            <label className="ob2-label">Phone Number</label>
            <input
              type="tel"
              className="ob2-input"
              placeholder="+234 801 234 5678"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              autoComplete="tel"
            />
          </div>
        )}

        {error && <p className="ob2-error">{error}</p>}

        {/* CTA Button */}
        <button type="submit" className="ob2-cta-btn" disabled={!isFormValid}>
          Create your account
        </button>

        {/* Change Account Type link */}
        {onBack && (
          <button type="button" className="ob2-back-link-btn" onClick={onBack}>
            <span className="ob2-back-link-arrow">‹</span>
            <span>Change account type</span>
          </button>
        )}
      </form>

      {/* Image Crop & Edit Modal */}
      <ImageCropModal
        imageSrc={rawSelectedImage || avatarPreview}
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSave={handleCropSave}
      />
    </OBShell>
  );
}
