// File: components/FlagStatsIcon.tsx
"use client";
import React from "react";

interface FlagStatsIconProps {
  size?: number;
  color?: string;
}

const FlagStatsIcon: React.FC<FlagStatsIconProps> = ({
  size = 60,
  color = "#4DAA57",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.25 4.375C16.25 3.33948 15.4105 2.5 14.375 2.5C13.3395 2.5 12.5 3.33948 12.5 4.375V54.375C12.5 55.4105 13.3395 56.25 14.375 56.25C15.4105 56.25 16.25 55.4105 16.25 54.375V34V9V4.375Z"
      fill={color}
    />
    <path
      d="M33.8955 9.68333L32.8623 9.27003C28.9553 7.7072 24.678 7.3145 20.5517 8.13978L16.25 9.0001V34L20.5517 33.1398C24.678 32.3145 28.9553 32.7073 32.8623 34.27C37.0963 35.9635 41.756 36.2798 46.18 35.1738L46.4302 35.1113C47.8955 34.745 48.5902 33.0673 47.8132 31.7723L43.9117 25.2695C43.058 23.8467 42.631 23.1352 42.5298 22.3614C42.4878 22.0386 42.4878 21.7117 42.5298 21.3888C42.631 20.615 43.058 19.9035 43.9117 18.4806L47.108 13.1534C47.9445 11.7591 46.6778 10.0494 45.1003 10.4438C41.3783 11.3743 37.4578 11.1082 33.8955 9.68333Z"
      fill={color}
    />
  </svg>
);

export default FlagStatsIcon;
