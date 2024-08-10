// src/components/CombinedVisualization.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import NodeDiagram from './NodeDiagram';
import CarAnimation from './CarAnimation';

const content = {
  First: ['leaf1', 'leaf2'],
  Node1: ['leaf1', 'leaf2', 'leaf3'],
  Node2: ['leaf1'],
  Node3: ['leaf1', 'leaf2'],
  Node4: ['leaf1'],
  Last: ['leaf1', 'leaf2', 'leaf3'],
};

function CameraController({ scrollProgress, nodes }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (nodes.length > 1) {
      const startY = nodes[0].y;
      const endY = nodes[nodes.length - 1].y;
      const totalDistance = startY - endY;
      
      camera.position.y = startY - scrollProgress * totalDistance;
      camera.lookAt(0, camera.position.y, 0);
    }
  }, [scrollProgress, camera, nodes]);

  return null;
}

function CombinedVisualization() {
  const [nodes, setNodes] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const generateCoordinates = () => {
      const INITIAL_Y = 5;
      const MID_X = 0;
      const Y_INCREMENT = 2;
      const X_PATTERN = [-5, 5, -5, 5];

      const nodeIds = Object.keys(content);
      const coordinates = [{ id: nodeIds[0], x: MID_X, y: INITIAL_Y, z: 0 }];
      let currentY = INITIAL_Y;
      let patternIndex = 0;

      for (let i = 1; i < nodeIds.length - 1; i++) {
        currentY -= Y_INCREMENT;
        coordinates.push({ id: nodeIds[i], x: X_PATTERN[patternIndex], y: currentY, z: 0 });
        patternIndex = (patternIndex + 1) % X_PATTERN.length;
      }

      coordinates.push({ id: nodeIds[nodeIds.length - 1], x: MID_X, y: currentY - Y_INCREMENT, z: 0 });
      return coordinates;
    };

    setNodes(generateCoordinates());
  }, []);

  const pathPoints = useMemo(() => {
    if (nodes.length < 2) return [];

    const curve = new THREE.CatmullRomCurve3(
      nodes.map(node => new THREE.Vector3(node.x, node.y, node.z))
    );

    return curve.getPoints(100); // Increased for smoother movement
  }, [nodes]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollPosition / maxScroll, 1);
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={60} />
          <CameraController scrollProgress={scrollProgress} nodes={nodes} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          {nodes.length > 0 && <NodeDiagram nodes={nodes} />}
          {pathPoints.length > 0 && <CarAnimation pathPoints={pathPoints} progress={scrollProgress} />}
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>
      <div style={{ height: '400vh' }} /> {/* Scrollable space */}
    </div>
  );
}

export default CombinedVisualization;