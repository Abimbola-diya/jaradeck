import React from 'react';


export default function FeatureCards() {
  return (
    <section className="feature-cards-section">
      {/* Top Scalloped Blue Canopy SVG transition overlapping white section above */}
      <div className="feature-canopy-top" aria-hidden="true">
        <svg
          viewBox="0 0 1097 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="feature-canopy-svg"
          preserveAspectRatio="none"
        >
          <path
            d="M1000.73 22.075C1004.52 15.7063 1009.3 11.0454 1016.41 8.54816C1044.24 -1.22398 1069.29 -3.79839 1097 7.10029V85H0V45.353C40.6146 43.1655 51.0123 47.5181 90.617 58.5884C132.446 39.7672 181.82 35.5249 225.187 52.0506C228.665 53.3755 243.446 63.3994 245.718 62.7188C257.171 59.2851 268.038 52.0729 280.275 49.7465C291.462 47.5473 301.886 46.9406 313.027 46.8421C356.155 46.3458 398.773 56.1939 437.313 75.5618C451.581 54.1779 497.127 47.5949 520.493 55C523.197 55.8568 526.453 57.1862 529.104 58.2551C538.399 43.8033 554.348 40.0504 570.509 37.5457C599.6 33.0365 628.302 41.1848 655.883 49.6689C661.681 40.7228 670.144 36.0031 679.946 32.2041C707.59 21.5497 738.329 22.3242 765.401 34.3568C798.493 13.8337 842.786 15.8372 874.814 37.5238C886.106 25.2487 910.874 13.9722 926.758 9.05055C946.297 2.99652 983.135 11.5682 1000.73 22.075Z"
            fill="#0048B3"
          />
        </svg>
      </div>

      <div className="feature-cards-wrapper">
        {/* Section Header Intro */}
        <div className="feature-section-header">
          <h2 className="feature-section-title">
            How we remove work<br />from your day.
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="feature-cards-container">
          {/* Card 1: Find the right person in 60 seconds (Office SVG Card) */}
          <div className="feature-card feature-card-cream">
            {/* Top category icon */}
            <div className="feature-card-icon" style={{ marginBottom: '2.5rem' }}>
              <img 
                src="/join_hands.svg" 
                alt="Feature category icon" 
                className="feature-badge-img"
                style={{ height: '68px', width: 'auto', maxWidth: '120px', objectFit: 'contain', display: 'block' }} 
              />
            </div>

            {/* Title & Copy */}
            <div className="feature-card-text">
              <h3 className="feature-card-title">
                Find the right person in 60 seconds
              </h3>
              <p className="feature-card-copy">
                Describe the work once. JaraDeck finds you the best three options based on your budget, goals, and the outcome you want.
              </p>
            </div>

            {/* Fitted Illustration Container */}
            <div className="feature-card-illustration">
              <img 
                src="/office.svg" 
                alt="Office workspace illustration" 
                className="feature-card-svg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
