import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Switch } from '@mui/material';
import { useSpring, animated } from '@react-spring/three';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiTerraform, SiGitlab, SiMicrosoftazure } from 'react-icons/si';
import { DiAws } from 'react-icons/di';

const iconMapping = {
  Terraform: SiTerraform,
  AWS: DiAws,
  Gitlab: SiGitlab,
  Azure: SiMicrosoftazure,
  // Add more mappings if needed
};


const content = {
  Languages: [
    { name: 'Python' },
    { name: 'Golang' },
    { name: 'JavaScript' },
    { name: 'C++' },
  ],
  Projects: [
    {
      name: 'Portfolio',
      descriptions: ['React.js, AWS, and Gitlab'],
      links: [
        { beforeText: 'Visit the', text: 'mobenh.com', url: 'https://mobenh.com' },
        { beforeText: 'View the', text: 'GitHub Repo', url: 'https://github.com/mobenh/react-portfolio' },
      ],
    },
    {
      name: 'Cloud',
      descriptions: ['EC2, AWS CLI, and Terraform.'],
      links: [
        { beforeText: 'View the', text: 'GitHub Repo', url: 'https://github.com/mobenh/terraform-aws-ec2instance' },
      ],
    },
  ],
  Frameworks: [
    { name: 'React' },
    { name: 'Angular' },
  ],
  Infrastructure: [
    { name: 'Terraform' },
    { name: 'AWS' },
    { name: 'Gitlab' },
    { name: 'Azure' },
  ],
  Certifications: [
    {
      name: 'AWS Developer',
      // descriptions: ['Issued by Amazon Web Services'],
      links: [
        { beforeText: 'View the', text: 'Certification', url: 'https://www.credly.com/badges/2be8519a-87bb-4da7-bade-026d50109a5c/public_url' },
      ],
    },
    {
      name: 'AWS SysOps Administrator',
      // descriptions: ['Issued by Amazon Web Services'],
      links: [
        { beforeText: 'View the', text: 'Certification', url: 'https://www.credly.com/badges/3611f19e-cfb4-4633-a5ea-1a095da9f9fd/public_url' },
      ],
    },
    {
      name: 'Azure Administrator',
      // descriptions: ['Issued by Microsoft'],
      links: [
        {
          beforeText: 'View the', text: 'Certification', url: 'https://learn.microsoft.com/api/credentials/share/en-us/MobenHaq-8295/667B837CAC710E44?sharingId=8DB882188D2F4733'
        }
      ]
    },
  ],
  Contact: [
    {
      name: 'Phone',
      // url: 'tel:+19513378563',
      links: [
        { beforeText: '', text: '(951) 337-8563', url: 'tel:+19513378563' },
      ],
    },
    {
      name: 'Email',
      // url: 'mailto:moben.h@outlook.com',
      links: [
        { beforeText: '', text: 'moben.h@outlook.com', url: 'mailto:moben.h@outlook.com' },
      ],
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/moben-haq',
      // links: [
      //   { beforeText: 'Connect on', text: 'LinkedIn', url: 'https://www.linkedin.com/in/moben-haq' },
      // ],
    },
    {
      name: 'GitHub',
      url: 'https://github.com/mobenh',
      // links: [
      //   { beforeText: 'View the', text: 'GitHub', url: 'https://github.com/mobenh' },
      // ],
    },
  ],
};

// Define the Footer component within App.js
function Footer() {
  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60px',
    backgroundColor: '#121212',      // Dark background
    color: '#e0e0e0',                // Light text color
    padding: '0 20px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #333',     // Subtle border on top
  };

  const linkContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#e0e0e0',                // Match text color
    marginLeft: '15px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s',        // Smooth color transition
  };

  const linkHoverColor = '#BB86FC';  // Vibrant accent color (purple)

  const iconStyle = {
    marginRight: '5px',
  };

  return (
    <div style={footerStyle}>
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} Moben Haq. All rights reserved.</p>
      <div style={linkContainerStyle}>
        <a
          href="https://www.linkedin.com/in/moben-haq"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
        >
          <FaLinkedin size={20} style={iconStyle} />
          LinkedIn
        </a>
        <a
          href="https://github.com/moben-haq"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...linkStyle, marginLeft: '20px' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = linkHoverColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = linkStyle.color)}
        >
          <FaGithub size={20} style={iconStyle} />
          GitHub
        </a>
      </div>
    </div>
  );
}


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

