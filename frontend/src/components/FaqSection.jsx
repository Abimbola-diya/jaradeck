import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from './ArrowIcon';

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
  },
  {
    id: 5,
    question: "What if my project needs different skill-sets?",
    answer: "Absolutely. You don't have to figure out who to hire or in what order. Simply describe what you're trying to achieve, and Jaradeck puts together the right team for the job. Whether you need a writer, designer, video editor or developer, everyone works together around one project, one timeline and one goal, while you focus on the bigger picture."
  },
  {
    id: 6,
    question: "What if I'm not happy with the work?",
    answer: "You don't have to worry—we've got you. If the work isn't up to standard or doesn't meet your expectations, we'll step in, make it right, or assign it to someone better. If we still can't deliver what was promised, you'll get a full refund. Your money is only released when you're happy with the outcome."
  }
];

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

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
                  <div className="faq-question-text-wrapper">
                    {isOpen && (
                      <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="faq-wobbly-line faq-wobbly-top" aria-hidden="true">
                        <path d="M 1,7 L 6,2 L 12,8 L 19,1 L 25,7 L 31,3 L 38,9 L 45,2 L 52,8 L 59,1 L 65,7 L 72,2 L 78,8 L 86,1 L 93,7 L 99,3 L 107,8 L 114,2 L 121,7 L 127,1 L 135,8 L 142,3 L 149,7 L 157,2 L 164,8 L 171,1 L 178,7 L 186,2 L 193,8 L 199,3" stroke="#0048B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )}
                    <h3 className="faq-question-text">{item.question}</h3>
                    {isOpen && (
                      <svg viewBox="0 0 200 10" preserveAspectRatio="none" className="faq-wobbly-line faq-wobbly-bottom" aria-hidden="true">
                        <path d="M 1,3 L 7,8 L 14,2 L 21,9 L 28,3 L 34,7 L 41,1 L 49,8 L 56,2 L 63,9 L 70,3 L 77,8 L 83,2 L 91,8 L 98,2 L 105,9 L 112,3 L 119,7 L 126,2 L 134,9 L 141,3 L 148,8 L 155,2 L 163,8 L 170,3 L 177,9 L 185,2 L 192,8 L 199,4" stroke="#0048B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )}
                  </div>
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

      {/* Bottom CTA Banner */}
      <div className="cta-banner-card">
        <h2 className="cta-banner-title">
          {"You can't keep doing everything yourself."}
        </h2>
        <p className="cta-banner-subtext">
          Let Jaradeck take it from here
        </p>
        <button
          className="cta-banner-btn"
          onClick={() => {
            navigate('/onboarding');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>Use Jaradeck</span>
          <ArrowIcon size={14} strokeWidth={2} className="arrow-icon" />
        </button>
      </div>
    </section>
  );
}
