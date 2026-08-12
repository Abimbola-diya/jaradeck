import { useNavigate } from 'react-router-dom';
import BackgroundGrid from '../components/BackgroundGrid';
import BrandLogo from '../components/BrandLogo';
import { useState, useEffect } from 'react';

export default function ApplyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

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

  const handleBack = () => {
    if (step === 3) {
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
        
        {/* Thinking illustration — side accent on steps after the hero (like lekki on the waitlist) */}
        <img
          src="/thinking.svg?v=2"
          alt=""
          aria-hidden="true"
          className="apply-thinking-bg"
          style={{
            opacity: step > 0 ? 0.9 : 0,
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
        </div>

        {/* Step 3: Sub-skills Narrow Down */}
        <div 
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
            <p className="wf-note" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.25rem', marginBottom: '0.2rem', fontWeight: 500 }}>
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
                  <div key={skillId} style={{ width: '100%' }}>
                    <h3 style={{ 
                      fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
                      fontWeight: 700, 
                      color: '#ffffff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.6rem', 
                      marginBottom: '0.35rem' 
                    }}>
                      <span>{data.emoji}</span> {data.title}
                    </h3>
                    <p style={{ 
                      fontSize: '0.98rem', 
                      fontStyle: 'italic', 
                      color: 'rgba(255, 255, 255, 0.65)', 
                      marginBottom: '1.25rem',
                      lineHeight: '1.4'
                    }}>
                      {data.intro}
                    </p>

                    {/* Multi-column grid layout for subskills (3 columns on mobile) */}
                    <div className="wf-subskills-grid">
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
                  </div>
                );
              })}
            </div>

            <button 
              className="wf-next-btn" 
              onClick={() => console.log('Form Submitted!', { formData, selectedSkills, selectedSubSkills })} 
              disabled={selectedSubSkills.length === 0}
              style={{ 
                marginTop: '3rem', 
                marginBottom: '3rem',
                width: 'auto', 
                padding: '1rem 2.5rem', 
                fontSize: '1.1rem',
                opacity: selectedSubSkills.length > 0 ? 1 : 0.35,
                cursor: selectedSubSkills.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.4s ease'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
