// components/CompiIcon.tsx
// -----------------------------------------------------------------------------
// A React‑friendly wrapper around iconCompi.svg
// Usage example:
//   <CompiIcon className="w-6 h-6 text-blue-500" />
// -----------------------------------------------------------------------------

const CompiIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 558 558"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_406_24)">
        <circle
          cx="279"
          cy="275"
          r="270"
          fill="#001233"
          stroke="#D9D9D9"
          strokeWidth="10"
        />
        <circle
          cx="279"
          cy="276"
          r="235"
          stroke="#33415C"
          strokeWidth="30"
          strokeLinejoin="round"
          strokeDasharray="8 8"
        />
        <circle
          cx="279"
          cy="276"
          r="227.5"
          stroke="#AF403B"
          strokeWidth="45"
          strokeLinejoin="round"
          strokeDasharray="15 200"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M353.524 200.535L247.165 244.916L279.413 276.413L353.524 200.535Z"
          fill="#DB504A"
        />
        <path
          d="M311.662 307.91L353.524 200.535L279.413 276.413L311.662 307.91Z"
          fill="#DB504A"
        />
        <path
          d="M311.662 307.91L353.524 200.535L279.413 276.413L311.662 307.91Z"
          fill="black"
          fillOpacity="0.2"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M247.165 244.916L205.302 352.292L279.413 276.413L247.165 244.916Z"
          fill="#8BCFF9"
        />
        <path
          d="M311.662 307.91L279.413 276.413L205.302 352.292L311.662 307.91Z"
          fill="#8BCFF9"
        />
        <path
          d="M311.662 307.91L279.413 276.413L205.302 352.292L311.662 307.91Z"
          fill="black"
          fillOpacity="0.2"
        />
  
        {/* Left eye */}
        <g filter="url(#filter1_d_406_24)">
          <circle cx="155" cy="276" r="60" fill="#F5F5F5" />
          <circle cx="155" cy="276" r="30" fill="black" />
          <circle cx="166.5" cy="263.5" r="7.5" fill="#F5F5F5" />
        </g>
  
        {/* Right eye */}
        <g filter="url(#filter2_d_406_24)">
          <circle cx="402" cy="276" r="60" fill="#F5F5F5" />
          <circle cx="402" cy="276" r="30" fill="black" />
          <circle cx="413.5" cy="263.5" r="7.5" fill="#F5F5F5" />
        </g>
  
        {/* Smile */}
        <path
          d="M240.5 373C271.217 387.853 287.174 386.73 314 373"
          stroke="#F5F5F5"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
  
      {/* ----- Filters ----- */}
      <defs>
        <filter
          id="filter0_d_406_24"
          x="0"
          y="0"
          width="558"
          height="558"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_406_24"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_406_24"
            result="shape"
          />
        </filter>
  
        <filter
          id="filter1_d_406_24"
          x="91"
          y="216"
          width="128"
          height="128"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_406_24"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_406_24"
            result="shape"
          />
        </filter>
  
        <filter
          id="filter2_d_406_24"
          x="338"
          y="216"
          width="128"
          height="128"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_406_24"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_406_24"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
  
  export default CompiIcon;
  