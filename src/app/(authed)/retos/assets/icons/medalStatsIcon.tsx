// File: components/MedalStatsIcon.tsx
'use client';
import React from 'react';

interface MedalStatsIconProps {
  size?: number;
  color?: string;
}

const MedalStatsIcon: React.FC<MedalStatsIconProps> = ({ size = 60, color = '#DB504A' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      d="M30 40C39.665 40 47.5 32.165 47.5 22.5C47.5 12.835 39.665 5 30 5C20.335 5 12.5 12.835 12.5 22.5C12.5 32.165 20.335 40 30 40Z"
      fill={color}
    />
    <path
      d="M18.8643 36.0002L18.3778 37.5L16.7856 43.3072C15.2147 49.037 14.4293 51.9017 15.4774 53.47C15.8447 54.0197 16.3375 54.4607 16.9093 54.752C18.5408 55.5827 21.06 54.27 26.0982 51.6447C27.7747 50.7712 28.613 50.3345 29.5035 50.2395C29.8337 50.2045 30.1662 50.2045 30.4965 50.2395C31.387 50.3345 32.2253 50.7712 33.9018 51.6447C38.94 54.27 41.4592 55.5827 43.0907 54.752C43.6625 54.4607 44.1553 54.0197 44.5225 53.47C45.5707 51.9017 44.7853 49.037 43.2145 43.3072L41.6222 37.5L41.1357 36.0002C38.11 38.4987 34.2302 40 30 40C25.7697 40 21.8899 38.4987 18.8643 36.0002Z"
      fill={color}
    />
  </svg>
);

export default MedalStatsIcon;
