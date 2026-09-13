import React, { useState } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Tell us what you need done',
    description:
      'Describe the task once — graphic design, web development, writing, video editing — and Jaradeck handles the rest.',
    image: '/how_it_works_1.png',
  },
  {
    number: '02',
    title: 'We match you with the right hands',
    description:
      'Our system finds the best-fit vetted professionals for your job based on skill, speed, and your budget.',
    image: null, // will be added later
  },
  {
    number: '03',
    title: 'Sit back, review, and approve',
    description:
      'Track progress in real time. Review deliverables. Only pay when you\u2019re satisfied with the work.',
    image: null, // will be added later
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="hiw-section">
      <div className="hiw-wrapper">
        {/* Section Title */}
        <div className="hiw-header">
          <h2 className="hiw-title">
            Get started in 3
          </h2>
        </div>

        {/* Active Card */}
        <div className="hiw-card-container">
          <div className={`hiw-card hiw-card--step${activeStep + 1}`}>
            {/* Image Area */}
            <div className="hiw-card-image-area">
              {STEPS[activeStep].image ? (
                <img
                  src={STEPS[activeStep].image}
                  alt={STEPS[activeStep].title}
                  className="hiw-card-img"
                />
              ) : (
                <div className="hiw-card-img-placeholder">
                  <span className="hiw-placeholder-number">{STEPS[activeStep].number}</span>
                </div>
              )}
            </div>

            {/* Step Indicators */}
            <div className="hiw-step-indicators">
              {STEPS.map((step, i) => (
                <button
                  key={i}
                  className={`hiw-step-pill ${i === activeStep ? 'hiw-step-pill--active' : ''}`}
                  onClick={() => setActiveStep(i)}
                  aria-label={`Step ${step.number}`}
                >
                  {step.number}
                </button>
              ))}
              {/* Diamond accent */}
              <span className="hiw-step-diamond" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Step Details Below Card */}
        <div className="hiw-step-details">
          <h3 className="hiw-step-title">{STEPS[activeStep].title}</h3>
          <p className="hiw-step-description">{STEPS[activeStep].description}</p>
        </div>
      </div>
    </section>
  );
}
