import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { validatePhone, validateEmail } from '../utils/validation';

const TOTAL_STEPS = 5;

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', placeholder: '080... or +234...', type: 'tel' },
  { id: 'email',    label: 'Email',    placeholder: 'you@example.com', type: 'email' },
  { id: 'x',        label: 'X',        placeholder: '@lagabaja', type: 'text' },
  { id: 'instagram',label: 'Instagram',placeholder: '@username', type: 'text' },
];

// Helper to calculate channel error
function getChannelError(id, val) {
  if (!val || !val.trim()) return '';
  if (id === 'whatsapp') {
    const res = validatePhone(val);
    return res.isValid ? '' : res.error;
  }
  if (id === 'email') {
    const res = validateEmail(val);
    return res.isValid ? '' : res.error;
  }
  return '';
}

// ─── Step 1: Name ─────────────────────────────────────────────────────────────

function StepName({ value, onChange, onNext }) {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="wf-step">
      <p className="wf-greeting">Nice to meet you.</p>
      <h2 className="wf-question">What should we call you?</h2>
      <input
        ref={inputRef}
        className="wf-input"
        type="text"
        placeholder="Lagabaja Tamedo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && value.trim() && onNext()}
        autoComplete="off"
      />
      <button className="wf-next-btn" onClick={onNext} disabled={!value.trim()}>
        Nice. →
      </button>
    </div>
  );
}

// ─── Step 2: Contact channels ─────────────────────────────────────────────────

