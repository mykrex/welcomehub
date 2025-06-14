"use client";

import React from "react";

interface CheckmarkIconProps {
  completed?: boolean;
}

export default function CheckmarkIcon({
  completed = false,
}: CheckmarkIconProps) {
  return (
    <svg
      width="30"
      height="31"
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0"
        y="0"
        width="30"
        height="30"
        rx="5"
        fill={completed ? "#4DAA57" : "none"}
        stroke={completed ? "none" : "#9DAAA6"}
        strokeWidth="2"
      />

      {completed && (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.9934 10.2782L14.4947 21.5374C14.4469 21.6781 14.3766 21.8093 14.2622 21.9125C13.8844 22.2687 13.2909 22.25 12.9375 21.875L8.65125 17.9187C8.29687 17.5437 8.31655 16.9438 8.69436 16.5969C9.07218 16.2407 9.66561 16.2593 10.02 16.6343L13.3744 19.7281L19.3697 9.34068C19.6284 8.90005 20.2013 8.74057 20.6503 9.00307C21.0984 9.2562 21.2522 9.83755 20.9934 10.2782Z"
          fill="#042C45"
        />
      )}
    </svg>
  );
}
