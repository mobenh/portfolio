import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Line } from '@react-three/drei';
import * as THREE from 'three';

const styles = {
  header: {
    color: 'black',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  canvasContainer: {
    height: '500vh',
    width: '100vw',
    overflow: 'hidden',  // Hide overflow to prevent scrollbars if needed
    display: 'flex',    // Center the canvas horizontally and vertically
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasWrapper: {
    position: 'fixed',
    height: '30vh',
    top: '30px',
    left: 0,
    width: '50vw',
  },
  footer: {
    backgroundColor: '#e5e7eb',
    padding: '1rem',
    textAlign: 'center',
  },
};

function Car({ pathPoints }) {
  const carRef = useRef();
  const { scene } = useGLTF('/truck.glb');
  const [scrollPosition, setScrollPosition] = useState(0);
  const previousPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    if (!carRef.current || pathPoints.length < 2) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const normalizedScroll = scrollPosition / maxScroll;

    const curveLength = new THREE.CatmullRomCurve3(pathPoints).getLength();
    const targetDistance = normalizedScroll * curveLength;

    let accumulatedDistance = 0;
    let segmentStart, segmentEnd;

    for (let i = 0; i < pathPoints.length - 1; i++) {
      const start = pathPoints[i];
      const end = pathPoints[i + 1];
      const segmentLength = new THREE.Vector3().subVectors(end, start).length();

      if (accumulatedDistance + segmentLength >= targetDistance) {
        segmentStart = start;
        segmentEnd = end;
        break;
      }

      accumulatedDistance += segmentLength;
    }

    if (segmentStart && segmentEnd) {
      const segmentProgress = (targetDistance - accumulatedDistance) / new THREE.Vector3().subVectors(segmentEnd, segmentStart).length();
      const newPosition = new THREE.Vector3().lerpVectors(segmentStart, segmentEnd, segmentProgress);

      carRef.current.position.copy(newPosition);

      const movement = new THREE.Vector3().subVectors(newPosition, previousPosition.current);

      if (movement.length() > 0.001) {
        const angle = Math.atan2(movement.x, movement.z);
        carRef.current.rotation.y = angle + Math.PI / 2 - 0.3;
      }

      previousPosition.current.copy(newPosition);
    }
  });

  return <primitive object={scene} ref={carRef} scale={[5, 5, 5]} />;
}

function Road({ pathPoints }) {
  return (
    <Line
      points={pathPoints}
      color="gray"
      lineWidth={10}
      position={[0, 0, 0]}
    />
  );
}

function App() {
  const pathPoints = [
    new THREE.Vector3(0, 0, 0),    // Start
    new THREE.Vector3(0, 0, 5),    // Move north
    new THREE.Vector3(5, 0, 5),    // Move east
    new THREE.Vector3(5, 0, 10),   // Move north
    new THREE.Vector3(10, 0, 10),  // Move east
    new THREE.Vector3(10, 0, 5),   // Move south
    new THREE.Vector3(5, 0, 5),    // Move west
    new THREE.Vector3(5, 0, 0),    // Move south
    new THREE.Vector3(10, 0, 0)    // Move east to end
  ];

  return (
    <>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Scrolling Car Animation</h1>
      </header>

      <div style={styles.canvasContainer}>
        <div style={styles.canvasWrapper}>
          <Canvas camera={{ position: [0, 15, 0], rotation: [-Math.PI / 2, 0, 0], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Suspense fallback={null}>
                <Road pathPoints={pathPoints} />
                <Car pathPoints={pathPoints} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2024 Car Animation. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;