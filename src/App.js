import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const content = {
  First: ['leaf1', 'leaf2', 'leaf3'],
  Node1: ['leaf1'],
  Node2: ['leaf1', 'leaf2', 'leaf3'],
  Node3: ['leaf1'],
  Node4: ['leaf1'],
  // Node5: ['leaf1'],
  // Node6: ['leaf1'],
  // Node7: ['leaf1'],
  // Node8: ['leaf1'],
  // Node9: ['leaf1'],
  // Node10: ['leaf1'],
  Last: ['leaf1'],
};

// Component for car animation
const CarAnimation = ({ pathPoints, scrollProgress, onNodeReached }) => {
  const carRef = useRef();
  const { scene } = useGLTF('/truck.glb');
  const previousPosition = useRef(new THREE.Vector3());
  const elevationOffset = new THREE.Vector3(0, 0.2, 0);

  useFrame(() => {
    if (carRef.current && pathPoints.length > 1) {
      const totalDistance = calculateTotalDistance(pathPoints);
      const currentDistance = scrollProgress * totalDistance;
      const point = getPointAtDistance(pathPoints, currentDistance);

      const elevatedPoint = point.clone().add(elevationOffset);
      carRef.current.position.copy(elevatedPoint);

      const movement = new THREE.Vector3().subVectors(point, previousPosition.current);

      if (movement.length() > 0.001) {
        const lookAtPoint = new THREE.Vector3().addVectors(elevatedPoint, movement);
        carRef.current.lookAt(lookAtPoint);
        carRef.current.rotateY(1.25);
      }

      previousPosition.current.copy(point);

      // Check if the truck is near a node and trigger the callback
      onNodeReached(point);
    }
  });

  return <primitive object={scene} ref={carRef} scale={[3, 3, 3]} />;
};

const AxisHelper = () => {
  return (
    <group>
      {/* X-axis (red) */}
      <Line points={[[-1, 0, 0], [1, 0, 0]]} color="red" />
      <Text position={[1.5, 0, 0]} fontSize={0.5} color="red">
        X
      </Text>

      {/* Y-axis (green) */}
      <Line points={[[0, -1, 0], [0, 1, 0]]} color="green" />
      <Text position={[0, 1.5, 0]} fontSize={0.5} color="green">
        Y
      </Text>

      {/* Z-axis (blue) */}
      <Line points={[[0, 0, -1], [0, 0, 1]]} color="blue" />
      <Text position={[0, 0, 1.5]} fontSize={0.5} color="blue">
        Z
      </Text>
    </group>
  );
};


// Helper function to calculate total path distance
const calculateTotalDistance = (points) => {
  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += points[i].distanceTo(points[i - 1]);
  }
  return totalDistance;
};

// Helper function to get point at a specific distance along the path
const getPointAtDistance = (points, distance) => {
  let accumulatedDistance = 0;
  for (let i = 1; i < points.length; i++) {
    const segmentLength = points[i].distanceTo(points[i - 1]);
    if (accumulatedDistance + segmentLength >= distance) {
      const t = (distance - accumulatedDistance) / segmentLength;
      return new THREE.Vector3().lerpVectors(points[i - 1], points[i], t);
    }
    accumulatedDistance += segmentLength;
  }
  return points[points.length - 1].clone();
};

// Component for node diagram and road path line
const NodeDiagram = ({ nodes, pathPoints, boxPosition = [0, 0.25, 0], visibleLeaves }) => {
  const groupRefs = useRef({});
  const { camera } = useThree();

  useFrame(() => {
    Object.values(groupRefs.current).forEach((ref) => {
      if (ref.current) {
        const direction = new THREE.Vector3();
        const groupPosition = ref.current.position;
        direction.subVectors(camera.position, groupPosition).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        ref.current.rotation.y = angle;
      }
    });
  });

  return (
    <group>
      {nodes.map((node) => {
        const groupRef = groupRefs.current[node.id] || (groupRefs.current[node.id] = React.createRef());

        return (
          <group key={node.id} ref={groupRef} position={[node.x, node.y, node.z]}>
            <mesh position={boxPosition}>
              <boxGeometry args={[1, 0.5, 0.1]} />
              <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
            </mesh>
            <Text position={[boxPosition[0], boxPosition[1], boxPosition[2] + 0.07]} fontSize={0.25} color="black">
              {node.id}
            </Text>
            {content[node.id].map((leaf, leafIndex) => {
              const angle = (Math.PI / (content[node.id].length + 1)) * (leafIndex + 1);
              const leafX = Math.cos(angle) * 1.5;
              const leafY = Math.sin(angle) * 1.5;

              // Only render the leaf if it's visible
              if (visibleLeaves.includes(`${node.id}-${leaf}`)) {
                return (
                  <group key={`${node.id}-${leaf}`}>
                    <mesh position={[leafX, leafY, 0]}>
                      <boxGeometry args={[0.75, 0.25, 0.05]} />
                      <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
                    </mesh>
                    <Text position={[leafX, leafY, 0.05]} fontSize={0.175} color="black">
                      {leaf}
                    </Text>
                    <Line
                      points={[
                        new THREE.Vector3(0, 0, 0),
                        new THREE.Vector3(leafX, leafY, 0)
                      ]}
                      color="green"
                      lineWidth={1}
                      dashed={false}
                    />
                  </group>
                );
              }
              return null;
            })}
          </group>
        );
      })}
      <Line
        points={pathPoints}
        color="black"
        lineWidth={2}
        dashed={false}
      />
    </group>
  );
};

