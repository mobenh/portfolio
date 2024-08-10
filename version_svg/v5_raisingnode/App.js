import React, { useState, useMemo } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import './App.css';

const NodeDiagram = ({ content, width = 1200, height = 1000, xMid = 600, yScale = 100 }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeNode, setActiveNode] = useState(null);

  const generatePositions = useMemo(() => {
    const keys = Object.keys(content);
    const positions = [
      { key: keys[0],  x: xMid,        y: 0,            color: 'var(--color-1)' },
      { key: keys[1],  x: xMid - 300,  y: yScale,       color: 'var(--color-2)' },
      { key: keys[2],  x: xMid - 150,  y: yScale * 2,   color: 'var(--color-3)' },
      { key: keys[3],  x: xMid + 150,  y: yScale * 2,   color: 'var(--color-4)' },
      { key: keys[4],  x: xMid + 300,  y: yScale * 3,   color: 'var(--color-5)' },
      { key: keys[5],  x: xMid + 150,  y: yScale * 4,   color: 'var(--color-6)' },
      { key: keys[6],  x: xMid - 150,  y: yScale * 4,   color: 'var(--color-7)' },
      { key: keys[7],  x: xMid - 300,  y: yScale * 5,   color: 'var(--color-8)' },
      { key: keys[8],  x: xMid - 150,  y: yScale * 6,   color: 'var(--color-9)' },
      { key: keys[9],  x: xMid + 150,  y: yScale * 6,   color: 'var(--color-10)' },
      { key: keys[10], x: xMid + 300,  y: yScale * 7,   color: 'var(--color-11)' },
      { key: keys[11], x: xMid,        y: yScale * 8,   color: 'var(--color-12)' },
    ];
    return positions;
  }, [content, xMid, yScale]);

  const handleNodeClick = (key) => setActiveNode(activeNode === key ? null : key);

  const activePosition = activeNode ? generatePositions.find(pos => pos.key === activeNode) : null;

  return (
    <div className={`diagram-container ${darkMode ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </button>
      <svg width={width} height={height}>
        {generatePositions.slice(0, -1).map((pos, index) => (
          <AnimatedLine key={index} start={pos} end={generatePositions[index + 1]} index={index} />
        ))}
        {generatePositions.map(({ key, x, y, color }) => (
          <Node key={key} x={x} y={y} color={color} label={key.slice(0, 3)} onClick={() => handleNodeClick(key)} />
        ))}
      </svg>
      {activePosition && (
        <DetailBox 
          x={activePosition.x} 
          y={activePosition.y} 
          title={activeNode} 
          content={content[activeNode]} 
        />
      )}
    </div>
  );
};

const AnimatedLine = ({ start, end, index }) => {
  const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      className="connector-line"
      style={{
        strokeDasharray: length,
        strokeDashoffset: length,
        animation: `drawLine 2s ${index * 0.1}s forwards ease-out`
      }}
    />
  );
};

const Node = ({ x, y, color, label, onClick }) => (
  <g onClick={onClick} className="node">
    <circle cx={x} cy={y} r="40" fill={color} className="node-circle" />
    <text x={x} y={y} dy=".3em" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
      {label}
    </text>
  </g>
);

const DetailBox = ({ x, y, title, content }) => (
  <div className="node-details" style={{ left: x - 75, top: y + 50 }}>
    <h3>{title}</h3>
    <p>{content.join(', ')}</p>
  </div>
);

const App = () => {
  const content = {
    languages: ['JavaScript', 'Python', 'Ruby'],
    projects: ['Web App', 'Mobile App', 'API'],
    frameworks: ['React', 'Vue', 'Angular'],
    infrastructure: ['AWS', 'GCP', 'Azure'],
    certifications: ['AWS Certified', 'Google Cloud Certified'],
    contact: ['email@example.com', '+1234567890'],
    Add1: ['Custom Item 1'],
    Add2: ['Custom Item 2'],
    Add3: ['Custom Item 3'],
    Add4: ['Custom Item 4'],
    Add5: ['Custom Item 5'],
    Add6: ['Custom Item 6'],
  };

  return (
    <div className="app-container">
      <h1>Node Diagram</h1>
      <NodeDiagram content={content} />
    </div>
  );
};

export default App;
