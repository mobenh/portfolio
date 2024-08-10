import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CAR_MOVEMENT_RANGE = 10;
const CAR_INITIAL_POSITION = -5;
const ROAD_WIDTH = 0.05;
const ROAD_LENGTH = 20;

function Car() {
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
    if (!carRef.current) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const normalizedScroll = scrollPosition / maxScroll;
    const scrollBasedPosition = normalizedScroll * CAR_MOVEMENT_RANGE + CAR_INITIAL_POSITION;

    const newPosition = new THREE.Vector3(0, 0, scrollBasedPosition);
    carRef.current.position.copy(newPosition);

    const movement = new THREE.Vector3().subVectors(newPosition, previousPosition.current);
    
    if (movement.length() > 0.001) {
      const angle = Math.atan2(movement.x, movement.z);
      carRef.current.rotation.y = angle + Math.PI / 2 - .3;
    }

    previousPosition.current.copy(newPosition);
  });

  return <primitive object={scene} ref={carRef} />;
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[ROAD_WIDTH, ROAD_LENGTH]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

function App() {
  return (
    <>
      <header className="bg-blue-500 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Scrolling Car Animation</h1>
      </header>

      <div style={{ height: 'calc(300vh - 128px)', width: '100vw' }}>
        <div style={{ position: 'fixed', top: '64px', left: 0, width: '100vw', height: 'calc(100vh - 128px)' }}>
          <Canvas camera={{ position: [0, 10, 0], rotation: [-Math.PI / 2, 0, 0], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Suspense fallback={null}>
              <Road />
              <Car />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2024 Car Animation. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;