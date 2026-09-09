import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import OBShell from './OBShell';
import ArrowRight02Icon from '../ArrowRight02Icon';
import { validatePhone } from '../../utils/validation';
import { API_BASE_URL } from '../../lib/api';
import ImageCropModal from './ImageCropModal';

const PLACEHOLDERS = [
  'Marketer driving growth through execution and strategy',
  'Product Designer crafting intuitive user-centric experiences',
  'Fullstack Developer building high-scale web applications',
  'Creative Copywriter delivering bold brand stories',
];

const MAX_CHARS = 120;

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export default function ProfileStep({ role, onNext, onSignIn, onBack }) {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [rawSelectedImage, setRawSelectedImage] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [oneLiner, setOneLiner]           = useState('');
  const [phone, setPhone]                 = useState('');
  const [error, setError]                 = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const fileInputRef = useRef(null);
  const isWorker = role === 'worker';

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx(p => (p + 1) % PLACEHOLDERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const isFormValid = isWorker
    ? Boolean(oneLiner.trim() && phone.trim())
    : Boolean(oneLiner.trim());

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files can be uploaded as a profile photo.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5 MB.');
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oneLiner.trim()) { setError('Please write a brief one-liner about yourself.'); return; }
    if (oneLiner.length > MAX_CHARS) { setError(`One-liner must be ${MAX_CHARS} characters or less.`); return; }
    if (isWorker) {
      const check = validatePhone(phone);
      if (!check.isValid) { setError(check.error); return; }
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Upload avatar if one was selected
      let avatarUrl = null;
      if (avatarPreview) {
        const formData = new FormData();
        formData.append('image_data', avatarPreview);
        const uploadRes = await fetch(`${API_BASE_URL}/api/media/upload-avatar`, {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          avatarUrl = uploadData?.data?.secure_url || null;
        }
        // Non-fatal: if upload fails we still proceed
      }

      onNext({ avatarUrl, oneLiner: oneLiner.trim(), ...(isWorker && { phone }) });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OBShell isSignIn={false} onAuthSwitch={onSignIn} onBack={onBack} hideBack={true} hideAuthSwitch={true} isCropActive={isCropModalOpen}>
      {/* Top Header */}
      <div className="ob2-profile-header-wrap">
        <h1 className="ob2-title ob2-title-centered">Let&apos;s set up your profile</h1>
          <p className="ob2-subtitle ob2-subtitle-centered">
          Add a few details about yourself so clients know who they&apos;re dealing with.
        </p>
      </div>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        {/* Photo Upload Section */}
        <div className="ob2-avatar-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
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
                  <TrashIcon />
                </button>
              </>
            ) : (
              <div className="ob2-avatar-placeholder">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
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
            <CameraIcon />
            <span>{avatarPreview ? 'Change photo' : 'Upload photo'}</span>
          </button>
        </div>

        <div className="ob2-field">
          <div className="ob2-label-row">
            <label className="ob2-label">One-liner</label>
            <span className="ob2-char-counter">{oneLiner.length}/{MAX_CHARS}</span>
          </div>
          <textarea
            className="ob2-textarea"
            rows={3}
            maxLength={MAX_CHARS}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            value={oneLiner}
            onChange={(e) => { setOneLiner(e.target.value); setError(''); }}
          />
          <p className="ob2-field-helper">This is the first thing potential clients see about you.</p>
        </div>

        {isWorker && (
          <div className="ob2-field">
            <label className="ob2-label">Phone Number</label>
            <input
              type="tel"
              className="ob2-input"
              placeholder="+234 801 234 5678"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              autoComplete="tel"
            />
          </div>
        )}

        {error && <p className="ob2-error">{error}</p>}

        <button type="submit" className="ob2-cta-btn" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Saving…' : <> Create your account <ArrowRight02Icon size={18} /> </>}
        </button>

        {onBack && (
          <button type="button" className="ob2-back-link-btn" onClick={onBack}>
            <span className="ob2-back-link-arrow">‹</span>
            <span>Change account type</span>
          </button>
        )}
      </form>

      {/* Image Crop Modal */}
      <ImageCropModal
        imageSrc={rawSelectedImage || avatarPreview}
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSave={handleCropSave}
      />
    </OBShell>
  );
}

ProfileStep.propTypes = {
  role: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onSignIn: PropTypes.func,
  onBack: PropTypes.func,
};
