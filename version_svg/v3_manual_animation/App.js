import React, { useState, useMemo } from 'react';
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
      <style>
        {`
          @keyframes drawLine {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          .node {
            transition: transform 0.3s ease;
          }
          .node:hover {
            transform: scale(1.1);
          }
        `}
      </style>
      {generatePositions.slice(0, -1).map((pos, index) => {
        const nextPos = generatePositions[index + 1];
        const length = Math.sqrt(Math.pow(nextPos.x - pos.x, 2) + Math.pow(nextPos.y - pos.y, 2));
        return (
          <line
            key={index}
            x1={pos.x}
            y1={pos.y}
            x2={nextPos.x}
            y2={nextPos.y}
            stroke="#ccc"
            strokeWidth="2"
            strokeDasharray={length}
            strokeDashoffset={length}
            style={{
              animation: `drawLine 2s ${index * 0.1}s forwards ease-out`
            }}
          />
        );
      })}
      {generatePositions.map(({ key, x, y, color }, index) => (
        <g
          key={key}
          className="node"
          onMouseEnter={() => setHoveredNode(key)}
          onMouseLeave={() => setHoveredNode(null)}
          style={{
            opacity: 0,
            animation: `fadeIn 0.5s ${index * 0.1}s forwards`
          }}
        >
          <circle
            cx={x}
            cy={y}
            r="40"
            fill={color}
          />
          <text x={x} y={y} dy=".3em" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
            {key.slice(0, 3)}
          </text>
          <text
            x={x}
            y={y + 60}
            textAnchor="middle"
            fill="black"
            fontSize="14"
            opacity={hoveredNode === key ? 1 : 0}
            style={{ transition: 'opacity 0.3s ease' }}
          >
            {key}
          </text>
        </g>
      ))}
    </svg>
  );
};

// Example usage
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
