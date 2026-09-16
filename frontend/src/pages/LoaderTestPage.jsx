import React, { useState } from 'react';
import { JaradeckLogo, JaradeckSpinner } from '../components/ui/JaradeckLogo';

export default function LoaderTestPage() {
  const [selectedSize, setSelectedSize] = useState('hero');
  const [simulatedLoading, setSimulatedLoading] = useState(false);
  const [labelText, setLabelText] = useState('Loading your experience...');

  const handleSimulateLoad = () => {
    setSimulatedLoading(true);
    setTimeout(() => {
      setSimulatedLoading(false);
    }, 3500);
  };

  return (
    <div className="worker-dashboard min-h-screen p-6 max-w-xl mx-auto flex flex-col gap-6">
      {/* Test Page Top Header */}
      <header className="db-subpage-header border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-medium text-[#272931]" style={{ fontFamily: 'PP Neue Montreal' }}>
            Jaradeck Loader & Logo Test Route
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Test the deck-shuffle loading animation live at <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">/loader-test</code>
          </p>
        </div>
      </header>

      {/* Main Spinner Demo Box */}
      <section className="bg-[#FCFCFC] border border-gray-200/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 shadow-sm min-h-[220px]">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Live Spinner Preview</span>
        
        <JaradeckSpinner size={selectedSize} label={labelText} />

        <p className="text-xs text-center text-gray-400 max-w-xs mt-1">
          Top two decks slide left → return to center → bottom deck slides right → return to center (infinite loop).
        </p>
      </section>

      {/* Size & Label Controls */}
      <section className="bg-white border border-gray-200/60 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <h2 className="text-sm font-medium text-[#272931]">Loader Controls</h2>

        {/* Size selection buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 min-w-[70px]">Size:</span>
          {['sm', 'md', 'lg', 'hero'].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(sz)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                selectedSize === sz
                  ? 'bg-[#0048B3] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Custom Label Input */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 min-w-[70px]">Label:</span>
          <input
            type="text"
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0048B3]"
            placeholder="Type loading label..."
          />
        </div>

        {/* Full Screen Overlay Simulation Button */}
        <button
          type="button"
          onClick={handleSimulateLoad}
          className="db-btn-primary-blue mt-2"
        >
          Simulate Full Page Load (3.5s)
        </button>
      </section>

      {/* Comparison: Default Logo vs. Spinner */}
      <section className="bg-white border border-gray-200/60 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <h2 className="text-sm font-medium text-[#272931]">Interactive 3D Logo vs. Deck-Shuffle Spinner</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] font-medium text-gray-500 uppercase">3D Interactive Logo</span>
            <JaradeckLogo size="hero" interactive={true} enableFloating={true} enableTilt={true} />
            <span className="text-[10px] text-gray-400 text-center">Hover / Move mouse over logo</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] font-medium text-gray-500 uppercase">Deck-Shuffle Spinner</span>
            <JaradeckLogo size="hero" variant="spinner" />
            <span className="text-[10px] text-gray-400 text-center">Infinite 3D Deck-Shuffle</span>
          </div>
        </div>
      </section>

      {/* Full Page Simulated Loading Overlay */}
      {simulatedLoading && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 animate-fadeIn">
          <JaradeckSpinner size="hero" label="Loading Jaradeck Application..." />
        </div>
      )}
    </div>
  );
}
