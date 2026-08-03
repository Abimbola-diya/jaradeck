import React from 'react';

export default function RealImpactSection() {
  return (
    <section className="real-impact-section">
      {/* Repeating wavy lines background pattern on white */}
      <div className="real-impact-bg-waves" aria-hidden="true" />

      <div className="real-impact-wrapper">
        {/* Section Header */}
        <div className="real-impact-header">
          <h2 className="real-impact-title">
            Real Impact, Real Stories
          </h2>
          <p className="real-impact-subtitle">
            Real relief for people with ambition who just need the work done.
            <br />
            Zero fluff, zero guesswork
          </p>
        </div>

        {/* Impact Story 1 Container */}
        <div className="impact-story-container">
          {/* Left: Photo Card (Grace) */}
          <div className="impact-photo-card">
            <img
              src="/Impact_image_1.webp"
              alt="Grace - Operations Lead & Creator, Lagos"
              className="impact-photo-img"
            />
            <div className="impact-photo-overlay" />
            <div className="impact-photo-info">
              <h3 className="impact-name">Grace</h3>
              <p className="impact-role">Operations Lead &amp; Creator • Lagos</p>
            </div>
          </div>

          {/* Right: Orange Quote Card */}
          <div className="impact-quote-card">
            <h3 className="impact-quote-title">
              I wanted a personal brand, not a second job in HR.
            </h3>
            <p className="impact-quote-body">
              Between my 9-to-5 and Lagos traffic, I had zero energy to review <strong>50 proposals</strong> or interview strangers online. I described what I needed once on Jaradeck. Now I have an auto-assembled team editing my videos, writing scripts, and running my personal brand. I focus on my career; Jaradeck handles everything growing around it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
