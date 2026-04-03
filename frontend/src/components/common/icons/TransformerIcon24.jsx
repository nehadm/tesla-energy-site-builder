import React from "react";

export default function TransformerIcon24({
  size = 24,
  stroke = "#222222",
  accent = "#6AC16A",
  strokeWidth = 1.7,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="7"
        width="20"
        height="1.8"
        rx="0.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <rect
        x="4"
        y="8.8"
        width="16"
        height="10.2"
        rx="0.6"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <rect
        x="2"
        y="19"
        width="20"
        height="1.8"
        rx="0.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <rect
        x="6.1"
        y="20.8"
        width="2.8"
        height="1.2"
        rx="0.2"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <rect
        x="15.1"
        y="20.8"
        width="2.8"
        height="1.2"
        rx="0.2"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      {[6, 12, 18].map((cx) => (
        <g key={cx}>
          <rect
            x={cx - 1}
            y="4.8"
            width="2"
            height="2.2"
            rx="0.4"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <rect
            x={cx - 0.7}
            y="2.8"
            width="1.4"
            height="2"
            rx="0.3"
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
          <rect
            x={cx - 0.4}
            y="1.5"
            width="0.8"
            height="1.1"
            rx="0.15"
            fill={stroke}
          />
        </g>
      ))}

      <path
        d="M12.5 11L10.7 14H12.6L11.5 16.9L14.2 13.5H12.4L13.4 11H12.5Z"
        stroke={accent}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}