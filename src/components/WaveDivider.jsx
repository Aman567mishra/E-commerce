import React from "react";

const WaveDivider = () => {
  return (
    <div
      className="w-full overflow-hidden m-0 p-0 leading-none"
      style={{
        lineHeight: 0,
        overflow: "hidden",
        margin: 0,
        padding: 0,
        backgroundColor: "#ffffffff", // Background to blend with theme
      }}
    >
      <svg
        viewBox="0 0 1440 220"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-40"
        style={{
          display: "block",
          width: "100%",
          minHeight: "60px",
          maxHeight: "200px",
        }}
      >
        <defs>
  {/* Gradient based on #03140f - bottom to top */}
  <linearGradient id="themeWaveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
    <stop offset="0%" stopColor="#03140f" />
    <stop offset="50%" stopColor="#062a20" />
    <stop offset="100%" stopColor="#094134" />
  </linearGradient>

  {/* Solid-like gradient for second wave - bottom to top */}
  <linearGradient id="solidThemeWave" x1="0%" y1="100%" x2="0%" y2="0%">
    <stop offset="0%" stopColor="#03140f" />
    <stop offset="100%" stopColor="#062a20" />
  </linearGradient>
</defs>
        {/* Main animated wave */}
        <path fill="url(#themeWaveGradient)">
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,100 C240,40 480,160 720,100 C960,40 1200,160 1440,100 L1440,220 L0,220 Z;
              M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,220 L0,220 Z;
              M0,80 C240,20 480,140 720,80 C960,20 1200,140 1440,80 L1440,220 L0,220 Z;
              M0,110 C240,170 480,50 720,110 C960,170 1200,50 1440,110 L1440,220 L0,220 Z;
              M0,100 C240,40 480,160 720,100 C960,40 1200,160 1440,100 L1440,220 L0,220 Z
            "
          />
        </path>

        {/* Second, subtle wave layer for depth */}
        <path fill="url(#solidThemeWave)" opacity="0.6">
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M0,140 C360,80 720,200 1080,140 C1260,80 1350,200 1440,140 L1440,220 L0,220 Z;
              M0,160 C360,220 720,100 1080,160 C1260,220 1350,100 1440,160 L1440,220 L0,220 Z;
              M0,120 C360,60 720,180 1080,120 C1260,60 1350,180 1440,120 L1440,220 L0,220 Z;
              M0,140 C360,80 720,200 1080,140 C1260,80 1350,200 1440,140 L1440,220 L0,220 Z
            "
          />
        </path>
      </svg>
    </div>
  );
};

export default WaveDivider;
