export default function ArrowIcon({ direction = 'right', size = 16, strokeWidth = 2.5, className }) {
  const isLeft = direction === 'left';

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {isLeft ? (
        <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>
      ) : (
        <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>
      )}
    </svg>
  );
}