function StepContact({ selected, contacts, onToggle, onContact, onNext }) {
  // Check validity for every selected channel
  const isEverySelectedValid = selected.length > 0 && selected.every((id) => {
    const val = contacts[id];
    if (!val || !val.trim()) return false;
    return getChannelError(id, val) === '';
  });

  return (
    <div className="wf-step">
      <h2 className="wf-question wf-question--md">
        When Jaradeck opens the doors, what's the fastest way to reach you?
      </h2>
      <p className="wf-note">(p.s: we promise not to spam you.)</p>
      <p className="wf-sublabel">Choose as many as you like</p>

      <div className="wf-channels">
        {CHANNELS.map((ch) => {
          const checked = selected.includes(ch.id);
          const val = contacts[ch.id] || '';
          const errorMsg = checked ? getChannelError(ch.id, val) : '';

          return (
            <div key={ch.id} className="wf-channel-group">
              {/* Checkbox row */}
              <button
                className={`wf-channel-btn ${checked ? 'wf-channel-btn--checked' : ''}`}
                onClick={() => onToggle(ch.id)}
                type="button"
                aria-pressed={checked}
              >
                <span className={`wf-checkbox ${checked ? 'wf-checkbox--checked' : ''}`}>
                  {checked && '✓'}
                </span>
                {ch.label}
              </button>

              {/* Conditional input — slides in when checked */}
              {checked && (
                <div style={{ width: '100%' }}>
                  <input
                    className={`wf-input wf-channel-input ${errorMsg ? 'wf-input--error' : ''}`}
                    type={ch.type}
                    placeholder={ch.placeholder}
                    value={val}
                    onChange={(e) => onContact(ch.id, e.target.value)}
                    autoComplete="off"
                  />
                  {errorMsg && (
                    <p style={{
                      color: '#F87171',
                      fontSize: '0.85rem',
                      marginTop: '0.35rem',
                      fontFamily: "'PP Neue Montreal', var(--font-family)",
                      fontWeight: 500
                    }}>
                      {errorMsg}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="wf-next-btn" onClick={onNext} disabled={!isEverySelectedValid}>
        Got it. →
      </button>
    </div>
  );
}

// ─── Step 3: Role ────────────────────────────────────────────────────────────

const ROLES = [
  { id: 'small_biz',   label: 'Small business owner' },
  { id: 'creator',     label: 'Creator' },
  { id: 'professional',label: '9–5 Professional' },
  { id: 'startup',     label: 'Startup founder' },
  { id: 'freelancer',  label: 'Freelancer / Solopreneur' },
  { id: 'other',       label: 'Something else' },
];

function StepRole({ value, otherText, onChange, onOtherText, onNext }) {
  const otherRef = useRef(null);

  useEffect(() => {
    if (value === 'other') otherRef.current?.focus();
  }, [value]);

  const isValid = value && (value !== 'other' || otherText.trim());

  return (
    <div className="wf-step">
      <h2 className="wf-question wf-question--md">What hat do you wear?</h2>

      <div className="wf-roles">
        {ROLES.map((r) => {
          const selected = value === r.id;
          return (
            <div key={r.id} className="wf-role-group">
              <button
                className={`wf-role-btn ${selected ? 'wf-role-btn--selected' : ''}`}
                onClick={() => onChange(r.id)}
                type="button"
                aria-pressed={selected}
              >
                <span className={`wf-radio ${selected ? 'wf-radio--selected' : ''}`} />
                {r.label}
              </button>

              {r.id === 'other' && selected && (
                <input
                  ref={otherRef}
                  className="wf-input wf-channel-input"
                  type="text"
                  placeholder="Tell us more..."
                  value={otherText}
                  onChange={(e) => onOtherText(e.target.value)}
                  autoComplete="off"
                />
              )}
            </div>
          );
        })}
      </div>

      <button className="wf-next-btn" onClick={onNext} disabled={!isValid}>
        Yup, that's me. →
      </button>
    </div>
  );
}

// ─── Step 4: Tasks Offload ───────────────────────────────────────────────────

const TASK_OPTIONS = [
  { id: 'social_media',     label: 'Social media management' },
  { id: 'video_editing',    label: 'Video editing' },
  { id: 'graphic_design',   label: 'Graphic design' },
  { id: 'script_writing',   label: 'Script writing' },
  { id: 'website_dev',      label: 'Website dev / management' },
  { id: 'content_creation', label: 'Content creation & copywriting' },
  { id: 'customer_support', label: 'Customer support' },
  { id: 'other',            label: 'Something else' },
];

function StepTasks({ selected, otherText, onToggle, onOtherText, onNext }) {
  const isOther = selected.includes('other');
  const isValid = selected.length > 0 && (!isOther || otherText.trim().length > 0);

  return (
    <div className="wf-step">
      <h2 className="wf-question wf-question--md">
        If you could get one thing off your plate today, what would it be?
      </h2>
      <p className="wf-sublabel">Choose all that apply</p>

      <div className="wf-channels">
        {TASK_OPTIONS.map((task) => {
          const checked = selected.includes(task.id);
          return (
            <div key={task.id} className="wf-channel-group">
              <button
                className={`wf-channel-btn ${checked ? 'wf-channel-btn--checked' : ''}`}
                onClick={() => onToggle(task.id)}
                type="button"
                aria-pressed={checked}
              >
                <span className={`wf-checkbox ${checked ? 'wf-checkbox--checked' : ''}`}>
                  {checked && '✓'}
                </span>
                {task.label}
              </button>

              {task.id === 'other' && checked && (
                <input
                  className="wf-input wf-channel-input"
                  type="text"
                  placeholder="Tell us what task..."
                  value={otherText}
                  onChange={(e) => onOtherText(e.target.value)}
                  autoComplete="off"
                  autoFocus
                />
              )}
            </div>
          );
        })}
      </div>

      <button className="wf-next-btn" onClick={onNext} disabled={!isValid}>
        Got it. →
      </button>
    </div>
  );
}

// ─── Step 5: Frequency ("One more thing...") ─────────────────────────────────

const FREQUENCIES = [
  { id: 'every_week',  label: 'Every week' },
  { id: 'few_month',   label: 'A few times a month' },
  { id: 'once_while',  label: 'Once in a while' },
  { id: 'just_one',    label: 'Just this one project' },
];

function StepFrequency({ value, onChange, onSubmit }) {
  return (
    <div className="wf-step">
      <p className="wf-one-more-thing">One more thing...</p>
      <h2 className="wf-question wf-question--md wf-question-stagger">
        Be honest... how often do you need an extra pair of hands?
      </h2>

      <div className="wf-roles wf-options-stagger">
        {FREQUENCIES.map((f) => {
          const selected = value === f.id;
          return (
            <div key={f.id} className="wf-role-group">
              <button
                className={`wf-role-btn ${selected ? 'wf-role-btn--selected' : ''}`}
                onClick={() => onChange(f.id)}
                type="button"
                aria-pressed={selected}
              >
                <span className={`wf-radio ${selected ? 'wf-radio--selected' : ''}`} />
                {f.label}
              </button>
            </div>
          );
        })}
      </div>

      <button className="wf-next-btn wf-options-stagger" onClick={onSubmit} disabled={!value}>
        Join the waitlist 🚀
      </button>
    </div>
  );
}

// ─── Success Screen ──────────────────────────────────────────────────────────

function StepSuccess({ name, onClose }) {
  const firstName = name ? name.trim().split(' ')[0] : '';
  
  useEffect(() => {
    // Shoot a burst of confetti from the center-bottom of the screen
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      zIndex: 2000,
      colors: ['#0048B3', '#ffffff', '#feb943', '#ff6b6b', '#48b300']
    });
  }, []);

  return (
    <div className="wf-step wf-step--success">
      <p className="wf-greeting">Mission Accomplished 🎉</p>
      <h2 className="wf-question">
        You're in{firstName ? `, ${firstName}` : ''}!
      </h2>
      <p className="wf-success-subtitle">
        One less thing for future you to worry about.
      </p>
      <p className="wf-success-note">
        We'll be in touch sooner than you think.
      </p>
      <button className="wf-next-btn" onClick={onClose} style={{ marginTop: '2.25rem' }}>
        Back to home →
      </button>
    </div>
  );
}


// ─── Progress Dots ────────────────────────────────────────────────────────────

function ProgressDots({ current, total }) {
  return (
    <div className="wf-progress">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`wf-dot ${i <= current ? 'wf-dot--filled' : ''}`} />
      ))}
    </div>
  );
}

// ─── Main Flow Overlay ────────────────────────────────────────────────────────

export default function WaitlistFlow({ onClose }) {
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState('in');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState({
    name: '',
    contactSelected: [],
    contacts: {},
    role: '',
    roleOther: '',
    tasksSelected: [],
    tasksOther: '',
    frequency: '',
  });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const goNext = () => {
    setAnimDir('out');
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
      setAnimDir('in');
    }, 280);
  };

  const goBack = () => {
    if (step === 0) { onClose(); return; }
    setAnimDir('out');
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimDir('in');
    }, 280);
  };

  const toggleChannel = (id) => {
    setData((d) => {
      const already = d.contactSelected.includes(id);
      return {
        ...d,
        contactSelected: already
          ? d.contactSelected.filter((c) => c !== id)
          : [...d.contactSelected, id],
      };
    });
  };

  const setContact = (id, value) => {
    setData((d) => ({ ...d, contacts: { ...d.contacts, [id]: value } }));
  };

  const toggleTask = (id) => {
    setData((d) => {
      const already = d.tasksSelected.includes(id);
      return {
        ...d,
        tasksSelected: already
          ? d.tasksSelected.filter((t) => t !== id)
          : [...d.tasksSelected, id],
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        console.error("Failed to join waitlist:", await response.text());
        // Still show success for UX, or handle error properly
      }
    } catch (err) {
      console.error("Error submitting waitlist:", err);
    }
    
    setAnimDir('out');
    setTimeout(() => {
      setIsSubmitted(true);
      setAnimDir('in');
    }, 280);
  };

  return (
    <div className="wf-overlay" role="dialog" aria-modal="true" aria-label="Reserve your spot on Jaradeck">
      {/* Fixed Background & Elements (No Scrolling Here) */}
      <div className="wf-bg-fill" />
      <img src="/lekki.svg" alt="" aria-hidden="true" className="wf-lekki-bg" />
      <button className="wf-back-btn" onClick={goBack} aria-label={step === 0 ? 'Close' : 'Go back'}>
        {step === 0 ? '✕' : '← Back'}
      </button>
      {/* Progress dots */}
      {!isSubmitted && <ProgressDots current={step} total={TOTAL_STEPS} />}

      {/* Scrolling Area for Content */}
      <div className="wf-scroll-area">
        <div className={`wf-step-wrapper wf-anim-${animDir}`}>
          {isSubmitted ? (
            <StepSuccess name={data.name} onClose={onClose} />
          ) : (
            <>
              {step === 0 && (
                <StepName
                  value={data.name}
                  onChange={(v) => setData((d) => ({ ...d, name: v }))}
                  onNext={goNext}
                />
              )}
              {step === 1 && (
                <StepContact
                  selected={data.contactSelected}
                  contacts={data.contacts}
                  onToggle={toggleChannel}
                  onContact={setContact}
                  onNext={goNext}
                />
              )}
              {step === 2 && (
                <StepRole
                  value={data.role}
                  otherText={data.roleOther}
                  onChange={(v) => setData((d) => ({ ...d, role: v, roleOther: v !== 'other' ? '' : d.roleOther }))}
                  onOtherText={(v) => setData((d) => ({ ...d, roleOther: v }))}
                  onNext={goNext}
                />
              )}
              {step === 3 && (
                <StepTasks
                  selected={data.tasksSelected}
                  otherText={data.tasksOther}
                  onToggle={toggleTask}
                  onOtherText={(v) => setData((d) => ({ ...d, tasksOther: v }))}
                  onNext={goNext}
                />
              )}
              {step === 4 && (
                <StepFrequency
                  value={data.frequency}
                  onChange={(v) => setData((d) => ({ ...d, frequency: v }))}
                  onSubmit={handleSubmit}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
