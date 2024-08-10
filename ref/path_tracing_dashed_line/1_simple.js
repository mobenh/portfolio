import React, { useState, useEffect } from 'react';

const SimpleDashedLineAnimation = () => {
  const [visiblePieces, setVisiblePieces] = useState(0);
  const totalPieces = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisiblePieces(prev => (prev < totalPieces ? prev + 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg width="300" height="50">
      {[...Array(totalPieces)].map((_, index) => (
        <line
          key={index}
          x1={index * 30}
          y1="25"
          x2={(index + 1) * 30}
          y2="25"
          stroke={index < visiblePieces && index % 2 === 0 ? "black" : "transparent"}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
};

export default SimpleDashedLineAnimation;