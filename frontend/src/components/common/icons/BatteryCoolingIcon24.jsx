export default function BatteryCoolingIcon24({
    size = 24,
    color = "#8E8E8E",
    fill = "#3F9727",
    accent = "#2C73D6",
  }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect
          x="2"
          y="6"
          width="17"
          height="12"
          rx="2"
          stroke={color}
          strokeWidth="1.5"
        />
  
        <rect
          x="19.5"
          y="9"
          width="2"
          height="6"
          rx="1"
          fill={color}
        />
  
        {/* Fill */}
        <rect
          x="3.5"
          y="7.5"
          width="11"
          height="9"
          rx="1"
          fill={fill}
        />
  
        <rect
          x="14.5"
          y="7.5"
          width="1.5"
          height="9"
          fill={accent}
        />
  
        <g stroke="white" strokeWidth="1.5" strokeLinecap="round">
          <line x1="10" y1="9" x2="10" y2="15" />
          <line x1="7.5" y1="10.5" x2="12.5" y2="13.5" />
          <line x1="7.5" y1="13.5" x2="12.5" y2="10.5" />
        </g>
      </svg>
    );
  }


