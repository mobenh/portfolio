import React, { useState, useEffect } from 'react';

const App = () => {
  const [nodeCount, setNodeCount] = useState(24);
  const [nodes, setNodes] = useState([]);

  const generateCoordinates = (count) => {
    const coordinates = [{ id: 'First', x: 400, y: 30 }];
    const xPattern = [200, 300, 500, 600];
    let currentY = 30;
    let patternIndex = 0;
    let ascending = true;

    for (let i = 1; i < count - 1; i++) {
      let prevX = coordinates[coordinates.length - 1].x;
      let nextX = xPattern[patternIndex];

      if ((prevX === 300 && nextX === 500) || (prevX === 500 && nextX === 300)) {
        // Y doesn't increment in these cases
      } else {
        currentY += 50;
      }

      coordinates.push({ id: `Node ${i}`, x: nextX, y: currentY });

      if (ascending) {
        patternIndex++;
        if (patternIndex >= xPattern.length) {
          patternIndex = xPattern.length - 2;
          ascending = false;
        }
      } else {
        patternIndex--;
        if (patternIndex < 0) {
          patternIndex = 1;
          ascending = true;
        }
      }
    }

    coordinates.push({ id: 'Last', x: 400, y: currentY + 50 });

    return coordinates;
  };

  useEffect(() => {
    setNodes(generateCoordinates(nodeCount));
  }, [nodeCount]);

  const height = Math.max(300, nodes.length > 0 ? nodes[nodes.length - 1].y + 50 : 300);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '1rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="nodeCount" style={{ marginRight: '0.5rem' }}>Number of Nodes:</label>
        <input
          id="nodeCount"
          type="number"
          min="3"
          max="100"
          value={nodeCount}
          onChange={(e) => setNodeCount(Math.max(3, Math.min(100, parseInt(e.target.value) || 3)))}
          style={{ padding: '0.25rem' }}
        />
      </div>
      <div style={{ overflowY: 'auto', flexGrow: 1 }}>
        <div>
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 800 ${height}`}
            style={{ display: 'block', margin: '0 auto' }}
          >
            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="5"
                  fill="blue"
                />
                <text
                  x={node.x + 10}
                  y={node.y}
                  fontSize="12"
                  fill="black"
                  dominantBaseline="middle"
                >
                  {node.id}
                </text>
                {index < nodes.length - 1 && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={nodes[index + 1].x}
                    y2={nodes[index + 1].y}
                    stroke="gray"
                    strokeWidth="1"
                  />
                )}
              </React.Fragment>
            ))}
          </svg>
        </div>
        <div style={{
          borderTop: '1px solid #ccc',
          marginTop: '1rem',
          paddingTop: '0.5rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Node Positions</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {nodes.map((node, index) => (
              <li key={index} style={{ marginBottom: '0.25rem' }}>
                {node.id}: x={node.x.toFixed(2)}, y={node.y.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;