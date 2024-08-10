import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const content = {
  First: ['leaf1', 'leaf2'],
  Node1: ['leaf1', 'leaf2', 'leaf3'],
  Node2: ['leaf1'],
  Node3: ['leaf1', 'leaf2'],
  Node4: ['leaf1'],
  Last: ['leaf1', 'leaf2', 'leaf3'],
};

// Component for car animation
const CarAnimation = ({ pathPoints, scrollProgress }) => {
  const carRef = useRef();
  const { scene } = useGLTF('/truck.glb');
  const curveRef = useRef();

  useEffect(() => {
    if (pathPoints.length > 1) {
      curveRef.current = new THREE.CatmullRomCurve3(pathPoints);
    }
  }, [pathPoints]);

  useEffect(() => {
    if (carRef.current && curveRef.current) {
      const point = curveRef.current.getPoint(scrollProgress);
      carRef.current.position.copy(point);

      const tangent = curveRef.current.getTangent(scrollProgress);
      carRef.current.lookAt(new THREE.Vector3().addVectors(point, tangent));
      carRef.current.rotateY(Math.PI / 2);
    }
  }, [scrollProgress]);

  return <primitive object={scene} ref={carRef} scale={[2, 2, 2]} />;
};

// Component for node diagram and road path line
const NodeDiagram = ({ nodes }) => {
  const meshRefs = useRef({});
  const { raycaster, camera, size } = useThree();
  const [hoveredNode, setHoveredNode] = useState(null);

  const handlePointerMove = useCallback((event) => {
    const x = (event.clientX / size.width) * 2 - 1;
    const y = -(event.clientY / size.height) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const meshes = Object.values(meshRefs.current).map(ref => ref.current);
    const intersects = raycaster.intersectObjects(meshes);
    setHoveredNode(intersects.length > 0 ? intersects[0].object.userData.id : null);
  }, [raycaster, camera, size]);

  return (
    <group onPointerMove={handlePointerMove}>
      {nodes.map((node, index) => {
        const isHovered = hoveredNode === node.id;
        const nodeRef = meshRefs.current[node.id] || (meshRefs.current[node.id] = React.createRef());

        return (
          <React.Fragment key={node.id}>
            <mesh ref={nodeRef} position={[node.x, node.y, node.z]} userData={{ id: node.id }}>
              <boxGeometry args={[0.5, 0.2, 0.1]} />
              <meshStandardMaterial color={isHovered ? 'red' : 'blue'} />
            </mesh>
            <Text position={[node.x, node.y, node.z + 0.1]} fontSize={0.15} color={isHovered ? 'red' : 'black'}>
              {node.id}
            </Text>
            {content[node.id].map((leaf, leafIndex) => {
              const angle = (Math.PI / (content[node.id].length + 1)) * (leafIndex + 1);
              const leafX = node.x + Math.cos(angle) * 1.5;
              const leafY = node.y + Math.sin(angle) * 1.5;
              return (
                <React.Fragment key={leaf}>
                  <mesh position={[leafX, leafY, node.z]}>
                    <boxGeometry args={[0.4, 0.15, 0.05]} />
                    <meshStandardMaterial color="green" />
                  </mesh>
                  <Text position={[leafX, leafY, node.z + 0.05]} fontSize={0.1} color="white">
                    {leaf}
                  </Text>
                  <Line
                    points={[
                      new THREE.Vector3(node.x, node.y, node.z),
                      new THREE.Vector3(leafX, leafY, node.z)
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
        points={nodes.map(node => new THREE.Vector3(node.x, node.y, node.z))}
        color="gray"
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
      <NodeDiagram nodes={nodes} />
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

  useEffect(() => {
    const generateCoordinates = () => {
      const INITIAL_Z = -5;  // Changed from INITIAL_Y
      const MID_X = 0;
      const Z_INCREMENT = 2;  // Changed from Y_INCREMENT
      const X_PATTERN = [-5, 5, -5, 5];

      const nodeIds = Object.keys(content);
      const coordinates = [{ id: nodeIds[0], x: MID_X, y: 0, z: INITIAL_Z }];  // Changed y and z
      let currentZ = INITIAL_Z;
      let patternIndex = 0;

      for (let i = 1; i < nodeIds.length - 1; i++) {
        currentZ += Z_INCREMENT;
        coordinates.push({ id: nodeIds[i], x: X_PATTERN[patternIndex], y: 0, z: currentZ });  // Changed y and z
        patternIndex = (patternIndex + 1) % X_PATTERN.length;
      }

      coordinates.push({ id: nodeIds[nodeIds.length - 1], x: MID_X, y: 0, z: currentZ + Z_INCREMENT });  // Changed y and z
      return coordinates;
    };

    const newNodes = generateCoordinates();
    setNodes(newNodes);

    if (newNodes.length >= 2) {
      const curve = new THREE.CatmullRomCurve3(
        newNodes.map(node => new THREE.Vector3(node.x, node.y, node.z))
      );
      setPathPoints(curve.getPoints(100));
    }
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