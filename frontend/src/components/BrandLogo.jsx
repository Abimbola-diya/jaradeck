export default function BrandLogo({ width = 34, height, tone = 'light', className, ariaHidden = true }) {
  if (tone === 'blue') {
    const logoHeight = height ?? width * (25 / 34);
    return (
      <svg className={className} width={width} height={logoHeight} viewBox="0 0 34 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={ariaHidden}>
        <path d="M3.23453 17.8236H34.0002V24.4431H3.23453V21.1334V17.8236Z" fill="#0048B3"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 17.8236H3.23453L0 16.1194H30.674L34.0002 17.8236Z" fill="#487DCD"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 17.8236V21.1334V24.4431L0 22.4737V16.1194L3.23453 17.8236Z" fill="#2F6BC4"/>
        <path d="M3.23453 9.87086H34.0002V16.4904H3.23453V9.87086Z" fill="#0048B3"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 9.87086H3.23453L0 8.16666H30.674L34.0002 9.87086Z" fill="#487DCD"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 9.87086V16.4904L0 14.5209V8.16666L3.23453 9.87086Z" fill="#2F6BC4"/>
        <path d="M3.23453 1.7042H34.0002V8.3237H3.23453V1.7042Z" fill="#0048B3"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M34.0002 1.7042H3.23453L0 0H30.674L34.0002 1.7042Z" fill="#487DCD"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.23453 1.7042V8.3237L0 6.35427V0L3.23453 1.7042Z" fill="#2F6BC4"/>
      </svg>
    );
  }

  const logoHeight = height ?? width * (310 / 434);
  const face = 'white';
  const top = '#E2E2E2';
  const side = '#EFEFEF';

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
