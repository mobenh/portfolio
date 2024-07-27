import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const NodeDiagram = ({ content, width = 1200, height = 1000, xMid = 600, yScale = 100 }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const generatePositions = useMemo(() => {
    const keys = Object.keys(content);
    const positions = [
      { key: keys[0],  x: xMid,        y: 0,            color: '#FF6B6B' }, // Red
      { key: keys[1],  x: xMid - 300,  y: yScale,       color: '#4ECDC4' }, // Teal
      { key: keys[2],  x: xMid - 150,  y: yScale * 2,   color: '#45B7D1' }, // Light Blue
      { key: keys[3],  x: xMid + 150,  y: yScale * 2,   color: '#F9C80E' }, // Yellow
      { key: keys[4],  x: xMid + 300,  y: yScale * 3,   color: '#FF8C42' }, // Orange
      { key: keys[5],  x: xMid + 150,  y: yScale * 4,   color: '#98CE00' }, // Green
      { key: keys[6],  x: xMid - 150,  y: yScale * 4,   color: '#A18BFF' }, // Purple
      { key: keys[7],  x: xMid - 300,  y: yScale * 5,   color: '#FF6B6B' }, // Red
      { key: keys[8],  x: xMid - 150,  y: yScale * 6,   color: '#4ECDC4' }, // Teal
      { key: keys[9],  x: xMid + 150,  y: yScale * 6,   color: '#45B7D1' }, // Light Blue
      { key: keys[10], x: xMid + 300,  y: yScale * 7,   color: '#F9C80E' }, // Yellow
      { key: keys[11], x: xMid,        y: yScale * 8,   color: '#FF8C42' }, // Orange
    ];
    return positions;
  }, [content, xMid, yScale]);

  return (
    <svg width={width} height={height}>
      {generatePositions.slice(0, -1).map((pos, index) => {
        const nextPos = generatePositions[index + 1];
        return (
          <motion.line
            key={index}
            x1={pos.x}
            y1={pos.y}
            x2={nextPos.x}
            y2={nextPos.y}
            stroke="#ccc"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: index * 0.1 }}
          />
        );
      })}
      {generatePositions.map(({ key, x, y, color }, index) => (
        <motion.g
          key={key}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: index * 0.1 }}
          onHoverStart={() => setHoveredNode(key)}
          onHoverEnd={() => setHoveredNode(null)}
        >
          <motion.circle
            cx={x}
            cy={y}
            r="40"
            fill={color}
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          />
          <text x={x} y={y} dy=".3em" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
            {key.slice(0, 3)}
          </text>
          <motion.text
            x={x}
            y={y + 60}
            textAnchor="middle"
            fill="black"
            fontSize="14"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredNode === key ? 1 : 0 }}
          >
            {key}
          </motion.text>
        </motion.g>
      ))}
    </svg>
  );
};

const App = () => {
  const content = {
    languages: [],
    projects: [],
    frameworks: [],
    infrastructure: [],
    certifications: [],
    contact: [],
    Add1: [],
    Add2: [],
    Add3: [],
    Add4: [],
    Add5: [],
    Add6: []
  };

  return (
    <div className="app-container">
      <h1>Fun Node Diagram</h1>
      <NodeDiagram content={content} />
    </div>
  );
};

export default App;