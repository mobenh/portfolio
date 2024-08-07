import React, { useState, useEffect, useCallback } from 'react';
import { Leaf } from 'lucide-react';

const content = {
  First: ['leaf1', 'leaf2'],
  Node1: ['leaf1'],
  Node2: ['leaf1'],
  Node3: ['leaf1', 'leaf2'],
  Node4: ['leaf1'],
  Last: ['leaf1', 'leaf2', 'leaf3'],
};

const App = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [nodes, setNodes] = useState([]);
  const TOP_PADDING = 60;
  const VERTICAL_LINE_LENGTH = 60;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateCoordinates = useCallback(() => {
    const INITIAL_Y = TOP_PADDING + VERTICAL_LINE_LENGTH;
    const MID_X = screenWidth / 2;
    const Y_INCREMENT = screenWidth / 8;
    const X_PATTERN = [0.25, 0.75, 1.25, 1.75];

    const nodeIds = Object.keys(content);
    const coordinates = [{ id: nodeIds[0], x: MID_X, y: INITIAL_Y }];
    let currentY = INITIAL_Y;
    let patternIndex = 0;
    let ascending = true;

    for (let i = 1; i < nodeIds.length - 1; i++) {
      let prevX = coordinates[coordinates.length - 1].x;
      let nextX = MID_X * X_PATTERN[patternIndex];

      if ((prevX === MID_X * 0.75 && nextX === MID_X * 1.25) || (prevX === MID_X * 1.25 && nextX === MID_X * 0.75)) {
        // Y doesn't increment in these cases
      } else {
        currentY += Y_INCREMENT;
      }

      coordinates.push({ id: nodeIds[i], x: nextX, y: currentY });

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

    coordinates.push({ id: nodeIds[nodeIds.length - 1], x: MID_X, y: currentY + Y_INCREMENT });

    return coordinates;
  }, [screenWidth]);

  useEffect(() => {
    setNodes(generateCoordinates());
  }, [generateCoordinates]);

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
    const leafCount = content[node.id].length;
    const leafNodes = [];
    const radius = 50;

    if (index === 0) {
      // First node: right side (quad 1 & 4)
      const angleStep = Math.PI / (leafCount + 1);
      for (let i = 0; i < leafCount; i++) {
        const angle = -Math.PI / 2 + angleStep * (i + 1);
        const x = node.x + radius * Math.cos(angle);
        const y = node.y + radius * Math.sin(angle);
        leafNodes.push({ id: content[node.id][i], x, y });
      }
    } else if (index === totalNodes - 1) {
      // Last node: left side (quad 2 & 3)
      const angleStep = Math.PI / (leafCount + 1);
      for (let i = 0; i < leafCount; i++) {
        const angle = Math.PI / 2 + angleStep * (i + 1);
        const x = node.x + radius * Math.cos(angle);
        const y = node.y + radius * Math.sin(angle);
        leafNodes.push({ id: content[node.id][i], x, y });
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
        leafNodes.push({ id: content[node.id][i], x, y });
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
          <text
            x={leaf.x + 10}
            y={leaf.y}
            fontSize="10"
            fill="green"
            dominantBaseline="middle"
          >
            {leaf.id}
          </text>
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  return (
    <div>
      <svg
        viewBox={`0 0 ${screenWidth} ${nodes.length > 0 ? nodes[nodes.length - 1].y + VERTICAL_LINE_LENGTH : 0}`}
      >
        {/* Starting vertical line */}
        {nodes.length > 0 && (
          <line
            x1={nodes[0].x}
            y1={TOP_PADDING}
            x2={nodes[0].x}
            y2={nodes[0].y}
            stroke="gray"
            strokeWidth="1"
          />
        )}

        {nodes.map((node, index) => renderNode(node, index))}

        {/* Ending vertical line */}
        {nodes.length > 0 && (
          <line
            x1={nodes[nodes.length - 1].x}
            y1={nodes[nodes.length - 1].y}
            x2={nodes[nodes.length - 1].x}
            y2={nodes[nodes.length - 1].y + VERTICAL_LINE_LENGTH}
            stroke="gray"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
};

export default App;