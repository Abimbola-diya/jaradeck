import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundGrid from '../components/BackgroundGrid';
import ArrowRight02Icon from '../components/ArrowRight02Icon';

// ─── Confetti particle system ────────────────────────────────────────────────
function useConfetti(canvasRef) {
  useEffect(() => {
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
  }, [canvasRef]);
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ApplySuccessPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  useConfetti(canvasRef);

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

      {/* Confetti canvas */}
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

      {/* Background illustration */}
      <img
        src="/hands_chin.svg?v=2"
        alt=""
        aria-hidden="true"
        className="apply-thinking-bg"
        style={{
          opacity: 0.9,
          zIndex: 1,
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

        {/* Back to home — appears after all words highlighted */}
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
            onClick={() => navigate('/')}
          >
            Back to home <ArrowRight02Icon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
