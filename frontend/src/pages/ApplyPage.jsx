import { useNavigate } from 'react-router-dom';
import BackgroundGrid from '../components/BackgroundGrid';
import BrandLogo from '../components/BrandLogo';
import { useState, useEffect, useRef } from 'react';

function SubSkillsCategory({ data, selectedSubSkills, toggleSubSkill }) {
  const gridRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const updateScroll = () => {
    if (gridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
      const max = scrollWidth - clientWidth;
      setMaxScroll(max);
      if (max > 0) {
        setScrollProgress(scrollLeft / max);
      } else {
        setScrollProgress(0);
      }
    }
  };

  useEffect(() => {
    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
  }, [data]);

  const scrollByAmount = (direction) => {
    if (gridRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      gridRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{
          fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
          fontWeight: 700,
          color: '#ffffff',
          margin: 0,
          marginBottom: '0.25rem'
        }}>
          {data.title}
        </h3>
        <span className="wf-swipe-hint">
          Swipe right to see more options →
        </span>
      </div>

      {/* Multi-column grid layout */}
      <div
        ref={gridRef}
        onScroll={updateScroll}
        className="wf-subskills-grid no-scrollbar"
      >
        {data.items.map((item) => {
          const isChecked = selectedSubSkills.includes(item);
          return (
            <button
              key={item}
              type="button"
              className="wf-subskill-item"
              onClick={() => toggleSubSkill(item)}
              style={{
                color: isChecked ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
              }}
            >
              <span
                className={`wf-checkbox ${isChecked ? 'wf-checkbox--checked' : ''}`}
                style={{ flexShrink: 0 }}
              >
                {isChecked && '✓'}
              </span>
              <span
                className="wf-subskill-text"
                style={{
                  fontWeight: isChecked ? 600 : 400,
                }}
              >
                {item}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom sliding pill button scrollbar */}
      {maxScroll > 5 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginTop: '0.85rem',
          maxWidth: '580px',
          padding: '0 0.15rem'
        }}>
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            aria-label="Scroll left"
            style={{
              background: 'none',
              border: 'none',
              color: scrollProgress > 0.05 ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
              cursor: scrollProgress > 0.05 ? 'pointer' : 'default',
              padding: '0 0.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
          >
            ◀
          </button>

          {/* Track Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              if (gridRef.current) {
                gridRef.current.scrollTo({
                  left: ratio * maxScroll,
                  behavior: 'smooth'
                });
              }
            }}
            style={{
              flex: 1,
              height: '6px',
              background: 'rgba(255, 255, 255, 0.18)',
              borderRadius: '9999px',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            {/* Sliding Pill Button */}
            <div style={{
              width: '28%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '9999px',
              position: 'absolute',
              top: 0,
              left: `${scrollProgress * 72}%`,
              transition: 'left 0.1s ease-out',
            }} />
          </div>

          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            aria-label="Scroll right"
            style={{
              background: 'none',
              border: 'none',
              color: scrollProgress < 0.95 ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
              cursor: scrollProgress < 0.95 ? 'pointer' : 'default',
              padding: '0 0.25rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}

function VerticalScrollIndicator({ containerRef }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setMaxScroll(max);
      if (max > 10) {
        setScrollProgress(el.scrollTop / max);
      } else {
        setScrollProgress(0);
      }
    };

    handleScroll();
    el.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    const observer = new MutationObserver(handleScroll);
    observer.observe(el, { childList: true, subtree: true, attributes: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
    };
  }, [containerRef]);

  if (maxScroll <= 10) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        right: '12px',
        top: '100px',
        bottom: '40px',
        width: '6px',
        background: 'rgba(255, 255, 255, 0.18)',
        borderRadius: '9999px',
        zIndex: 99,
        pointerEvents: 'none',
      }}
    >
      {/* Sliding White Pill Button */}
      <div 
        style={{
          width: '100%',
          height: '50px',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '9999px',
          position: 'absolute',
          left: 0,
          top: `calc(${scrollProgress * 100}% - ${scrollProgress * 50}px)`,
          transition: 'top 0.1s ease-out',
        }}
      />
    </div>
  );
}

export default function ApplyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    level: '',
    phone: '',
    email: '',
  });

  const [currentQIndex, setCurrentQIndex] = useState(0);

  const [selectedSkills, setSelectedSkills] = useState([]);

  const mainSkills = [
    {
      id: 'content_creation',
      title: 'Content Creation',
      desc: "Pick this if people don't just watch your content, they remember it. Bonus points if someone's paid you to create it."
    },
    {
      id: 'design',
      title: 'Design',
      desc: "Pick this if you've helped brands or businesses look better than they found them. From logos and graphics to UI, UX and CAD."
    },
    {
      id: 'shoots_coverage',
      title: 'Shoots & Coverage',
      desc: "Pick this if you're usually the one behind the camera, capturing moments, products or stories people actually want to watch."
    },
    {
      id: 'editing',
      title: 'Editing',
      desc: "Pick this if you're the person people trust with the final cut. Videos, podcasts, thumbnails or anything that needs polishing."
    },
    {
      id: 'writing',
      title: 'Writing',
      desc: "Pick this if people pay you because words are your thing. Copy, scripts, blogs, captions or anything in between."
    },
    {
      id: 'development',
      title: 'Development',
      desc: "Pick this if building websites, apps or software is second nature to you, and you've actually shipped things people use."
    },
    {
      id: 'marketing',
      title: 'Marketing',
      desc: "Pick this if you've helped people or businesses get more customers, more reach or more attention online."
    },
    {
      id: 'data_ai',
      title: 'Data & AI',
      desc: "Pick this if you're the person people call when numbers stop making sense, or when they want AI to do the heavy lifting."
    },
    {
      id: 'business_support',
      title: 'Business Support',
      desc: "Pick this if you've helped businesses stay organised behind the scenes. Virtual assistance, customer support, project coordination and more."
    }
  ];

  const questions = [
    { id: 'name', placeholder: 'Name', type: 'text' },
    { id: 'university', placeholder: 'University', type: 'text' },
    { id: 'level', placeholder: 'Level (e.g. 100L)', type: 'text' },
    { id: 'phone', placeholder: 'Phone number', type: 'tel' },
    { id: 'email', placeholder: 'Email address', type: 'email' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentVal = formData[questions[currentQIndex].id];
  const isCurrentValid = currentVal.trim() !== '';

  const toggleSkill = (id) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (!isCurrentValid) return;
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep(2);
    }
  };

  const [selectedSubSkills, setSelectedSubSkills] = useState([]);

  const subSkillsData = {
    content_creation: {
      title: "Content Creation",
      emoji: "🎥",
      intro: "Pick this if you're good at creating content people actually stop to watch, read or share.",
      items: [
        "Short-form Video Creator",
        "Long-form Video Creator",
        "UGC Creator",
        "Brand Content Creator",
        "Personal Brand Content Creator",
        "Content Strategist",
        "Personal Brand Content Strategist",
        "Social Content Creator",
        "YouTube Content Creator",
        "Podcast Content Creator",
        "Livestream Content Creator",
        "Content Producer",
        "Creative Director",
        "Content Planning"
      ]
    },
    design: {
      title: "Design",
      emoji: "🎨",
      intro: "Pick this if you make brands, products or ideas look good.",
      items: [
        "Graphic Design",
        "Brand Identity Design",
        "Logo Design",
        "UI Design",
        "UX Design",
        "Product Design",
        "Web Design",
        "Presentation Design",
        "Social Media Design",
        "Flyer Design",
        "Poster Design",
        "Packaging Design",
        "Illustration",
        "Infographic Design",
        "Thumbnail Design",
        "3D Design",
        "3D Modelling",
        "CAD Design",
        "Architectural Design",
        "Interior Design",
        "Print Design"
      ]
    },
    shoots_coverage: {
      title: "Shoots & Coverage",
      emoji: "📸",
      intro: "Pick this if you're the one behind the camera and you know what you're doing with it.",
      items: [
        "Photography",
        "Videography",
        "Event Photography",
        "Event Videography",
        "Product Photography",
        "Product Videography",
        "Portrait Photography",
        "Fashion Photography",
        "Food Photography",
        "Real Estate Photography",
        "Studio Photography",
        "Corporate Photography",
        "Wedding Photography",
        "Wedding Videography",
        "Drone Photography",
        "Drone Videography",
        "Lifestyle Photography",
        "Brand Shoots",
        "Interview Shoots",
        "Documentary Shoots"
      ]
    },
    editing: {
      title: "Editing",
      emoji: "✂️",
      intro: "Pick this if you know how to take raw footage, audio or images and make the final version worth watching.",
      items: [
        "Video Editing",
        "Short-form Video Editing",
        "Long-form Video Editing",
        "YouTube Editing",
        "Podcast Editing",
        "Audio Editing",
        "Photo Editing",
        "Colour Grading",
        "Motion Graphics",
        "Subtitling & Captions",
        "Reels & TikTok Editing",
        "YouTube Shorts Editing",
        "Sound Design",
        "Video Cleanup",
        "Background Removal",
        "Retouching",
        "Visual Effects"
      ]
    },
    writing: {
      title: "Writing",
      emoji: "✍️",
      intro: "Pick this if people pay you because you know what to say and how to say it.",
      items: [
        "Copywriting",
        "Content Writing",
        "Ghostwriting",
        "Scriptwriting",
        "Blog Writing",
        "Article Writing",
        "Social Media Writing",
        "LinkedIn Writing",
        "Newsletter Writing",
        "Email Copywriting",
        "Website Copywriting",
        "Product Description Writing",
        "Technical Writing",
        "Proposal Writing",
        "Grant Writing",
        "Resume & CV Writing",
        "Proofreading",
        "Editing & Rewriting",
        "Transcription"
      ]
    },
    development: {
      title: "Development",
      emoji: "💻",
      intro: "Pick this if building websites, apps or software is your thing.",
      items: [
        "Frontend Development",
        "Backend Development",
        "Full-Stack Development",
        "Web Development",
        "Mobile App Development",
        "Android Development",
        "iOS Development",
        "WordPress Development",
        "Shopify Development",
        "E-commerce Development",
        "No-Code Development",
        "API Development",
        "Database Development",
        "Software Development",
        "SaaS Development",
        "DevOps",
        "Cloud Development",
        "Automation Development",
        "AI Application Development",
        "QA & Software Testing"
      ]
    },
    marketing: {
      title: "Marketing",
      emoji: "📈",
      intro: "Pick this if you know how to get people to notice, trust or buy from a brand.",
      items: [
        "Social Media Management",
        "Community Management",
        "SEO",
        "Paid Advertising",
        "Meta Ads",
        "Google Ads",
        "TikTok Ads",
        "Email Marketing",
        "Influencer Marketing",
        "Affiliate Marketing",
        "Performance Marketing",
        "Content Marketing",
        "Marketing Strategy",
        "Campaign Management",
        "Lead Generation",
        "Brand Strategy",
        "Market Research",
        "Customer Research",
        "Conversion Rate Optimization"
      ]
    },
    data_ai: {
      title: "Data & AI",
      emoji: "📊",
      intro: "Pick this if you work with data, numbers or AI and actually know what you're doing.",
      items: [
        "Data Analysis",
        "Data Cleaning",
        "Data Visualization",
        "Excel & Google Sheets",
        "SQL",
        "Power BI",
        "Tableau",
        "Business Intelligence",
        "Machine Learning",
        "Deep Learning",
        "AI Engineering",
        "AI Automation",
        "AI Integrations",
        "Predictive Modelling",
        "Data Science",
        "Statistical Analysis",
        "Data Collection",
        "Dashboard Building"
      ]
    },
    business_support: {
      title: "Business Support",
      emoji: "⚙️",
      intro: "Pick this if you're the person who keeps things moving when everyone else is busy.",
      items: [
        "Virtual Assistance",
        "Customer Support",
        "Project Management",
        "Operations Support",
        "Administrative Support",
        "Research Assistance",
        "Data Entry",
        "Calendar Management",
        "Email Management",
        "Appointment Setting",
        "CRM Management",
        "Order Management",
        "Community Support",
        "Sales Support",
        "Bookkeeping",
        "Inventory Support",
        "Remote Assistance"
      ]
    }
  };

  const toggleSubSkill = (item) => {
    setSelectedSubSkills(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const [proofLinks, setProofLinks] = useState({});

  const proofPlatforms = [
    { id: 'behance', label: 'Behance', placeholder: 'https://behance.net/lagbaja' },
    { id: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/lagbaja' },
    { id: 'github', label: 'GitHub', placeholder: 'https://github.com/lagbajatamedo' },
    { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/lagbaja' },
    { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@lagbaja' },
    { id: 'portfolio', label: 'Portfolio link', placeholder: 'https://lagbajatamedo.design' },
    { id: 'gdrive', label: 'Google Drive link', placeholder: 'https://drive.google.com/drive/folders/lagbaja' },
  ];

  const toggleProofPlatform = (id) => {
    setProofLinks(prev => {
      const copy = { ...prev };
      if (Object.prototype.hasOwnProperty.call(copy, id)) {
        delete copy[id];
      } else {
        copy[id] = '';
      }
      return copy;
    });
  };

  const updateProofLink = (id, value) => {
    setProofLinks(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleBack = () => {
    if (step === 4) {
      setStep(3);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      if (currentQIndex > 0) {
        setCurrentQIndex((prev) => prev - 1);
      } else {
        setStep(0);
      }
    } else {
      navigate('/');
    }
  };

  // Split text into lines for rendering
  const fullText = "Well, well... 👋\nRumour has it you're good at what you do. We'd like to see for ourselves.";
  const lines = fullText.split('\n');

  return (
    <div className="hero-page" style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <BackgroundGrid />

      {/* Top Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        zIndex: 50,
      }}>
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: "var(--font-family)",
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '0.4rem 0',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
        >
          ← Back
        </button>

        {/* Brand Logo */}
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <BrandLogo width={36} />
        </div>
      </div>

      {/* Container for steps to handle absolute positioning crossfade */}
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>

        {/* Thinking illustration — steps 1 to 3 */}
        <img
          src="/thinking.svg?v=2"
          alt=""
          aria-hidden="true"
          className="apply-thinking-bg"
          style={{
            opacity: step > 0 && step < 4 ? 0.9 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Hands on chin illustration — step 4 */}
        <img
          src="/hands_chin.svg?v=2"
          alt=""
          aria-hidden="true"
          className="apply-thinking-bg"
          style={{
            opacity: step >= 4 ? 0.9 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Step 0: Hero Greeting */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: step === 0 ? 2 : 1,
          opacity: step === 0 ? 1 : 0,
          pointerEvents: step === 0 ? 'auto' : 'none',
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: step === 0 ? 'translateY(0)' : 'translateY(-20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '6rem 2.5rem 3rem',
          gap: '3rem',
        }}
          className="apply-hero-layout"
        >
          {/* Left — Typing text */}
          <div style={{
            flex: '1 1 50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 5,
          }}
            className="apply-text-col"
          >
            {lines.map((line, i) => (
              <h1
                key={i}
                style={{
                  fontFamily: "var(--font-family)",
                  fontWeight: i === 0 ? 800 : 800,
                  fontSize: i === 0 ? 'clamp(3rem, 6vw, 4.5rem)' : 'clamp(1.5rem, 3.5vw, 2.2rem)',
                  lineHeight: i === 0 ? 1.15 : 1.35,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  margin: 0,
                  marginBottom: i === 0 ? '1.5rem' : 0,
                  textAlign: 'left',
                  opacity: 0,
                  animation: `wfSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.15}s forwards`
                }}
              >
                {line}
              </h1>
            ))}

            <div style={{
              marginTop: '2.5rem',
              opacity: 0,
              animation: `wfSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards`
            }}>
              <button
                className="waitlist-reserve-btn"
                onClick={() => setStep(1)}
                style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', width: 'auto' }}
              >
                Let's find out →
              </button>
            </div>
          </div>

          {/* Right — Hirer SVG */}
          <div
            style={{
              flex: '1 1 45%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 3,
            }}
            className="apply-svg-col"
          >
            <img
              src="/hirer.svg"
              alt="Student illustration"
              style={{
                width: '100%',
                maxWidth: '520px',
                height: 'auto',
                objectFit: 'contain',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        </div>

        {/* Step 1: Basics Form */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: step === 1 ? 2 : 1,
          opacity: step === 1 ? 1 : 0,
          pointerEvents: step === 1 ? 'auto' : 'none',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: step === 1 ? 'translateX(0)' : (step < 1 ? 'translateX(0)' : 'translateX(-50px)'),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '6rem 1.5rem 3rem',
        }}>
          <div className="wf-step" style={{ width: '100%', maxWidth: '600px' }}>
            <h2 className="wf-question" style={{
              opacity: step === 1 ? 1 : 0,
              transform: step === 1 ? 'translateY(0)' : (step === 0 ? 'translateY(25px)' : 'translateY(0)'),
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}>
              Let's start with the basics...
            </h2>

            <div style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              paddingBottom: '0.5rem', // for focus ring space
              opacity: step === 1 ? 1 : 0,
              transform: step === 1 ? 'translateY(0)' : (step === 0 ? 'translateY(25px)' : 'translateY(0)'),
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}>
              <div style={{
                display: 'flex',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: `translateX(-${currentQIndex * (100 / questions.length)}%)`,
                width: `${questions.length * 100}%`
              }}>
                {questions.map((q, i) => (
                  <div key={q.id} style={{ width: `${100 / questions.length}%`, paddingRight: '2rem', flexShrink: 0 }}>
                    <input
                      className="wf-input"
                      type={q.type}
                      placeholder={q.placeholder}
                      value={formData[q.id]}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="wf-next-btn"
              onClick={handleNext}
              disabled={!isCurrentValid}
              style={{
                marginTop: '2.5rem',
                width: 'auto',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                opacity: step === 1 ? (isCurrentValid ? 1 : 0.35) : 0,
                cursor: isCurrentValid ? 'pointer' : 'not-allowed',
                transform: step === 1 ? 'translateY(0)' : (step === 0 ? 'translateY(25px)' : 'translateY(0)'),
                transition: 'opacity 0.4s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
              }}
            >
              {currentQIndex === questions.length - 1 ? 'Easy Enough →' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Step 2: Ridiculously Well Form */}
        <div
          ref={step2Ref}
          className="no-scrollbar"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: step === 2 ? 2 : 1,
            opacity: step === 2 ? 1 : 0,
            pointerEvents: step === 2 ? 'auto' : 'none',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: step === 2 ? 'translateX(0)' : (step < 2 ? 'translateX(50px)' : 'translateX(-50px)'),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            padding: '6.5rem 2rem 3rem',
            overflowY: 'auto',
          }}
        >
          <div className="wf-step" style={{ width: '100%', maxWidth: '1050px' }}>
            <h2 className="wf-question">
              What do you do ridiculously<br />well?
            </h2>
            <p className="wf-note" style={{ marginBottom: '2rem' }}>
              (p.s: if you'd hesitate to stake your reputation on it, don't pick it.)
            </p>

            <div className="wf-channels" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              {(selectedSkills.length > 0
                ? mainSkills.filter(s => selectedSkills.includes(s.id))
                : mainSkills
              ).map((skill) => {
                const checked = selectedSkills.includes(skill.id);
                return (
                  <div key={skill.id} className="wf-channel-group">
                    <button
                      className={`wf-channel-btn ${checked ? 'wf-channel-btn--checked' : ''}`}
                      onClick={() => toggleSkill(skill.id)}
                      type="button"
                      aria-pressed={checked}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.8rem',
                        textAlign: 'left',
                        padding: '0.5rem 0',
                        width: '100%',
                        color: checked ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span
                        className={`wf-checkbox ${checked ? 'wf-checkbox--checked' : ''}`}
                        style={{ marginTop: '0.2rem', flexShrink: 0 }}
                      >
                        {checked && '✓'}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <span style={{
                          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                          fontWeight: 700,
                          color: checked ? '#ffffff' : 'rgba(255, 255, 255, 0.55)'
                        }}>
                          {skill.title}
                        </span>
                        {checked && (
                          <span style={{
                            fontSize: '1rem',
                            fontWeight: 400,
                            color: 'rgba(255, 255, 255, 0.75)',
                            lineHeight: '1.45',
                            animation: 'wfSlideIn 0.3s ease forwards'
                          }}>
                            {skill.desc}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              className="wf-next-btn"
              onClick={() => setStep(3)}
              disabled={selectedSkills.length === 0}
              style={{
                marginTop: '2.5rem',
                marginBottom: '2rem',
                width: 'auto',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                opacity: selectedSkills.length > 0 ? 1 : 0.35,
                cursor: selectedSkills.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.4s ease'
              }}
            >
              Next →
            </button>
          </div>
          {step === 2 && <VerticalScrollIndicator containerRef={step2Ref} />}
        </div>

        {/* Step 3: Sub-skills Narrow Down */}
        <div
          ref={step3Ref}
          className="no-scrollbar"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: step === 3 ? 2 : 1,
            opacity: step === 3 ? 1 : 0,
            pointerEvents: step === 3 ? 'auto' : 'none',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: step === 3 ? 'translateX(0)' : 'translateX(50px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            padding: '6.5rem 2rem 3rem',
            overflowY: 'auto',
          }}
        >
          <div className="wf-step" style={{ width: '100%', maxWidth: '1050px' }}>
            <p className="wf-note" style={{ color: 'rgba(255, 255, 255, 0.73)', fontSize: '1.25rem', marginBottom: '0.2rem', fontWeight: 500 }}>
              Alright...
            </p>
            <h2 className="wf-question" style={{ marginBottom: '2.5rem' }}>
              let's narrow it down.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%' }}>
              {selectedSkills.map((skillId) => {
                const data = subSkillsData[skillId];
                if (!data) return null;
                return (
                  <SubSkillsCategory
                    key={skillId}
                    data={data}
                    selectedSubSkills={selectedSubSkills}
                    toggleSubSkill={toggleSubSkill}
                  />
                );
              })}
            </div>

            <button
              className="wf-next-btn"
              onClick={() => setStep(4)}
              disabled={selectedSubSkills.length === 0}
              style={{
                marginTop: '4.5rem',
                marginBottom: '5rem',
                width: 'auto',
                padding: '1.1rem 2.75rem',
                fontSize: '1.1rem',
                opacity: selectedSubSkills.length > 0 ? 1 : 0.35,
                cursor: selectedSubSkills.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.4s ease'
              }}
            >
              Next →
            </button>
          </div>
          {step === 3 && <VerticalScrollIndicator containerRef={step3Ref} />}
        </div>

        {/* Step 4: Show us proof (Links) */}
        <div
          ref={step4Ref}
          className="no-scrollbar"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: step === 4 ? 2 : 1,
            opacity: step === 4 ? 1 : 0,
            pointerEvents: step === 4 ? 'auto' : 'none',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: step === 4 ? 'translateX(0)' : 'translateX(50px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            padding: '6.5rem 2rem 3rem',
            overflowY: 'auto',
          }}
        >
          <div className="wf-step" style={{ width: '100%', maxWidth: '1050px' }}>
            {/* Dynamic intro header */}
            <p className="wf-note" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', marginBottom: '1.25rem', fontWeight: 500, lineHeight: 1.45 }}>
              <strong style={{ color: '#ffffff' }}>{formData.name ? formData.name.trim().split(' ')[0] : 'Ayo'}</strong>, you said you're ridiculously good at <strong style={{ color: '#ffffff' }}>{
                selectedSkills.map(id => subSkillsData[id]?.title || id).join(' & ') || 'Design'
              }</strong>.
            </p>
            <h2 className="wf-question" style={{ marginBottom: '2.5rem', maxWidth: '750px' }}>
              Show us something that makes us believe you.
            </h2>

            {/* Proof platforms list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxWidth: '650px' }}>
              {proofPlatforms.map((platform) => {
                const isChecked = Object.prototype.hasOwnProperty.call(proofLinks, platform.id);
                return (
                  <div key={platform.id} className="wf-channel-group" style={{ width: '100%' }}>
                    <button
                      type="button"
                      className={`wf-channel-btn ${isChecked ? 'wf-channel-btn--checked' : ''}`}
                      onClick={() => toggleProofPlatform(platform.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        textAlign: 'left',
                        padding: '0.5rem 0',
                        width: '100%',
                        color: isChecked ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                        transition: 'all 0.2s ease',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        className={`wf-checkbox ${isChecked ? 'wf-checkbox--checked' : ''}`}
                        style={{ flexShrink: 0 }}
                      >
                        {isChecked && '✓'}
                      </span>
                      <span style={{
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                        fontWeight: 700,
                        color: isChecked ? '#ffffff' : 'rgba(255, 255, 255, 0.55)'
                      }}>
                        {platform.label}
                      </span>
                    </button>

                    {/* Collapsible input field for link */}
                    {isChecked && (
                      <div style={{ marginLeft: '2.3rem', marginTop: '0.2rem', marginBottom: '1.2rem', animation: 'wfSlideIn 0.3s ease forwards' }}>
                        <input
                          type="url"
                          className="wf-underlined-input"
                          placeholder={platform.placeholder}
                          value={proofLinks[platform.id] || ''}
                          onChange={(e) => updateProofLink(platform.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '100%',
                            padding: '0.4rem 0 0.5rem 0',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
                            borderRadius: '0px',
                            color: '#ffffff',
                            fontFamily: 'var(--font-family)',
                            fontSize: '1.15rem',
                            fontWeight: 600,
                            outline: 'none',
                            transition: 'border-bottom-color 0.2s ease',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderBottomColor = '#ffffff';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.4)';
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next / Submit Button */}
            <button
              className="wf-next-btn"
              onClick={() => console.log('Form Submitted!', { formData, selectedSkills, selectedSubSkills, proofLinks })}
              disabled={Object.values(proofLinks).every(v => !v || v.trim() === '')}
              style={{
                marginTop: '4.5rem',
                marginBottom: '5rem',
                width: 'auto',
                padding: '1.1rem 2.75rem',
                fontSize: '1.1rem',
                opacity: Object.values(proofLinks).some(v => v && v.trim() !== '') ? 1 : 0.35,
                cursor: Object.values(proofLinks).some(v => v && v.trim() !== '') ? 'pointer' : 'not-allowed',
                transition: 'all 0.4s ease'
              }}
            >
              Next →
            </button>
          </div>
          {step === 4 && <VerticalScrollIndicator containerRef={step4Ref} />}
        </div>
      </div>
    </div>
  );
}
