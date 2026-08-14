import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundGrid from '../components/BackgroundGrid';
import ArrowRight02Icon from '../components/ArrowRight02Icon';
import hirerSvg from '../assets/hirer.svg';

// ─── Confetti particle system ────────────────────────────────────────────────
function useConfetti(canvasRef, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = [
      '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
      '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA',
    ];

    const particles = [];

    class Particle {
      constructor() { this.reset(true); }

      reset(fromTop = false) {
        this.x = Math.random() * canvas.width;
        this.y = fromTop ? Math.random() * -canvas.height * 0.3 : -10;
        this.size = Math.random() * 8 + 4;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = Math.random() * 3 + 1.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 8;
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        this.opacity = 1;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.scaleX = Math.random() > 0.5 ? 1 : 0.4;
      }

      update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.8;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height * 0.75) {
          this.opacity = Math.max(0, this.opacity - 0.025);
        }
        if (this.y > canvas.height + 20 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(this.scaleX, 1);
        ctx.fillStyle = this.color;

        if (this.shape === 'rect') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.4);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < 180; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height * 0.6;
      particles.push(p);
    }

    const spawnInterval = setInterval(() => {
      if (particles.length < 250) particles.push(new Particle());
    }, 80);

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(spawnInterval);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, enabled]);
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ApplySuccessPage() {
  const navigate = useNavigate();
  const [showSocials, setShowSocials] = useState(false);
  const canvasRef = useRef(null);
  useConfetti(canvasRef, !showSocials);

  const textBlocks = [
    { isHeading: true, words: ["You're", "in."] },
    { isHeading: false, words: ["We'll", "take", "a", "proper", "look", "at", "your", "application.", "If", "we", "like", "what", "we", "see,", "you'll", "definitely", "hear", "from", "us."] }
  ];

  // Flatten words for global index tracking
  let globalWordCount = 0;
  const blocksWithGlobalIndices = textBlocks.map(block => ({
    ...block,
    words: block.words.map(word => ({
      text: word,
      index: globalWordCount++
    }))
  }));

  const totalWords = globalWordCount;
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Start reading after short delay
    const startTimeout = setTimeout(() => {
      setActiveWordIndex(0);
    }, 400);
    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (activeWordIndex < 0) return;
    if (activeWordIndex >= totalWords) {
      setIsFinished(true);
      return;
    }

    // Find current word text to check for punctuation delays
    let currentWordStr = "";
    for (const block of blocksWithGlobalIndices) {
      for (const w of block.words) {
        if (w.index === activeWordIndex) {
          currentWordStr = w.text;
          break;
        }
      }
    }

    let delay = 220; // default delay per word
    if (currentWordStr.endsWith('.') || currentWordStr.endsWith('!')) {
      delay = 450; // pause at period
    } else if (currentWordStr.endsWith(',')) {
      delay = 350; // pause at comma
    }

    const timer = setTimeout(() => {
      setActiveWordIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [activeWordIndex, totalWords]);

  return (
    <div
      className="hero-page"
      style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BackgroundGrid />

      {/* Confetti canvas (only on You're in view) */}
      {!showSocials && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />
      )}

      {/* Background illustration */}
      <img
        src={showSocials ? hirerSvg : "/hands_chin.svg?v=2"}
        alt=""
        aria-hidden="true"
        className="apply-thinking-bg"
        style={{
          opacity: 0.9,
          zIndex: 1,
          objectPosition: showSocials ? 'bottom center' : 'bottom right', // Adjust position for hirer
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '2rem 3rem',
          maxWidth: '820px',
          width: '100%',
          animation: 'wfSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        }}
      >
        {!showSocials ? (
          <>
            {blocksWithGlobalIndices.map((block, bIdx) => (
              <div
                key={bIdx}
                style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: block.isHeading
                    ? 'clamp(3rem, 7vw, 5.5rem)'
                    : 'clamp(1.15rem, 2.5vw, 1.55rem)',
                  fontWeight: block.isHeading ? 800 : 400,
                  lineHeight: block.isHeading ? 1.15 : 1.6,
                  letterSpacing: block.isHeading ? '-0.04em' : '-0.01em',
                  margin: 0,
                  marginBottom: block.isHeading ? '1.75rem' : '0.4rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: block.isHeading ? '0.6rem' : '0.35rem',
                }}
              >
                {block.words.map(w => {
                  const isCurrent = w.index === activeWordIndex;
                  const isPast = w.index < activeWordIndex;

                  return (
                    <span
                      key={w.index}
                      style={{
                        display: 'inline-block',
                        transition: 'color 0.2s ease',
                        color: isPast || isCurrent ? '#ffffff' : 'rgba(255, 255, 255, 0.32)',
                      }}
                    >
                      {w.text}
                    </span>
                  );
                })}
              </div>
            ))}

            <div
              style={{
                marginTop: '2.5rem',
                opacity: isFinished ? 1 : 0,
                transform: isFinished ? 'translateY(0)' : 'translateY(15px)',
                pointerEvents: isFinished ? 'auto' : 'none',
                transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <button
                className="wf-next-btn"
                onClick={() => setShowSocials(true)}
              >
                Next <ArrowRight02Icon size={18} />
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
               animation: 'wfFadeIn 0.5s ease',
               width: '100%',
               display: 'flex',
               flexDirection: 'column',
               gap: '1.5rem',
            }}
          >
            <h2 style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              margin: 0,
            }}>
              Want the inside gist?
            </h2>
            <p style={{
              fontFamily: 'var(--font-family)',
              fontSize: 'clamp(1.15rem, 2.5vw, 1.55rem)',
              color: 'rgba(255, 255, 255, 0.73)',
              margin: 0,
              lineHeight: 1.6,
            }}>
              Join our WhatsApp community and follow us on Instagram.
            </p>

            {/* Social Links Stacked Vertically */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '450px',
                marginTop: '1.5rem'
              }}
            >
               <a 
                 href="https://chat.whatsapp.com/KkGslKovWBsI1hZOUzunhQ" 
                 className="newsletter-social-cell" 
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ 
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'flex-start',
                   gap: '0.85rem',
                   padding: '1.25rem 1.5rem',
                   borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                   textDecoration: 'none',
                   fontFamily: 'var(--font-family)',
                   fontSize: '1.25rem',
                   fontWeight: 800,
                   color: '#ffffff',
                 }}
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="#93C5FD" aria-hidden="true">
                   <path d="M12 2C12 7.52285 16.4771 12 22 12C16.4771 12 12 16.4771 12 22C12 16.4771 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z" />
                 </svg>
                 <span>WhatsApp Community</span>
               </a>

               <a 
                 href="https://www.instagram.com/jaradeckhq/" 
                 className="newsletter-social-cell" 
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ 
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'flex-start',
                   gap: '0.85rem',
                   padding: '1.25rem 1.5rem',
                   textDecoration: 'none',
                   fontFamily: 'var(--font-family)',
                   fontSize: '1.25rem',
                   fontWeight: 800,
                   color: '#ffffff',
                 }}
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="#F472B6" aria-hidden="true">
                   <path d="M12 2L14.2 8.3L21 9L15.8 13.8L17.5 20.5L12 17L6.5 20.5L8.2 13.8L3 9L9.8 8.3L12 2Z" />
                 </svg>
                 <span>Instagram</span>
               </a>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                className="wf-next-btn"
                onClick={() => navigate('/')}
                style={{
                  padding: '0.8rem 1.6rem',
                  fontSize: '0.95rem',
                  width: 'fit-content',
                }}
              >
                Back to home <ArrowRight02Icon size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

