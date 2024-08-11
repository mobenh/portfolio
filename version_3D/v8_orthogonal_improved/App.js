import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const content = {
  First: ['leaf1', 'leaf2'],
  Node1: ['leaf1', 'leaf2', 'leaf3'],
  Node2: ['leaf1'],
  Node3: ['leaf1', 'leaf2'],
  Node4: ['leaf1'],
  Node5: ['leaf1', 'leaf2'],
  Last: ['leaf1', 'leaf2', 'leaf3'],
};

// Component for car animation
const CarAnimation = ({ pathPoints, scrollProgress }) => {
  const carRef = useRef();
  const { scene } = useGLTF('/truck.glb');
  const previousPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    if (carRef.current && pathPoints.length > 1) {
      const totalDistance = calculateTotalDistance(pathPoints);
      const currentDistance = scrollProgress * totalDistance;
      const point = getPointAtDistance(pathPoints, currentDistance);
      
      carRef.current.position.copy(point);

      // Calculate the direction of movement
      const movement = new THREE.Vector3().subVectors(point, previousPosition.current);

      if (movement.length() > 0.001) {
        const lookAtPoint = new THREE.Vector3().addVectors(point, movement);
        carRef.current.lookAt(lookAtPoint);

        // Apply additional rotation to align the car properly
        carRef.current.rotateY(1.25);
        carRef.current.rotateX(0);
        carRef.current.rotateZ(0);
      }

      previousPosition.current.copy(point);
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

  useFrame(() => {
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
  });

  return (
    <group>
      {nodes.map((node) => {
        const groupRef = groupRefs.current[node.id] || (groupRefs.current[node.id] = React.createRef());

        return (
          <React.Fragment key={node.id}>
            <group ref={groupRef} position={[node.x, node.y, node.z]}>
              <mesh position={boxPosition}>
                <boxGeometry args={[0.5, 0.2, 0.1]} />
                <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
              </mesh>
              <Text position={[boxPosition[0], boxPosition[1], boxPosition[2] + 0.07]} fontSize={0.15} color="black">
                {node.id}
              </Text>
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
                      <boxGeometry args={[0.4, 0.15, 0.05]} />
                      <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
                    </mesh>
                    <Text position={[boxPosition[0], boxPosition[1], boxPosition[2] + 0.05]} fontSize={0.1} color="black">
                      {leaf}
                    </Text>
                  </group>
                  <Line
                    points={[
                      new THREE.Vector3(node.x + boxPosition[0], node.y + boxPosition[1], node.z + boxPosition[2]),
                      new THREE.Vector3(node.x + leafX + boxPosition[0], node.y + leafY + boxPosition[1], node.z + boxPosition[2])
                    ]}
                    color="green"
                    lineWidth={1}
                    dashed={false}
                  />
                </React.Fragment>
              );
            })}
          </React.Fragment>
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
    const VERTICAL_EXTENSION = 2;

    const nodeIds = Object.keys(content);
    const coordinates = [];
    const pathCoordinates = [];
    let currentZ = INITIAL_Z;
    let currentX = MID_X;

    // First node
    coordinates.push({ id: nodeIds[0], x: currentX, y: 0, z: currentZ });
    pathCoordinates.push(new THREE.Vector3(currentX, 0, currentZ));

    // Intermediate nodes
    for (let i = 1; i < nodeIds.length - 1; i++) {
      if (i % 2 === 1) {
        // Horizontal movement
        const nextX = (i % 4 === 1) ? X_OFFSET : -X_OFFSET;
        pathCoordinates.push(new THREE.Vector3(nextX, 0, currentZ));
        
        // Place node at 1/3 or 2/3 of the horizontal line
        const nodeX = (i % 4 === 1) ? MID_X + (X_OFFSET / 3) : MID_X - (X_OFFSET / 3);
        coordinates.push({ id: nodeIds[i], x: nodeX, y: 0, z: currentZ });
        
        currentX = nextX;
      } else {
        // Vertical movement
        currentZ += Z_INCREMENT + VERTICAL_EXTENSION;
        pathCoordinates.push(new THREE.Vector3(currentX, 0, currentZ));
        
        // Place node at the center of the vertical line
        coordinates.push({ id: nodeIds[i], x: currentX, y: 0, z: currentZ - (VERTICAL_EXTENSION / 2) });
      }
    }

    // Last node - maintaining orthogonal nature
    currentZ += Z_INCREMENT + VERTICAL_EXTENSION;
    // Add an extra point to create a right angle
    pathCoordinates.push(new THREE.Vector3(currentX, 0, currentZ));
    // Move to the center
    pathCoordinates.push(new THREE.Vector3(MID_X, 0, currentZ));
    
    coordinates.push({ id: nodeIds[nodeIds.length - 1], x: MID_X, y: 0, z: currentZ });

    return { nodes: coordinates, path: pathCoordinates };
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