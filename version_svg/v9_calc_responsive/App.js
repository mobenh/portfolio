import React, { useState, useEffect, useCallback } from 'react';
import { Leaf } from 'lucide-react';

const App = () => {
  const [nodeCount, setNodeCount] = useState(8);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateCoordinates = useCallback((count) => {
    const INITIAL_Y = 30;
    const MID_X = screenWidth / 2;
    const Y_INCREMENT = screenWidth / 8;
    const X_PATTERN = [0.25, 0.75, 1.25, 1.75];

    const coordinates = [{ id: 'First', x: MID_X, y: INITIAL_Y }];
    let currentY = INITIAL_Y;
    let patternIndex = 0;
    let ascending = true;

    for (let i = 1; i < count - 1; i++) {
      let prevX = coordinates[coordinates.length - 1].x;
      let nextX = MID_X * X_PATTERN[patternIndex];

      if ((prevX === MID_X * 0.75 && nextX === MID_X * 1.25) || (prevX === MID_X * 1.25 && nextX === MID_X * 0.75)) {
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
  }, [screenWidth]);

  useEffect(() => {
    setNodes(generateCoordinates(nodeCount));
  }, [nodeCount, generateCoordinates]);

  const generatePatternedOrthogonalPath = (start, end, index, totalNodes) => {
    if (index === 0) {
      return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
    } else if (index === totalNodes - 2) {
      const patternIndex = (index - 1) % 3;
      if (patternIndex === 1) {
        return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
      } else {
        return `M ${start.x} ${start.y} V ${end.y} H ${end.x}`;
      }
    } else {
      const patternIndex = (index - 1) % 3;
      if (patternIndex === 0) {
        return `M ${start.x} ${start.y} V ${end.y} H ${end.x}`;
      } else {
        return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
      }
    }
  };

  const generateLeafNodes = (node, index, totalNodes) => {
    const leafCount = Math.floor(Math.random() * 3) + 1;
    const leafNodes = [];
    const radius = 50;

    if (index === 0) {
      // First node: bottom right quadrant (quad 4)
      const angleStep = (Math.PI / 2) / (leafCount + 1);
      for (let i = 0; i < leafCount; i++) {
        const angle = angleStep * (i + 1);
        const x = node.x + radius * Math.cos(angle);
        const y = node.y + radius * Math.sin(angle);
        leafNodes.push({ id: `${node.id}-Leaf-${i + 1}`, x, y });
      }
    } else if (index === totalNodes - 1) {
      // Last node: bottom left quadrant (quad 3)
      const angleStep = (Math.PI / 2) / (leafCount + 1);
      for (let i = 0; i < leafCount; i++) {
        const angle = Math.PI / 2 + angleStep * (i + 1);
        const x = node.x + radius * Math.cos(angle);
        const y = node.y + radius * Math.sin(angle);
        leafNodes.push({ id: `${node.id}-Leaf-${i + 1}`, x, y });
      }
    } else {
      // Intermediate nodes
      const patternIndex = (index - 1) % 6;
      let startAngle, endAngle;

      switch (patternIndex) {
        case 0: // Right (quad 1&4)
          startAngle = -Math.PI / 2;
          endAngle = Math.PI / 2;
          break;
        case 1: // Bottom (quad 3&4)
          startAngle = 0;
          endAngle = Math.PI;
          break;
        case 2: // Top (quad 1&2)
          startAngle = -Math.PI;
          endAngle = 0;
          break;
        case 3: // Left (quad 2&3)
          startAngle = Math.PI / 2;
          endAngle = 3 * Math.PI / 2;
          break;
        case 4: // Bottom (quad 3&4)
          startAngle = 0;
          endAngle = Math.PI;
          break;
        case 5: // Top (quad 1&2)
          startAngle = -Math.PI;
          endAngle = 0;
          break;
        default:
          startAngle = 0;
          endAngle = 2 * Math.PI;
      }

      const angleStep = (endAngle - startAngle) / (leafCount + 1);
      for (let i = 0; i < leafCount; i++) {
        const angle = startAngle + angleStep * (i + 1);
        const x = node.x + radius * Math.cos(angle);
        const y = node.y + radius * Math.sin(angle);
        leafNodes.push({ id: `${node.id}-Leaf-${i + 1}`, x, y });
      }
    }

    return leafNodes;
  };

  const renderNode = (node, index) => (
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
      {generateLeafNodes(node, index, nodes.length).map((leaf) => (
        <React.Fragment key={leaf.id}>
          <line
            x1={node.x}
            y1={node.y}
            x2={leaf.x}
            y2={leaf.y}
            stroke="green"
            strokeWidth="1"
          />
          <Leaf
            x={leaf.x - 12}
            y={leaf.y - 12}
            size={24}
            color="green"
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  return (
    <div >
      <div >
        <label htmlFor="nodeCount" >Number of Nodes:</label>
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
          viewBox={`0 0 ${screenWidth} ${nodes.length > 0 ? nodes[nodes.length - 1].y + 60 : 0}`}
        >
          {nodes.map((node, index) => renderNode(node, index))}
        </svg>
      </div>
      <div >
        <h2>Node Positions</h2>
        <ul>
          {nodes.map((node, index) => (
            <li key={index} >
              {node.id}: x={node.x.toFixed(2)}, y={node.y.toFixed(2)}
              <ul >
                {generateLeafNodes(node, index, nodes.length).map((leaf, leafIndex) => (
                  <li key={leafIndex}>
                    {leaf.id}: x={leaf.x.toFixed(2)}, y={leaf.y.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;