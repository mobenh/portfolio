import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Car() {
  const carRef = useRef();
  const { scene } = useGLTF('/truck.glb');
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame(() => {
    if (carRef.current) {
      // Scroll-based movement
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const normalizedScroll = scrollPosition / maxScroll;
      const scrollBasedPosition = (normalizedScroll * 10) - 5; // Adjust range as needed

      carRef.current.position.z = scrollBasedPosition;
      carRef.current.rotation.y = scrollBasedPosition > 0 ? Math.PI / 2 - 0.3 : -Math.PI / 2 - 0.3;
    }
  });

  return <primitive object={scene} ref={carRef} />;
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[.05, 20]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

function App() {
  return (
    <>
      <div style={{ height: '300vh', width: '100vw' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
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
    </>
  );
}

export default App;