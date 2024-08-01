import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

const App = () => {
  const [nodeCount, setNodeCount] = useState(8);
  const [nodes, setNodes] = useState([]);

  // Define constants
  const SCREEN_WIDTH = 800;
  const INITIAL_Y = 30;
  const MID_X = SCREEN_WIDTH / 2;
  const Y_INCREMENT = MID_X / 4;
  const X_PATTERN = [MID_X * (1 - .75), MID_X * (1 - .25), MID_X * (1 + .25), MID_X * (1 + .75)];

  useEffect(() => {
    setNodes(generateCoordinates(nodeCount));
  }, [nodeCount]);

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
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="nodeCount" className="mr-2">Number of Nodes:</label>
        <input
          id="nodeCount"
          type="number"
          min="3"
          max="100"
          value={nodeCount}
          onChange={(e) => setNodeCount(Math.max(3, Math.min(100, parseInt(e.target.value) || 3)))}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="border border-gray-300 rounded">
        <svg
          viewBox={`0 0 ${SCREEN_WIDTH} ${nodes.length > 0 ? nodes[nodes.length - 1].y + 60 : 0}`}
          className="w-full h-auto"
        >
          {nodes.map((node, index) => renderNode(node, index))}
        </svg>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Node Positions</h2>
        <ul className="list-disc pl-5">
          {nodes.map((node, index) => (
            <li key={index} className="mb-2">
              {node.id}: x={node.x.toFixed(2)}, y={node.y.toFixed(2)}
              <ul className="list-circle pl-5 mt-1">
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