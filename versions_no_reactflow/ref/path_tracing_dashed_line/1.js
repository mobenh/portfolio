import React, { useState, useEffect } from 'react';

const AnimatedPathTracing = () => {
  const [progress, setProgress] = useState(0);
  const totalLength = 300; // Total length of the path
  const animationDuration = 10000; // 10 seconds for full animation
  const numDashes = 50; // Total number of dashes (visible + invisible)

  useEffect(() => {
    const startTime = Date.now();
    
    const animateProgress = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const newProgress = Math.min(elapsedTime / animationDuration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };

    requestAnimationFrame(animateProgress);
  }, []);

  const dashLength = totalLength / numDashes;
  const numVisibleDashes = Math.floor(progress * numDashes);

  const dashArray = Array(numDashes)
    .fill(null)
    .map((_, index) => 
      index < numVisibleDashes
        ? `${dashLength},${dashLength}`
        : `0,${dashLength * 2}`
    )
    .join(' ');

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg viewBox="0 0 300 100" style={{ width: '100%', maxWidth: '400px' }}>
        <path
          d="M 0,50 H 300"
          stroke="green"
          strokeWidth="2"
          fill="none"
          strokeDasharray={dashArray}
        />
      </svg>
    </div>
  );
};

export default AnimatedPathTracing;