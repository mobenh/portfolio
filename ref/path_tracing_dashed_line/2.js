import React, { useState, useEffect } from 'react';

const AnimatedNodeGraph = () => {
  const NODE_WIDTH = 80;
  const NODE_HEIGHT = 25;
  const LEAF_CONNECTION_LENGTH = 90;
  const LEAF_WIDTH = 60;
  const LEAF_HEIGHT = 20;
  const node = { id: 'First', x: 150, y: 100 };
  const content = {
    First: ['leaf1', 'leaf2'],
  };

  const [visibleSegments, setVisibleSegments] = useState(0);
  const totalSegments = 100;
  const animationDuration = 10000; // 10 seconds for full animation

  useEffect(() => {
    let start;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newVisibleSegments = Math.min(Math.floor((progress / animationDuration) * totalSegments), totalSegments);
      setVisibleSegments(newVisibleSegments);

      if (progress < animationDuration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const generateLeafNodes = () => {
    const leafCount = content[node.id].length;
    const leafNodes = [];
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI / 2;
    const stemOriginX = node.x + NODE_WIDTH / 2;
    const stemOriginY = node.y;
    const angleStep = (endAngle - startAngle) / (leafCount + 1);
    for (let i = 0; i < leafCount; i++) {
      const angle = startAngle + angleStep * (i + 1);
      const x = stemOriginX + LEAF_CONNECTION_LENGTH * Math.cos(angle);
      const y = stemOriginY + LEAF_CONNECTION_LENGTH * Math.sin(angle);
      leafNodes.push({ id: content[node.id][i], x, y });
    }
    return leafNodes;
  };

  const generateCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const controlX = midX + (end.y - start.y) / 4;
    const controlY = midY - (end.x - start.x) / 4;
    return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
  };

  const generateDashArray = (pathLength) => {
    const segmentLength = pathLength / totalSegments;
    return Array(totalSegments)
      .fill(null)
      .map((_, index) => 
        index < visibleSegments
          ? `${segmentLength},${segmentLength}`
          : `0,${segmentLength * 2}`
      )
      .join(' ');
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg viewBox="0 0 300 200" style={{ width: '100%', maxWidth: '400px' }}>
        {generateLeafNodes().map((leaf) => {
          const pathD = generateCurvedPath(
            { x: node.x + NODE_WIDTH / 2, y: node.y },
            { x: leaf.x, y: leaf.y }
          );
          const pathLength = 400; // Approximate path length
          const dashArray = generateDashArray(pathLength);

          return (
            <React.Fragment key={`leaf-${leaf.id}`}>
              <path
                d={pathD}
                stroke="green"
                strokeWidth="1"
                fill="none"
                strokeDasharray={dashArray}
              />
              <rect
                x={leaf.x - LEAF_WIDTH / 2}
                y={leaf.y - LEAF_HEIGHT / 2}
                width={LEAF_WIDTH}
                height={LEAF_HEIGHT}
                fill="white"
                stroke="green"
                strokeWidth="1"
                rx="5"
                ry="5"
              />
              <text
                x={leaf.x}
                y={leaf.y}
                fontSize="10"
                fill="green"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {leaf.id}
              </text>
            </React.Fragment>
          );
        })}
        <rect
          x={node.x - NODE_WIDTH / 2}
          y={node.y - NODE_HEIGHT / 2}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          fill="white"
          stroke="blue"
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          fontSize="12"
          fill="black"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {node.id}
        </text>
      </svg>
    </div>
  );
};

export default AnimatedNodeGraph;