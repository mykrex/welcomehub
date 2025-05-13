// components/Badge.tsx
'use client';
import React, { useId } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'gold' | 'red';
}

export default function Badge({ variant }: BadgeProps) {
  // Generate a unique suffix for this instance
  const uid = useId().replace(/:/g, '_');
  const filterId   = `badge-drop-shadow-${uid}`;
  const gradientId = `badge-gradient-${uid}`;
  const clipFId    = `star-clip-front-${uid}`;
  const clipBId    = `star-clip-back-${uid}`;

  // Build the CSS-module class list
  const cls = [styles.icon, variant ? styles[variant] : ''].join(' ');

  return (
    <svg
      className={cls}
      width="50"
      height="52"
      viewBox="0 0 50 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id={filterId}
          x="2.5"
          y="0.576172"
          width="45"
          height="51"
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
          <feOffset dy="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0201802 0 0 0 0 0.16 0 0 0 0 0.29982 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>

        <linearGradient
          id={gradientId}
          x1="25"
          y1="51"
          x2="25"
          y2="1"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--badge-primary, #0078F0)" />
          <stop offset="100%" stopColor="var(--badge-secondary, #CFE3F7)" />
        </linearGradient>

        <clipPath id={clipFId}>
          <path d="M24.4959 20.8834C24.7071 20.4737 25.2929 20.4737 25.5041 20.8834L26.8456 23.4863C26.8997 23.5911 26.985 23.6765 27.0899 23.7305L29.6927 25.0721C30.1024 25.2833 30.1024 25.8691 29.6927 26.0802L27.0899 27.4218C26.985 27.4758 26.8997 27.5612 26.8456 27.666L25.5041 30.2689C25.2929 30.6786 24.7071 30.6786 24.4959 30.2689L23.1544 27.666C23.1003 27.5612 23.015 27.4758 22.9101 27.4218L20.3073 26.0802C19.8976 25.8691 19.8976 25.2833 20.3073 25.0721L22.9101 23.7305C23.015 23.6765 23.1003 23.5911 23.1544 23.4863L24.4959 20.8834Z" />
        </clipPath>

        <clipPath id={clipBId}>
          <path d="M24.4959 20.8834C24.7071 20.4737 25.2929 20.4737 25.5041 20.8834L26.8456 23.4863C26.8997 23.5911 26.985 23.6765 27.0899 23.7305L29.6927 25.0721C30.1024 25.2833 30.1024 25.8691 29.6927 26.0802L27.0899 27.4218C26.985 27.4758 26.8997 27.5612 26.8456 27.666L25.5041 30.2689C25.2929 30.6786 24.7071 30.6786 24.4959 30.2689L23.1544 27.666C23.1003 27.5612 23.015 27.4758 22.9101 27.4218L20.3073 26.0802C19.8976 25.8691 19.8976 25.2833 20.3073 25.0721L22.9101 23.7305C23.015 23.6765 23.1003 23.5911 23.1544 23.4863L24.4959 20.8834Z" />
        </clipPath>
      </defs>

      {/* Main badge shape */}
      <g filter={`url(#${filterId})`}>
        <path
          d="M29.3301 49.399C26.6506 50.9686 23.3494 50.9686 20.6699 49.399L6.83013 41.2922C4.15064 39.7227 2.5 36.822 2.5 33.683V17.4694C2.5 14.3303 4.15063 11.4297 6.83013 9.86012L20.6699 1.75333C23.3494 0.183786 26.6506 0.183786 29.3301 1.75333L43.1699 9.86012C45.8494 11.4297 47.5 14.3303 47.5 17.4694V33.683C47.5 36.822 45.8494 39.7227 43.1699 41.2922L29.3301 49.399Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M21.1758 2.61621C23.4692 1.27299 26.2762 1.23074 28.6016 2.49023L28.8242 2.61621L42.6641 10.7227C45.0331 12.1104 46.5 14.6809 46.5 17.4697V33.6826C46.5 36.3843 45.1237 38.8809 42.8838 40.2959L42.6641 40.4297L28.8242 48.5361C26.5308 49.8794 23.7238 49.9216 21.3984 48.6621L21.1758 48.5361L7.33594 40.4297C4.96688 39.042 3.5 36.4715 3.5 33.6826V17.4697C3.5 14.768 4.87631 12.2714 7.11621 10.8564L7.33594 10.7227L21.1758 2.61621Z"
          stroke="var(--badge-stroke, rgba(255,255,255,0.4))"
          strokeWidth="2"
        />
      </g>

      {/* Front star overlay */}
      <g clipPath={`url(#${clipFId})`}>
        <g transform="translate(25 25.5762) scale(0.005)">
          <foreignObject x="-1200" y="-1200" width="2400" height="2400">
            {/* No xmlns attribute here */}
            <div className={styles.conic} />
          </foreignObject>
        </g>
      </g>

      {/* Back star overlay */}
      <g clipPath={`url(#${clipBId})`}>
        <g transform="translate(25 25.5762) scale(-0.005 0.005)">
          <foreignObject x="-1200" y="-1200" width="2400" height="2400">
            <div className={`${styles.conic} ${styles.secondary}`} />
          </foreignObject>
        </g>
      </g>
    </svg>
  );
}
