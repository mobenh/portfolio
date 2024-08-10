import React, { useState, useEffect, useCallback } from 'react';

const content = {
  First: [],
  Node1: [],
  Node2: [],
  Node3: [],
  Node4: [],
  Last: [],
};

const App = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [nodes, setNodes] = useState([]);
  const TOP_PADDING = 50;
  const BOTTOM_PADDING = 50;
  const VERTICAL_LINE_LENGTH = 80;
  const NODE_WIDTH = 80;
  const NODE_HEIGHT = 25;

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
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setNodes(generateCoordinates());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
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

  const renderConnectingLines = () => (
    <>
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

      {nodes.map((node, index, nodesArray) => (
        <React.Fragment key={`line-${node.id}`}>
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
    </>
  );

  const renderNodes = () => (
    <>
      {nodes.map((node) => (
        <React.Fragment key={`node-${node.id}`}>
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
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div>
      <svg
        viewBox={`0 0 ${screenWidth} ${nodes.length > 0 ? nodes[nodes.length - 1].y + VERTICAL_LINE_LENGTH + BOTTOM_PADDING : 0}`}
      >
        {renderConnectingLines()}
        {renderNodes()}
      </svg>
    </div>
  );
};

export default App;