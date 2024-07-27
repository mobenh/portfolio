import React, { useCallback, useEffect, memo } from 'react';
import { createRoot } from 'react-dom/client';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, Controls, MiniMap, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import './index.css';
import content from './content.json';

const getHandlePositions = (index, totalNodes) => {
  if (index === 0) return ['left'];
  if (index === totalNodes - 1) return ['right'];

  if (index % 3 === 1) {
    return ['top', 'bottom'];
  } else if (index % 6 === 2 || index % 6 === 3) {
    return ['left', 'right'];
  } else {
    return ['right', 'left'];
  }
};

const BiDirectionalNode = ({ data }) => {
  const { index, totalNodes, label } = data;
  const positions = ['top', 'bottom', 'left', 'right'];
  const handlePositions = getHandlePositions(index, totalNodes);

  return (
    <div style={{ padding: 10, background: '#fff', border: '1px solid #ddd', transform: 'translateX(-50%)' }}>
      {positions
        .filter(pos => handlePositions.includes(pos))
        .map(pos => (
          <React.Fragment key={pos}>
            <Handle 
              type="source" 
              position={Position[pos.charAt(0).toUpperCase() + pos.slice(1)]} 
              id={`${pos}-source-${index}`} 
            />
            <Handle 
              type="target" 
              position={Position[pos.charAt(0).toUpperCase() + pos.slice(1)]} 
              id={`${pos}-target-${index}`} 
            />
          </React.Fragment>
        ))
      }
      {label}
    </div>
  );
};

const MemoizedBiDirectionalNode = memo(BiDirectionalNode);

const SimpleNode = ({ data }) => (
  <div style={{ padding: 10, background: '#fff', border: '1px solid #ddd', transform: 'translateX(-50%)', maxWidth: '250px', wordWrap: 'break-word' }}>
    {!data.unconnected && (
      <>
        <Handle type="source" position={Position.Left} />
        <Handle type="target" position={Position.Left} />
      </>
    )}
    {data.label}
  </div>
);

const MemoizedSimpleNode = memo(SimpleNode);

const nodeTypes = {
  biDirectional: MemoizedBiDirectionalNode,
  simple: MemoizedSimpleNode,
};


const createLeafNode = (mainNode, leafLabel, index, direction) => ({
  id: `${mainNode.id}-${leafLabel}`,
  position: { 
    x: mainNode.position.x + (150 * direction), 
    y: mainNode.position.y + (index * 60) - ((mainNode.data.leafLabels.length - 1) * 30)
  },
  data: { label: leafLabel },
  type: 'simple',
});

const createMainNode = (label, index, totalNodes, x, y, leafLabels) => ({
  id: (index + 1).toString(),
  position: { x, y },
  data: {
    label: label.charAt(0).toUpperCase() + label.slice(1),
    handlePositions: getHandlePositions(index, totalNodes),
    index: index,
    totalNodes: totalNodes,
    leafLabels: leafLabels
  },
  type: 'biDirectional'
});

const createUnconnectedNode = (node, index) => ({
  id: `unconnected-${index + 1}`,
  position: node.position,
  data: { label: node.name },
  type: 'simple',
});

const getNodePosition = (index, totalNodes, xMid, yScale) => {
  const positions = [
    { x: xMid, y: 0 },                // Languages
    { x: xMid - 300, y: yScale },     // Projects
    { x: xMid - 150, y: yScale * 2 }, // Frameworks
    { x: xMid + 150, y: yScale * 2 }, // Infrastructure
    { x: xMid + 300, y: yScale * 3 }, // Certifications
    { x: xMid + 150, y: yScale * 4 }, // Contact
    { x: xMid - 150, y: yScale * 4 }, // Add1
    { x: xMid - 300, y: yScale * 5 }, // Add2
    { x: xMid - 150, y: yScale * 6 }, // Add3
    { x: xMid + 150, y: yScale * 6 }, // Add4
    { x: xMid + 300, y: yScale * 7 }, // Add5
    { x: xMid, y: yScale * 8 }, // Add6
  ];

  // Handle case where there are fewer nodes than positions
  if (index < positions.length) {
    return positions[index];
  }

  // Default position for any additional nodes
  return { x: xMid, y: yScale * (index) };
};



const createInitialNodes = (content) => {
  const { unconnectedNodes, ...connectedContent } = content;
  const labels = Object.keys(connectedContent);
  const totalNodes = labels.length;
  const yScale = 150;
  const xMid = 750;

  const nodes = labels.flatMap((label, index) => {
    const { x, y } = getNodePosition(index, totalNodes, xMid, yScale);
    const leafLabels = connectedContent[label];
    const mainNode = createMainNode(label, index, totalNodes, x, y, leafLabels);
    
    const direction = (x <= xMid) ? 1 : -1;
    const leafNodes = leafLabels.map((leafLabel, idx) => 
      createLeafNode(mainNode, leafLabel, idx, direction)
    );

    return [mainNode, ...leafNodes];
  });

  const unconnectedNodeObjects = unconnectedNodes.map(createUnconnectedNode);

  return [...nodes, ...unconnectedNodeObjects];
};

const createInitialEdges = (nodes) => {
  const connectedNodes = nodes.filter((node) => node.type === 'biDirectional');
  const totalNodes = connectedNodes.length;
  let edges = connectedNodes.slice(0, -1).map((node, i) => {
    const sourceHandle = getHandlePositions(i, totalNodes)[1];
    const targetHandle = getHandlePositions(i + 1, totalNodes)[0];
    return {
      id: `e${node.id}-${connectedNodes[i + 1].id}`,
      source: node.id,
      target: connectedNodes[i + 1].id,
      sourceHandle: `${sourceHandle}-source-${i}`,
      targetHandle: `${targetHandle}-target-${i + 1}`,
      type: 'smoothstep',
    };
  });

  const leafEdges = nodes.filter(node => node.id.includes('-')).map(node => ({
    id: `e${node.id}`,
    source: node.id.split('-')[0],
    target: node.id,
    type: 'straight', // Subnode edges are straight
    className: 'react-flow__edge-dashed' // Add the dashed line class
  }));

  return [...edges, ...leafEdges];
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes = createInitialNodes(content);
    setNodes(initialNodes);
    setEdges(createInitialEdges(initialNodes));
  }, [setNodes, setEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);