// Combined visualization component
function CombinedVisualization({ nodes, scrollProgress, pathPoints, visibleLeaves, onNodeReached }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[-15, 15, 15]} fov={40} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <NodeDiagram nodes={nodes} pathPoints={pathPoints} visibleLeaves={visibleLeaves} />
      <CarAnimation pathPoints={pathPoints} scrollProgress={scrollProgress} onNodeReached={onNodeReached} />
      <AxisHelper />
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
    </Canvas>
  );
}

// Main App component
function App() {
  const [nodes, setNodes] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathPoints, setPathPoints] = useState([]);
  const [visibleLeaves, setVisibleLeaves] = useState([]);

  const generateCoordinates = () => {
    const nodeIds = Object.keys(content);
    const cornerPoints = [];
    let currentZ = 0;
    let currentX = 0;
    const Z_INCREMENT = 3.5;
    const X_OFFSET = -6;

    // Step 1: Generate corner points
    // Add the initial point before the first node
    cornerPoints.push(new THREE.Vector3(currentX, 0, currentZ - Z_INCREMENT));
    cornerPoints.push(new THREE.Vector3(currentX, 0, currentZ));

    const numIntermediateNodes = nodeIds.length - 2;
    const loopLimit = Math.ceil((numIntermediateNodes - 1) / 3) * 2 + 2;

    for (let i = 1; i < loopLimit; i++) {
      if (i % 2 === 1) {
        currentX = (i % 4 === 1) ? X_OFFSET : -X_OFFSET;
      } else {
        currentZ += Z_INCREMENT;
      }
      cornerPoints.push(new THREE.Vector3(currentX, 0, currentZ));
    }

    currentZ += Z_INCREMENT;
    cornerPoints.push(new THREE.Vector3(currentX, 0, currentZ));
    cornerPoints.push(new THREE.Vector3(0, 0, currentZ));

    currentZ += Z_INCREMENT;
    cornerPoints.push(new THREE.Vector3(0, 0, currentZ));

    // Step 2: Calculate the center of the path
    const boundingBox = new THREE.Box3().setFromPoints(cornerPoints);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Step 3: Adjust all points to center the path
    const centeredCornerPoints = cornerPoints.map(point => point.sub(center));

    // Step 4: Calculate node positions based on centered corner points
    const nodeCoordinates = [];
    const intermediateNodes = nodeIds.slice(1, -1);

    // Place first node at the second corner point (after the initial line)
    nodeCoordinates.push({ id: nodeIds[0], x: centeredCornerPoints[1].x, y: 0, z: centeredCornerPoints[1].z });

    // Distribute nodes
    let nodeIndex = 0;
    for (let i = 3; i < centeredCornerPoints.length - 2 && nodeIndex < numIntermediateNodes; i++) {
      const start = centeredCornerPoints[i - 1];
      const end = centeredCornerPoints[i];

      const deltaX = Math.abs(end.x - start.x);
      const deltaZ = Math.abs(end.z - start.z);
      const isShortSegment = deltaZ > deltaX;

      if (!isShortSegment) {
        for (let j = 0; j < 2 && nodeIndex < numIntermediateNodes; j++) {
          const t = (j + 1) / 3;
          const position = new THREE.Vector3().lerpVectors(start, end, t);
          nodeCoordinates.push({ id: intermediateNodes[nodeIndex], x: position.x, y: 0, z: position.z });
          nodeIndex++;
        }
      } else {
        if (nodeIndex < numIntermediateNodes) {
          const position = new THREE.Vector3().lerpVectors(start, end, 0.5);
          nodeCoordinates.push({ id: intermediateNodes[nodeIndex], x: position.x, y: 0, z: position.z });
          nodeIndex++;
        }
      }
    }

    // Place last node
    const lastCorner = centeredCornerPoints[centeredCornerPoints.length - 2];
    nodeCoordinates.push({ id: nodeIds[nodeIds.length - 1], x: lastCorner.x, y: 0, z: lastCorner.z });

    return { nodes: nodeCoordinates, path: centeredCornerPoints };
  };



  useEffect(() => {
    const { nodes: newNodes, path: newPath } = generateCoordinates();
    setNodes(newNodes);
    setPathPoints(newPath);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNodeReached = (truckPosition) => {
    const nearbyNode = nodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - truckPosition.x, 2) +
        Math.pow(node.z - truckPosition.z, 2)
      );
      return distance < 0.5; // Adjust this threshold as needed
    });

    if (nearbyNode) {
      const newLeaves = content[nearbyNode.id].map(leaf => `${nearbyNode.id}-${leaf}`);
      setVisibleLeaves(prevLeaves => [...new Set([...prevLeaves, ...newLeaves])]);
    }
  };

  return (
    <div className="App">
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <CombinedVisualization
            nodes={nodes}
            scrollProgress={scrollProgress}
            pathPoints={pathPoints}
            visibleLeaves={visibleLeaves}
            onNodeReached={handleNodeReached}
          />
        </div>
        <div style={{ height: '400vh' }} />
      </div>
    </div>
  );
}

export default App;