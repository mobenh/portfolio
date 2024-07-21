import React, { useCallback, useEffect, memo } from 'react';
import ReactDOM from 'react-dom';
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
  const { index, totalNodes } = data;
  const positions = ['top', 'bottom', 'left', 'right'];
  const handlePositions = getHandlePositions(index, totalNodes);

  return (
    <div style={{ padding: 10, background: '#fff', border: '1px solid #ddd', transform: 'translateX(-50%)' }}>
      {positions.map((pos) =>
        handlePositions.includes(pos) && (
          <React.Fragment key={pos}>
            <Handle type="source" position={Position[pos.charAt(0).toUpperCase() + pos.slice(1)]} id={`${pos}-source-${index}`} />
            <Handle type="target" position={Position[pos.charAt(0).toUpperCase() + pos.slice(1)]} id={`${pos}-target-${index}`} />
          </React.Fragment>
        )
      )}
      {data.label}
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
  const yScale = 100;
  let y = yScale;

  const nodes = [];
  const edges = [];

  labels.forEach((label, index) => {
    const x = getXPosition(index, totalNodes);
    if ((index + 1) % 3 === 1 && index > 0) {
      y -= yScale;
    }
    const parentNode = {
      id: (index + 1).toString(),
      position: { x, y },
      data: { 
        label: label.charAt(0).toUpperCase() + label.slice(1),
        handlePositions: getHandlePositions(index, totalNodes),
        index: index,
        totalNodes: totalNodes
      },
      type: 'biDirectional'
    };
    nodes.push(parentNode);

    const subNodes = Array.isArray(content[label]) ? content[label] : [];
    subNodes.forEach((subNode, subIndex) => {
      const subNodeId = `${parentNode.id}-${subIndex + 1}`;
      const subNodePosition = { x: x + 150, y: y + 50 * (subIndex + 1)};
      nodes.push({
        id: subNodeId,
        position: subNodePosition,
        data: { label: subNode.name || subNode },
        type: 'simple',
      });
      edges.push({
        id: `e${parentNode.id}-${subNodeId}`,
        source: parentNode.id,
        target: subNodeId,
        type: 'smoothstep',
      });
    });

    y += yScale;
  });

  const unconnectedNodes = content.unconnectedNodes.map((node, index) => ({
    id: `unconnected-${index + 1}`,
    position: node.position,
    data: { label: node.name },
    type: 'simple',
  }));

  return { nodes: [...nodes, ...unconnectedNodes], edges };
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
    const { nodes: initialNodes, edges: initialEdges } = createInitialNodes(content);
    setNodes(initialNodes);
    setEdges([...createInitialEdges(initialNodes), ...initialEdges]);
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