// NodeDiagram component with animations
const NodeDiagram = ({ nodes, pathPoints, boxPosition = [0, 0.25, 0], visibleLeaves, onLeafClick }) => {
  const groupRefs = useRef({});
  const { camera } = useThree();

  return (
    <group>
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          groupRef={groupRefs.current[node.id] || (groupRefs.current[node.id] = React.createRef())}
          camera={camera}
          visibleLeaves={visibleLeaves}
          onLeafClick={onLeafClick}
        />
      ))}
      <Line
        points={pathPoints}
        color="black"
        lineWidth={2}
        dashed={false}
      />
    </group>
  );
};

// Node component with hover and appearance animations
const Node = ({ node, groupRef, camera, visibleLeaves, onLeafClick }) => {
  const [hovered, setHovered] = useState(false);

  const { scale: hoverScale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const { scale: appearScale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const hoveredColor = hovered ? '#2196F3' : '#F0F0F0'; // Updated hover color to vibrant blue and node color to light gray


  useFrame(() => {
    if (groupRef.current) {
      const direction = new THREE.Vector3();
      const groupPosition = groupRef.current.position;
      direction.subVectors(camera.position, groupPosition).normalize();
      const angle = Math.atan2(direction.x, direction.z);
      groupRef.current.rotation.y = angle;
    }
  });

  return (
    <animated.group ref={groupRef} position={[node.x, node.y, node.z]} scale={appearScale}>
      <animated.mesh
        position={[0, 0.25, 0]}
        scale={hoverScale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.75, 0.5, 0.1]} />
        <meshStandardMaterial color={hoveredColor} emissive={hoveredColor} emissiveIntensity={1} />
      </animated.mesh>
      <Text position={[0, 0.25, 0.07]} fontSize={0.25} color="black">
        {node.id}
      </Text>
      {content[node.id].map((leaf, leafIndex) => {
        const angle = (Math.PI / (content[node.id].length + 1)) * (leafIndex + 1);
        const leafX = Math.cos(angle) * 1.5;
        const leafY = Math.sin(angle) * 1.5;

        // Only render the leaf if it's visible
        if (visibleLeaves.includes(`${node.id}-${leaf.name}`)) {
          return (
            <Leaf
              key={`${node.id}-${leaf.name}`}
              nodeId={node.id}
              leaf={leaf}
              position={[leafX, leafY, 0]}
              onLeafClick={onLeafClick}
            />
          );
        }
        return null;
      })}
    </animated.group>
  );
};

// Leaf component with hover and appearance animations
const Leaf = ({ nodeId, leaf, position, onLeafClick }) => {
  const [hovered, setHovered] = useState(false);

  const { scale: hoverScale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const { scale: appearScale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const hoveredColor = hovered ? '#2196F3' : '#F0F0F0'; // Updated hover color to vibrant blue and node color to light gray

  const handleClick = (e) => {
    e.stopPropagation();
    if (leaf.url) {
      window.open(leaf.url, '_blank');
    } else if (leaf.links && leaf.links.length > 0) {
      onLeafClick(nodeId, leaf);
    }
  };

  return (
    <animated.group scale={appearScale}>
      <animated.mesh
        position={position}
        scale={hoverScale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <boxGeometry args={[0.75, 0.25, 0.05]} />
        <meshStandardMaterial color={hoveredColor} emissive={hoveredColor} emissiveIntensity={1} />
      </animated.mesh>
      <Text position={[position[0], position[1], 0.05]} fontSize={0.175} color="black">
        {leaf.name}
      </Text>
      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(position[0], position[1], 0),
        ]}
        color="green"
        lineWidth={1}
        dashed={false}
      />
    </animated.group>
  );
};


// Modified ResponsiveScene component
function ResponsiveScene({ children, isFreeRotate }) {
  const { size, camera } = useThree();
  const aspect = size.width / size.height;

  useFrame(() => {
    if (!isFreeRotate) {
      // Adjust camera position based on aspect ratio
      camera.position.set(-15 * aspect, 15, 15);
      camera.lookAt(0, 0, 0);

      // Adjust field of view based on aspect ratio
      camera.fov = 40 / aspect;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[-15, 15, 15]} fov={40} />
      {children}
    </>
  );
}

// CombinedVisualization component
function CombinedVisualization({ nodes, scrollProgress, pathPoints, visibleLeaves, onNodeReached, onLeafClick, isFreeRotate }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [isFreeRotate]);

  return (
    <Canvas>
      <ResponsiveScene isFreeRotate={isFreeRotate}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <NodeDiagram
          nodes={nodes}
          pathPoints={pathPoints}
          visibleLeaves={visibleLeaves}
          onLeafClick={onLeafClick}
        />
        <CarAnimation pathPoints={pathPoints} scrollProgress={scrollProgress} onNodeReached={onNodeReached} />
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          enableRotate={isFreeRotate}
          maxPolarAngle={isFreeRotate ? Math.PI : Math.PI / 2}
          minPolarAngle={isFreeRotate ? 0 : Math.PI / 6}
        />
      </ResponsiveScene>
    </Canvas>
  );
}

// Right Side Panel component
const RightSidePanel = ({ revealedNodes }) => {
  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      bottom: '60px', // Adjust this value to the footer's height
      width: '30%',
      maxWidth: '500px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '20px',
      overflowY: 'auto',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.3)'
    }}>
      <h2>Moben Haq</h2>
      {revealedNodes.map((node, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>{node.id}</h3>
          {/* Top-level list with icons */}
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {content[node.id].map((leaf, leafIndex) => {
              // Check if there's an icon for this leaf name
              const IconComponent = iconMapping[leaf.name];

              return (
                <li key={leafIndex} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {IconComponent ? (
                      <IconComponent size={20} style={{ marginRight: '8px' }} />
                    ) : (
                      // If no icon, render a default bullet point
                      <span style={{ width: '20px', marginRight: '8px', textAlign: 'center' }}>•</span>
                    )}
                    {leaf.url ? (
                      <a
                        href={leaf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                      >
                        {leaf.name}
                      </a>
                    ) : (
                      leaf.name
                    )}
                  </div>
                  {/* Sub-lists retain traditional bullet points */}
                  {leaf.descriptions && (
                    <ul>
                      {leaf.descriptions.map((desc, descIndex) => (
                        <li key={descIndex}>{desc}</li>
                      ))}
                    </ul>
                  )}
                  {leaf.links && (
                    <ul>
                      {leaf.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          {link.beforeText}{' '}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'blue', textDecoration: 'underline' }}
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Main App component
function App() {
  const [nodes, setNodes] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathPoints, setPathPoints] = useState([]);
  const [visibleLeaves, setVisibleLeaves] = useState([]);
  const [revealedNodes, setRevealedNodes] = useState([]);
  const [isFreeRotate, setIsFreeRotate] = useState(false); // New state for toggle

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
      const newLeaves = content[nearbyNode.id].map(leaf => `${nearbyNode.id}-${leaf.name}`);
      setVisibleLeaves(prevLeaves => [...new Set([...prevLeaves, ...newLeaves])]);

      // Add the newly revealed node to the revealedNodes state
      setRevealedNodes(prevNodes => {
        if (!prevNodes.find(node => node.id === nearbyNode.id)) {
          return [...prevNodes, nearbyNode];
        }
        return prevNodes;
      });
    }
  };

  const handleLeafClick = (nodeId, leaf) => {
    if (leaf.url) {
      window.open(leaf.url, '_blank');
    } else if (leaf.links && leaf.links.length > 0) {
      const firstLink = leaf.links[0];
      window.open(firstLink.url, '_blank');
    }
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main content area */}
      <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'row' }}>
        {/* Left Side: 3D Visualization */}
        <div style={{ width: '70%', position: 'relative' }}>
          {/* Fixed position items inside the left side */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '70%',
            height: '100%',
          }}>
            <CombinedVisualization
              nodes={nodes}
              scrollProgress={scrollProgress}
              pathPoints={pathPoints}
              visibleLeaves={visibleLeaves}
              onNodeReached={handleNodeReached}
              onLeafClick={handleLeafClick}
              isFreeRotate={isFreeRotate}
            />
          </div>

          {/* Toggle Switch */}
          <div style={{
            position: 'fixed',
            bottom: '60px',
            left: '20px',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '5px',
          }}>
            <Switch
              checked={isFreeRotate}
              onChange={(e) => setIsFreeRotate(e.target.checked)}
            />
            <span>{isFreeRotate ? 'Free Rotate' : 'Rotation Locked'}</span>
          </div>

          {/* Scrollable Content Spacer */}
          <div style={{ height: '400vh' }} />
        </div>

        {/* Right Side Panel */}
        <RightSidePanel revealedNodes={revealedNodes} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
