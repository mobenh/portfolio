import React from 'react';

const NodeGraph = () => {
  const NODE_WIDTH = 80;
  const NODE_HEIGHT = 25;
  const LEAF_CONNECTION_LENGTH = 90;
  const LEAF_WIDTH = 60;
  const LEAF_HEIGHT = 20;
  const node = { id: 'First', x: 150, y: 100 };
  const content = {
    First: ['leaf1', 'leaf2'],
  };

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

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg viewBox="0 0 300 200" style={{ width: '100%', maxWidth: '400px' }}>
        {generateLeafNodes().map((leaf) => (
          <React.Fragment key={`leaf-${leaf.id}`}>
            <path
              d={generateCurvedPath(
                { x: node.x + NODE_WIDTH / 2, y: node.y },
                { x: leaf.x, y: leaf.y }
              )}
              stroke="green"
              strokeWidth="1"
              fill="none"
              strokeDasharray="5,5"
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
        ))}
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

export default NodeGraph;