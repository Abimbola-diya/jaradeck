import React, { useState } from 'react';

const faqData = [
  {
    id: 1,
    question: "What is Jaradeck?",
    answer: "Jaradeck is the easiest and most affordable way for small business owners, solopreneurs and busy professionals get digital work done without the stress of hiring, managing freelancers or paying agency prices. Whether you need content, video editing, design, customer support, product photography or a website, simply tell us what you need and we'll put the right team around it."
  },
  {
    id: 2,
    question: "How is this different from Upwork or Fiverr?",
    answer: "Upwork and Fiverr help you find freelancers. Jaradeck helps you get the work done. We vet every person ourselves, put together a team when your project needs one, and stay involved until the job is done right."
  },
  {
    id: 3,
    question: "Who can use Jaradeck?",
    answer: "If you've ever said, \"I know this needs to be done, I just don't have the time,\" Jaradeck is for you. Whether it's managing your social media, editing videos, designing graphics, building a website or launching a podcast, we help you get the work done without breaking the bank."
  },
  {
    id: 4,
    question: "How much does it cost?",
    answer: "Jaradeck is designed to be affordable. Every project is priced based on the work involved, and because we work with vetted student professionals, you get great work without paying agency prices. You can also negotiate a price that works for you."
  }
];

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section">
      {/* Top Scalloped Blue Canopy Overlay transition */}
      <div className="faq-canopy-top" aria-hidden="true">
        <svg
          viewBox="0 0 1097 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="faq-canopy-svg"
          preserveAspectRatio="none"
        >
          <path
            d="M1000.73 22.075C1004.52 15.7063 1009.3 11.0454 1016.41 8.54816C1044.24 -1.22398 1069.29 -3.79839 1097 7.10029V85H0V45.353C40.6146 43.1655 51.0123 47.5181 90.617 58.5884C132.446 39.7672 181.82 35.5249 225.187 52.0506C228.665 53.3755 243.446 63.3994 245.718 62.7188C257.171 59.2851 268.038 52.0729 280.275 49.7465C291.462 47.5473 301.886 46.9406 313.027 46.8421C356.155 46.3458 398.773 56.1939 437.313 75.5618C451.581 54.1779 497.127 47.5949 520.493 55C523.197 55.8568 526.453 57.1862 529.104 58.2551C538.399 43.8033 554.348 40.0504 570.509 37.5457C599.6 33.0365 628.302 41.1848 655.883 49.6689C661.681 40.7228 670.144 36.0031 679.946 32.2041C707.59 21.5497 738.329 22.3242 765.401 34.3568C798.493 13.8337 842.786 15.8372 874.814 37.5238C886.106 25.2487 910.874 13.9722 926.758 9.05055C946.297 2.99652 983.135 11.5682 1000.73 22.075Z"
            fill="#0048B3"
          />
        </svg>
      </div>

      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Frequently asked questions about Jaradeck</p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
                onClick={() => toggleFaq(item.id)}
              >
                <div className="faq-question-row">
                  <h3 className="faq-question-text">{item.question}</h3>
                  <button
                    className="faq-toggle-btn"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? "Collapse question" : "Expand question"}
                  >
                    <svg
                      className={`faq-icon ${isOpen ? 'faq-icon-active' : ''}`}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
