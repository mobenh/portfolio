// src/components/CarAnimation.js

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CarAnimation = ({ pathPoints, progress }) => {
  const carRef = useRef();
  const { scene } = useGLTF('/truck.glb');
  const curveRef = useRef();

  useEffect(() => {
    if (pathPoints && pathPoints.length > 1) {
      curveRef.current = new THREE.CatmullRomCurve3(pathPoints);
    }
  }, [pathPoints]);

  useFrame(() => {
    if (carRef.current && curveRef.current) {
      const point = curveRef.current.getPoint(progress);
      carRef.current.position.copy(point);

      // Calculate tangent for rotation
      const tangent = curveRef.current.getTangent(progress);
      const lookAtPoint = new THREE.Vector3().addVectors(point, tangent);
      carRef.current.lookAt(lookAtPoint);
      carRef.current.rotateY(Math.PI / 2); // Adjust based on model orientation
    }
  });

  return <primitive object={scene} ref={carRef} scale={[0.2, 0.2, 0.2]} />;
};

export default CarAnimation;