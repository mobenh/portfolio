import React, { useCallback, useEffect, memo } from 'react';
import ReactDOM from 'react-dom';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Background, Controls, MiniMap, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import './index.css';
import content from './content.json';

const handlePatterns = [
  ['top', 'left'],
  ['top', 'bottom'],
  ['left', 'right'],
  ['left', 'right'],
  ['top', 'bottom'],
  ['right', 'bottom']
];

const BiDirectionalNode = ({ data }) => {
  return (
    <div style={{ padding: 10, background: '#fff', border: '1px solid #ddd' }}>
      {data.handlePositions.includes('top') && (
        <Handle type="source" position={Position.Top} id="top-source" />
      )}
      {data.handlePositions.includes('top') && (
        <Handle type="target" position={Position.Top} id="top-target" />
      )}
      {data.handlePositions.includes('bottom') && (
        <Handle type="source" position={Position.Bottom} id="bottom-source" />
      )}
      {data.handlePositions.includes('bottom') && (
        <Handle type="target" position={Position.Bottom} id="bottom-target" />
      )}
      {data.handlePositions.includes('left') && (
        <Handle type="source" position={Position.Left} id="left-source" />
      )}
      {data.handlePositions.includes('left') && (
        <Handle type="target" position={Position.Left} id="left-target" />
      )}
      {data.handlePositions.includes('right') && (
        <Handle type="source" position={Position.Right} id="right-source" />
      )}
      {data.handlePositions.includes('right') && (
        <Handle type="target" position={Position.Right} id="right-target" />
      )}
      {data?.label}
    </div>
  );
};

const MemoizedBiDirectionalNode = memo(BiDirectionalNode);

const nodeTypes = {
  biDirectional: MemoizedBiDirectionalNode,
};

const createInitialNodes = (content) => {
  const topics = Object.keys(content);
  return topics.map((topic, index) => {
    const handlePattern = handlePatterns[index % handlePatterns.length];
    return {
      id: (index + 1).toString(),
      position: { x: 100 * (index + 1), y: 100 },
      data: { label: topic, handlePositions: handlePattern },
      type: 'biDirectional',
    };
  });
};

const createInitialEdges = (nodes) => {
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceHandle = `${handlePatterns[i % handlePatterns.length][1]}-source`;
    const targetHandle = `${handlePatterns[(i + 1) % handlePatterns.length][0]}-target`;
    edges.push({
      id: `e${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      sourceHandle,
      targetHandle,
      type: 'smoothstep',
    });
  }
  return edges;
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes = createInitialNodes(content);
    setNodes(initialNodes);

    const initialEdges = createInitialEdges(initialNodes);
    setEdges(initialEdges);
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

ReactDOM.render(<App />, document.getElementById('root'));
