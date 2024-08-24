import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Text, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

const content = {
  First: ['leaf1', 'leaf2'],
  Node1: ['leaf1', 'leaf2', 'leaf3'],
  Node2: ['leaf1'],
  Node3: ['leaf1', 'leaf2'],
  Node4: ['leaf1'],
  Node5: ['leaf1', 'leaf2'],
  Node6: ['leaf1', 'leaf'],
  Last: ['leaf1', 'leaf2', 'leaf3'],
};

// Component for car animation
const CarAnimation = ({ pathPoints, scrollProgress }) => {
  const carRef = useRef();
  const { scene } = useGLTF('/truck.glb');
  const previousPosition = useRef(new THREE.Vector3());
  const elevationOffset = new THREE.Vector3(0, 0.2, 0); // Slight upward offset

  useFrame(() => {
    if (carRef.current && pathPoints.length > 1) {
      const totalDistance = calculateTotalDistance(pathPoints);
      const currentDistance = scrollProgress * totalDistance;
      const point = getPointAtDistance(pathPoints, currentDistance);

      // Apply the elevation offset to the point, not the car's position directly
      const elevatedPoint = point.clone().add(elevationOffset);
      carRef.current.position.copy(elevatedPoint);

      // Calculate the direction of movement using non-elevated points
      const movement = new THREE.Vector3().subVectors(point, previousPosition.current);

      if (movement.length() > 0.001) {
        // Create a look-at point that's elevated the same amount as the car
        const lookAtPoint = new THREE.Vector3().addVectors(elevatedPoint, movement);
        carRef.current.lookAt(lookAtPoint);

        // Apply additional rotation to align the car properly
        carRef.current.rotateY(1.25);
      }

      previousPosition.current.copy(point); // Store non-elevated point
    }
  });

  return <primitive object={scene} ref={carRef} scale={[3, 3, 3]} />;
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
const NodeDiagram = ({ nodes, pathPoints, boxPosition = [0, 0.125, 0] }) => {
  const groupRefs = useRef({});
  const leafGroupRefs = useRef({});
  const { camera } = useThree();
  
  // Load a texture for particles

  // Create particle system for each node
  const particleSystems = useMemo(() => {
    return nodes.map((node) => {
      const particleCount = 50;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
      });

      return new THREE.Points(particles, material);
    });
  }, [nodes]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotateGroupToFaceCamera = (ref) => {
      if (ref.current) {
        const direction = new THREE.Vector3();
        const groupPosition = ref.current.position;
        direction.subVectors(camera.position, groupPosition).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        ref.current.rotation.y = angle;
      }
    };

    Object.values(groupRefs.current).forEach(rotateGroupToFaceCamera);
    Object.values(leafGroupRefs.current).forEach(rotateGroupToFaceCamera);

    // Animate particle systems
    particleSystems.forEach((system, index) => {
      system.rotation.y = time * 0.2;
      system.position.y = Math.sin(time + index) * 0.1;
    });
  });

  return (
    <group>
      {nodes.map((node, index) => {
        const groupRef = groupRefs.current[node.id] || (groupRefs.current[node.id] = React.createRef());
        const isFirst = index === 0;
        const isLast = index === nodes.length - 1;
        const nodeColor = isFirst ? "#4CAF50" : isLast ? "#F44336" : "#2196F3";

        return (
          <React.Fragment key={node.id}>
            <group ref={groupRef} position={[node.x, node.y, node.z]}>
              <mesh position={boxPosition}>
                <dodecahedronGeometry args={[0.3, 0]} />
                <meshPhysicalMaterial 
                  color={nodeColor} 
                  metalness={0.8} 
                  roughness={0.2} 
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                />
              </mesh>
              <primitive object={particleSystems[index]} position={boxPosition} />
              <Html position={[boxPosition[0], boxPosition[1] + 0.5, boxPosition[2]]}>
                <div style={{ 
                  background: 'rgba(0,0,0,0.7)', 
                  color: 'white', 
                  padding: '5px 10px', 
                  borderRadius: '5px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textShadow: '0 0 5px #00ff00'
                }}>
                  {node.id}
                </div>
              </Html>
            </group>
            {content[node.id].map((leaf, leafIndex) => {
              const angle = (Math.PI / (content[node.id].length + 1)) * (leafIndex + 1);
              const leafX = Math.cos(angle) * 1.5;
              const leafY = Math.sin(angle) * 1.5;
              const leafGroupRef = leafGroupRefs.current[`${node.id}-${leaf}`] || (leafGroupRefs.current[`${node.id}-${leaf}`] = React.createRef());

              return (
                <React.Fragment key={`${node.id}-${leaf}`}>
                  <group ref={leafGroupRef} position={[node.x + leafX, node.y + leafY, node.z]}>
                    <mesh position={boxPosition}>
                      <octahedronGeometry args={[0.2, 0]} />
                      <meshPhysicalMaterial 
                        color="#FFC107" 
                        metalness={0.5} 
                        roughness={0.5}
                        transmission={0.2}
                        thickness={0.5}
                      />
                    </mesh>
                    <Text 
                      position={[boxPosition[0], boxPosition[1], boxPosition[2] + 0.25]} 
                      fontSize={0.1} 
                      color="white"
                      outlineWidth={0.004}
                      outlineColor="black"
                    >
                      {leaf}
                    </Text>
                  </group>
                  <Line
                    points={[
                      new THREE.Vector3(node.x + boxPosition[0], node.y + boxPosition[1], node.z + boxPosition[2]),
                      new THREE.Vector3(node.x + leafX + boxPosition[0], node.y + leafY + boxPosition[1], node.z + boxPosition[2])
                    ]}
                    color="#4CAF50"
                    lineWidth={2}
                    dashed={true}
                    dashScale={3}
                    dashSize={0.1}
                    gapSize={0.05}
                  />
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
      <Line
        points={pathPoints}
        color="#E91E63"
        lineWidth={5}
        dashed={false}
      >
        <lineDashedMaterial
          color="#E91E63"
          dashSize={0.5}
          gapSize={0.2}
          scale={1}
        />
      </Line>
    </group>
  );
};

// Combined visualization component
function CombinedVisualization({ nodes, scrollProgress, pathPoints }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 15, 0]} fov={60} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <NodeDiagram nodes={nodes} pathPoints={pathPoints} />
      <CarAnimation pathPoints={pathPoints} scrollProgress={scrollProgress} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} target={[0, 0, 0]} />
    </Canvas>
  );
}

// Main App component
function App() {
  const [nodes, setNodes] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathPoints, setPathPoints] = useState([]);

  const generateCoordinates = () => {
    const INITIAL_Z = -5;
    const MID_X = 0;
    const Z_INCREMENT = 2;
    const X_OFFSET = 5;
  
    const nodeIds = Object.keys(content);
    const cornerPoints = [];
    let currentZ = INITIAL_Z;
    let currentX = MID_X;
  
    // Step 1: Generate corner points
    cornerPoints.push(new THREE.Vector3(currentX, 0, currentZ));
  
    for (let i = 1; i < 5; i++) {
      if (i % 2 === 1) {
        // Horizontal movement (long segment)
        currentX = (i % 4 === 1) ? X_OFFSET : -X_OFFSET;
      } else {
        // Vertical movement (short segment)
        currentZ += Z_INCREMENT;
      }
      cornerPoints.push(new THREE.Vector3(currentX, 0, currentZ));
    }
  
    // Add the final point back to the center
    cornerPoints.push(new THREE.Vector3(MID_X, 0, currentZ));
  
    // Step 2: Calculate positions for node placement
    const nodeCoordinates = [];
    const intermediateNodes = nodeIds.slice(1, -1);
    const numIntermediateNodes = intermediateNodes.length;
  
    // Place first node
    nodeCoordinates.push({ id: nodeIds[0], x: cornerPoints[0].x, y: 0, z: cornerPoints[0].z });
  
    // Distribute nodes
    let nodeIndex = 0;
    for (let i = 1; i < cornerPoints.length && nodeIndex < numIntermediateNodes; i++) {
      const start = cornerPoints[i - 1];
      const end = cornerPoints[i];
      const isLongSegment = i % 2 === 1; // Odd segments are long (horizontal)
  
      if (isLongSegment) {
        // Place up to two nodes on long segment
        for (let j = 0; j < 2 && nodeIndex < numIntermediateNodes; j++) {
          const t = (j + 1) / 3; // Place at 1/3 and 2/3 of the segment
          const position = new THREE.Vector3().lerpVectors(start, end, t);
          nodeCoordinates.push({ id: intermediateNodes[nodeIndex], x: position.x, y: 0, z: position.z });
          nodeIndex++;
        }
      } else {
        // Place one node on short segment
        if (nodeIndex < numIntermediateNodes) {
          const position = new THREE.Vector3().lerpVectors(start, end, 0.5);
          nodeCoordinates.push({ id: intermediateNodes[nodeIndex], x: position.x, y: 0, z: position.z });
          nodeIndex++;
        }
      }
    }
  
    // Place last node
    const lastCorner = cornerPoints[cornerPoints.length - 1];
    nodeCoordinates.push({ id: nodeIds[nodeIds.length - 1], x: lastCorner.x, y: 0, z: lastCorner.z });
  
    return { nodes: nodeCoordinates, path: cornerPoints };
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

  return (
    <div className="App">
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <CombinedVisualization nodes={nodes} scrollProgress={scrollProgress} pathPoints={pathPoints} />
        </div>
        <div style={{ height: '400vh' }} />
      </div>
    </div>
  );
}

export default App;