import React, { useCallback, useEffect, memo } from 'react';
import ReactDOM from 'react-dom';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Background, 
  Controls, 
  MiniMap, 
  Handle, 
  Position 
} from 'reactflow';
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

const SubNode = ({ data }) => (
  <div style={{ padding: 5, background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', margin: '2px 0' }}>
    {data.label}
  </div>
);

const BiDirectionalNode = ({ data }) => {
  const { index, totalNodes } = data;
  const positions = ['top', 'bottom', 'left', 'right'];
  const handlePositions = getHandlePositions(index, totalNodes);

  return (
    <div style={{ padding: 10, background: '#fff', border: '1px solid #ddd', borderRadius: '5px', minWidth: '150px' }}>
      {positions.map((pos) =>
        handlePositions.includes(pos) && (
          <React.Fragment key={pos}>
            <Handle type="source" position={Position[pos.charAt(0).toUpperCase() + pos.slice(1)]} id={`${pos}-source-${index}`} />
            <Handle type="target" position={Position[pos.charAt(0).toUpperCase() + pos.slice(1)]} id={`${pos}-target-${index}`} />
          </React.Fragment>
        )
      )}
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.label}</div>
      {data.subNodes && data.subNodes.map((subNode, subIndex) => (
        <SubNode key={subIndex} data={subNode} />
      ))}
    </div>
  );
};

const MemoizedBiDirectionalNode = memo(BiDirectionalNode);

const SimpleNode = ({ data }) => (
  <div style={{ padding: 10, background: '#fff', border: '1px solid #ddd', transform: 'translateX(-50%)', maxWidth: '250px', wordWrap: 'break-word' }}>
    {data.label}
  </div>
);

const MemoizedSimpleNode = memo(SimpleNode);

const nodeTypes = {
  biDirectional: MemoizedBiDirectionalNode,
  simple: MemoizedSimpleNode,
};

const getXPosition = (index, totalNodes) => {
  const xMid = 500;
  if (index === 0 || index === totalNodes - 1) return xMid;

  const pattern = [xMid / 2, xMid * 3 / 4, xMid * 5 / 4, xMid * 3 / 2];
  const forwardPattern = [...pattern];
  const reversePattern = pattern.slice(1, -1).reverse();
  const fullPattern = [...forwardPattern, ...reversePattern];

  const patternLength = fullPattern.length;
  const posIndex = (index - 1) % patternLength;
  return fullPattern[posIndex];
};

const createInitialNodes = (content) => {
  const labels = Object.keys(content).filter(key => key !== 'unconnectedNodes');
  const totalNodes = labels.length;
  const yScale = 150; // Increased to accommodate subnodes
  let y = yScale;

  const nodes = labels.map((label, index) => {
    const x = getXPosition(index, totalNodes);
    if ((index + 1) % 3 === 1 && index > 0) {
      y -= yScale;
    }
    const node = {
      id: (index + 1).toString(),
      position: { x, y },
      data: { 
        label: label.charAt(0).toUpperCase() + label.slice(1),
        subNodes: content[label].map(item => ({ label: item })),
        handlePositions: getHandlePositions(index, totalNodes),
        index: index,
        totalNodes: totalNodes
      },
      type: 'biDirectional'
    };
    y += yScale;
    return node;
  });

  const unconnectedNodes = content.unconnectedNodes.map((node, index) => ({
    id: `unconnected-${index + 1}`,
    position: node.position,
    data: { label: node.name },
    type: 'simple',
  }));

  return [...nodes, ...unconnectedNodes];
};

const createInitialEdges = (nodes) => {
  const connectedNodes = nodes.filter((node) => node.type === 'biDirectional');
  const totalNodes = connectedNodes.length;
  return connectedNodes.slice(0, -1).map((node, i) => {
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

ReactDOM.render(<App />, document.getElementById('root'));