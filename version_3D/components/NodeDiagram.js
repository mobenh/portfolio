// src/components/NodeDiagram.js

import React, { useState, useRef, useMemo } from 'react';
import { Line, Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const content = {
  First: ['leaf1', 'leaf2'],
  Node1: ['leaf1', 'leaf2', 'leaf3'],
  Node2: ['leaf1'],
  Node3: ['leaf1', 'leaf2'],
  Node4: ['leaf1'],
  Last: ['leaf1', 'leaf2', 'leaf3'],
};

const NodeDiagram = ({ nodes }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const { raycaster, camera, size } = useThree();
  const meshRefs = useRef({});

  const nodesWithRefs = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      ref: meshRefs.current[node.id] || (meshRefs.current[node.id] = React.createRef())
    }));
  }, [nodes]);

  const handlePointerMove = (event) => {
    const x = (event.clientX / size.width) * 2 - 1;
    const y = -(event.clientY / size.height) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const meshes = Object.values(meshRefs.current)
      .map(ref => ref.current)
      .filter(mesh => mesh); // Filter out any undefined refs

    const intersects = raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
      setHoveredNode(intersects[0].object.userData.id);
    } else {
      setHoveredNode(null);
    }
  };

  const renderConnectingLines = () => (
    <>
      {nodesWithRefs.map((node, index, nodesArray) => (
        <React.Fragment key={`line-${node.id}`}>
          {index < nodesWithRefs.length - 1 && (
            <Line
              points={[
                new THREE.Vector3(node.x, node.y, node.z),
                new THREE.Vector3(nodesArray[index + 1].x, nodesArray[index + 1].y, nodesArray[index + 1].z)
              ]}
              color="gray"
              lineWidth={1}
              dashed={false}
            />
          )}
          {content[node.id].map((leaf, leafIndex) => {
            const angle = (Math.PI / (content[node.id].length + 1)) * (leafIndex + 1);
            const leafX = node.x + Math.cos(angle) * 1.5;
            const leafY = node.y + Math.sin(angle) * 1.5;
            return (
              <Line
                key={`leaf-line-${node.id}-${leaf}`}
                points={[
                  new THREE.Vector3(node.x, node.y, node.z),
                  new THREE.Vector3(leafX, leafY, node.z)
                ]}
                color="green"
                lineWidth={1}
                dashed={false}
              />
            );
          })}
        </React.Fragment>
      ))}
    </>
  );

  const renderNodes = () => (
    <>
      {nodesWithRefs.map((node) => {
        const isHovered = hoveredNode === node.id;
        return (
          <React.Fragment key={`node-${node.id}`}>
            <mesh
              ref={node.ref}
              position={[node.x, node.y, node.z]}
              userData={{ id: node.id }}
            >
              <boxGeometry args={[0.5, 0.2, 0.1]} />
              <meshStandardMaterial color={isHovered ? 'red' : 'blue'} />
            </mesh>
            <Text
              position={[node.x, node.y, node.z + 0.1]}
              fontSize={0.15}
              color={isHovered ? 'red' : 'black'}
              anchorX="center"
              anchorY="middle"
            >
              {node.id}
            </Text>
            {content[node.id].map((leaf, leafIndex) => {
              const angle = (Math.PI / (content[node.id].length + 1)) * (leafIndex + 1);
              const leafX = node.x + Math.cos(angle) * 1.5;
              const leafY = node.y + Math.sin(angle) * 1.5;
              return (
                <React.Fragment key={`leaf-${node.id}-${leaf}`}>
                  <mesh position={[leafX, leafY, node.z]}>
                    <boxGeometry args={[0.4, 0.15, 0.05]} />
                    <meshStandardMaterial color="green" />
                  </mesh>
                  <Text
                    position={[leafX, leafY, node.z + 0.05]}
                    fontSize={0.1}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {leaf}
                  </Text>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );

  return (
    <group onPointerMove={handlePointerMove}>
      {renderConnectingLines()}
      {renderNodes()}
    </group>
  );
};

export default NodeDiagram;