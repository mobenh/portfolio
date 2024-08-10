import React, { useState, useEffect } from 'react';

const App = () => {
  const [nodeCount, setNodeCount] = useState(8);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define constants
  const INITIAL_Y = 30;
  const MID_X = screenWidth / 2;
  const Y_INCREMENT = MID_X / 4;
  const X_PATTERN = [MID_X * (1 - .75), MID_X * (1 - .25), MID_X * (1 + .25), MID_X * (1 + .75)];

  const generateCoordinates = (count) => {
    const coordinates = [{ id: 'First', x: MID_X, y: INITIAL_Y }];
    let currentY = INITIAL_Y;
    let patternIndex = 0;
    let ascending = true;

    for (let i = 1; i < count - 1; i++) {
      let prevX = coordinates[coordinates.length - 1].x;
      let nextX = X_PATTERN[patternIndex];

      if ((prevX === MID_X * (1 - .25) && nextX === MID_X * (1 + .25)) || (prevX === MID_X * (1 + .25) && nextX === MID_X * (1 - .25))) {
        // Y doesn't increment in these cases
      } else {
        currentY += Y_INCREMENT;
      }

      coordinates.push({ id: `Node ${i}`, x: nextX, y: currentY });

      if (ascending) {
        patternIndex++;
        if (patternIndex >= X_PATTERN.length) {
          patternIndex = X_PATTERN.length - 2;
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

    coordinates.push({ id: 'Last', x: MID_X, y: currentY + Y_INCREMENT });

    return coordinates;
  };

  const nodes = generateCoordinates(nodeCount);
  const height = nodes.length > 0 ? nodes[nodes.length - 1].y + Y_INCREMENT/3 : 0;

  const generatePatternedOrthogonalPath = (start, end, index, totalNodes) => {
    if (index === 0) {
      // First node always starts horizontal
      return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
    } else if (index === totalNodes - 2) {
      // Last connection
      const patternIndex = (index - 1) % 3;
      if (patternIndex === 1) {
        // If the last node lands at the first horizontal of the two horizontal starts
        return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
      } else {
        // For all other cases, last connection starts vertical
        return `M ${start.x} ${start.y} V ${end.y} H ${end.x}`;
      }
    } else {
      // For intermediate nodes, alternate one vertical start, two horizontal starts
      const patternIndex = (index - 1) % 3;
      if (patternIndex === 0) {
        return `M ${start.x} ${start.y} V ${end.y} H ${end.x}`;
      } else {
        return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
      }
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="nodeCount">Number of Nodes:</label>
        <input
          id="nodeCount"
          type="number"
          min="3"
          max="100"
          value={nodeCount}
          onChange={(e) => setNodeCount(Math.max(3, Math.min(100, parseInt(e.target.value) || 3)))}
        />
      </div>
      <div>
        <svg
          viewBox={`0 0 ${screenWidth} ${height}`}
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
                <path
                  d={generatePatternedOrthogonalPath(node, nodes[index + 1], index, nodes.length)}
                  fill="none"
                  stroke="gray"
                  strokeWidth="1"
                />
              )}
            </React.Fragment>
          ))}
        </svg>
      </div>
      <div>
        <h2>Node Positions</h2>
        <ul>
          {nodes.map((node, index) => (
            <li key={index}>
              {node.id}: x={node.x.toFixed(2)}, y={node.y.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;