import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const content = {
  First: ['leaf1', 'leaf2'],
  Node1: ['leaf1', 'leaf2', 'leaf3'],
  Node2: ['leaf1'],
  Node3: ['leaf1', 'leaf2'],
  Node4: ['leaf1'],
  Last: ['leaf1', 'leaf2', 'leaf3'],
};

const App = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [nodes, setNodes] = useState([]);
  const [visibleSegments, setVisibleSegments] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const totalSegments = 100;
  const animationDuration = 7000; // 5 seconds for full animation
  const TOP_PADDING = 50;
  const BOTTOM_PADDING = 50;
  const VERTICAL_LINE_LENGTH = 80;
  const NODE_WIDTH = 80;
  const NODE_HEIGHT = 25;
  const LEAF_CONNECTION_LENGTH = 90;
  const LEAF_WIDTH = 60;
  const LEAF_HEIGHT = 20;

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

    // Initial setup
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Animation setup - only runs once when the component mounts
    if (!animationComplete) {
      let start;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const newVisibleSegments = Math.min(Math.floor((progress / animationDuration) * totalSegments), totalSegments);
        setVisibleSegments(newVisibleSegments);

        if (progress < animationDuration) {
          requestAnimationFrame(step);
        } else {
          setAnimationComplete(true);
          setVisibleSegments(totalSegments); // Ensure all segments are visible when animation completes
        }
      };

      requestAnimationFrame(step);
    }

    // Cleanup function
    return () => window.removeEventListener('resize', handleResize);
  }, [generateCoordinates, animationComplete]);

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
  
    let startAngle, endAngle, stemOriginX, stemOriginY;
  
    if (index === 0) {
      // First node: right edge of rectangle
      startAngle = -Math.PI / 2;
      endAngle = Math.PI / 2;
      stemOriginX = node.x + NODE_WIDTH / 2;
      stemOriginY = node.y;
    } else if (index === totalNodes - 1) {
      // Last node: left side (quad 2 & 3)
      startAngle = Math.PI / 2;
      endAngle = 3 * Math.PI / 2;
      stemOriginX = node.x - NODE_WIDTH / 2;
      stemOriginY = node.y;
    } else {
      // Intermediate nodes
      const patternIndex = (index - 1) % 6;
      switch (patternIndex) {
        case 0: // Right (quad 1&4)
          startAngle = -Math.PI / 2;
          endAngle = Math.PI / 2;
          stemOriginX = node.x + NODE_WIDTH / 2;
          stemOriginY = node.y;
          break;
        case 1: // Bottom (quad 3&4)
        case 4: // Bottom (quad 3&4)
          startAngle = 0;
          endAngle = Math.PI;
          stemOriginX = node.x;
          stemOriginY = node.y + NODE_HEIGHT / 2;
          break;
        case 2: // Top (quad 1&2)
        case 5: // Top (quad 1&2)
          startAngle = -Math.PI;
          endAngle = 0;
          stemOriginX = node.x;
          stemOriginY = node.y - NODE_HEIGHT / 2;
          break;
        case 3: // Left (quad 2&3)
          startAngle = Math.PI / 2;
          endAngle = 3 * Math.PI / 2;
          stemOriginX = node.x - NODE_WIDTH / 2;
          stemOriginY = node.y;
          break;
        default: // Default to right side (same as case 0)
          startAngle = -Math.PI / 2;
          endAngle = Math.PI / 2;
          stemOriginX = node.x + NODE_WIDTH / 2;
          stemOriginY = node.y;
          break;
      }
    }
  
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

  const generateDashArray = (pathLength) => {
    const segmentLength = pathLength / totalSegments;
    if (animationComplete) {
      // Return a complete dashed line when animation is finished
      return Array(totalSegments).fill(`${segmentLength},${segmentLength}`).join(' ');
    }
    return Array(totalSegments)
      .fill(null)
      .map((_, index) =>
        index < visibleSegments
          ? `${segmentLength},${segmentLength}`
          : `0,${segmentLength * 2}`
      )
      .join(' ');
  };

  const renderConnectingLines = () => (
    <>
      {/* Starting vertical line */}
      {nodes.length > 0 && (
        <motion.line
          x1={nodes[0].x}
          y1={TOP_PADDING}
          x2={nodes[0].x}
          y2={nodes[0].y}
          stroke="gray"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      )}

      {nodes.map((node, index, nodesArray) => (
        <React.Fragment key={`line-${node.id}`}>
          {index < nodes.length - 1 && (
            <motion.path
              d={generatePatternedOrthogonalPath(node, nodes[index + 1], index, nodes.length)}
              fill="none"
              stroke="gray"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          )}
          {generateLeafNodes(node, index, nodesArray.length).map((leaf) => {
            const patternIndex = (index - 1) % 6;
            let lineStartX = node.x, lineStartY = node.y;

            if (index === 0) {
              lineStartX = node.x + NODE_WIDTH / 2;
            } else if (index === nodesArray.length - 1) {
              lineStartX = node.x - NODE_WIDTH / 2;
            } else {
              switch (patternIndex) {
                case 0: // Right
                  lineStartX = node.x + NODE_WIDTH / 2;
                  break;
                case 1: // Bottom
                case 4: // Bottom
                  lineStartY = node.y + NODE_HEIGHT / 2;
                  break;
                case 2: // Top
                case 5: // Top
                  lineStartY = node.y - NODE_HEIGHT / 2;
                  break;
                case 3: // Left
                  lineStartX = node.x - NODE_WIDTH / 2;
                  break;
                default:
                // No change to lineStartX or lineStartY
              }
            }

            return (
              <path
                key={`leaf-line-${leaf.id}`}
                d={generateCurvedPath(
                  { x: lineStartX, y: lineStartY },
                  { x: leaf.x, y: leaf.y }
                )}
                stroke="green"
                strokeWidth="1"
                fill="none"
                strokeDasharray={generateDashArray(200)} // Approximate path length for leaf connections
              />
            );
          })}
        </React.Fragment>
      ))}

      {/* Ending vertical line */}
      {nodes.length > 0 && (
        <motion.line
          x1={nodes[nodes.length - 1].x}
          y1={nodes[nodes.length - 1].y}
          x2={nodes[nodes.length - 1].x}
          y2={nodes[nodes.length - 1].y + VERTICAL_LINE_LENGTH}
          stroke="gray"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: (nodes.length - 1) * 0.2 }}
        />
      )}
    </>
  );

  const renderNodes = () => (
    <>
      {nodes.map((node, index) => (
        <React.Fragment key={`node-${node.id}`}>
          <motion.rect
            x={node.x - NODE_WIDTH / 2}
            y={node.y - NODE_HEIGHT / 2}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            fill="white"
            stroke="blue"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
          <motion.text
            x={node.x}
            y={node.y}
            fontSize="12"
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.25 }}
          >
            {node.id}
          </motion.text>
          {generateLeafNodes(node, index, nodes.length).map((leaf) => (
            <React.Fragment key={`leaf-${leaf.id}`}>
              <motion.rect
                x={leaf.x - LEAF_WIDTH / 2}
                y={leaf.y - LEAF_HEIGHT / 2}
                width={LEAF_WIDTH}
                height={LEAF_HEIGHT}
                fill="white"
                stroke="green"
                strokeWidth="1"
                rx="5"
                ry="5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              />
              <motion.text
                x={leaf.x}
                y={leaf.y}
                fontSize="10"
                fill="green"
                textAnchor="middle"
                dominantBaseline="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.75 }}
              >
                {leaf.id}
              </motion.text>
            </React.Fragment>
          ))}
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