export default function Logo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Anas OS"
    >
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#1B1F26" stroke="#31373F" strokeWidth="1" />
      <path
        d="M10 24 L16 8 L22 24"
        fill="none"
        stroke="#D9B968"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 18.5 L19.5 18.5"
        fill="none"
        stroke="#D9B968"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="8" r="1.7" fill="#4F9A86" />
    </svg>
  );
}