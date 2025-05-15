const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Filled Circle */}
    <circle cx="12" cy="12" r="10" fill="currentColor" />

    {/* Clock Hands in red with round ends */}
    <line
      x1="12"
      y1="12"
      x2="12"
      y2="7"
      stroke="#042C45"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="12"
      x2="16"
      y2="14"
      stroke="#042C45"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default ClockIcon;
