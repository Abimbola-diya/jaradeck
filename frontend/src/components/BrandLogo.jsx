export default function BrandLogo({ width = 42, height, tone = 'light', className, ariaHidden = true }) {
  const logoHeight = height ?? width * (310 / 434);
  const isBlue = tone === 'blue';
  const face = isBlue ? '#0048B3' : 'white';
  const top = isBlue ? '#00388D' : '#E2E2E2';
  const side = isBlue ? '#0048B3' : '#EFEFEF';

  return (
    <svg className={className} width={width} height={logoHeight} viewBox="0 0 434 310" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={ariaHidden}>
      <path d="M41.2752 225.44H433.87V309.91H41.2752V225.44Z" fill={face} />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 225.44H41.2752L0 203.693H391.426L433.87 225.44Z" fill={top} />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 225.44V309.91L0 284.779V203.693L41.2752 225.44Z" fill={side} />
      <path d="M41.2752 123.953H433.87V208.423H41.2752V123.953Z" fill={face} />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 123.953H41.2752L0 102.206H391.426L433.87 123.953Z" fill={top} />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 123.953V208.423L0 183.291V102.206L41.2752 123.953Z" fill={side} />
      <path d="M41.2752 21.7469H433.87V106.217H41.2752V21.7469Z" fill={face} />
      <path fillRule="evenodd" clipRule="evenodd" d="M433.87 21.7469H41.2752L0 0H391.426L433.87 21.7469Z" fill={top} />
      <path fillRule="evenodd" clipRule="evenodd" d="M41.2752 21.7469V106.217L0 81.0853V0L41.2752 21.7469Z" fill={side} />
    </svg>
  );
}
