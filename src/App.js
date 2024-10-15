import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Switch, IconButton } from '@mui/material';
import { useSpring, animated } from '@react-spring/three';
import { FaLinkedin, FaGithub, FaAws } from 'react-icons/fa';
import { SiReact, SiAngular, SiPython, SiGo, SiJavascript, SiCplusplus, SiTerraform, SiGitlab, SiMicrosoftazure } from 'react-icons/si';
import { Typewriter } from 'react-simple-typewriter';
import MenuIcon from '@mui/icons-material/Menu';


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
      links: [
        { beforeText: 'View the', text: 'Certification', url: 'https://www.credly.com/badges/2be8519a-87bb-4da7-bade-026d50109a5c/public_url' },
      ],
    },
    {
      name: 'AWS SysOps Administrator',
      links: [
        { beforeText: 'View the', text: 'Certification', url: 'https://www.credly.com/badges/3611f19e-cfb4-4633-a5ea-1a095da9f9fd/public_url' },
      ],
    },
    {
      name: 'Azure Administrator',
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
      links: [
        { beforeText: '', text: '(951) 337-8563', url: 'tel:+19513378563' },
      ],
    },
    {
      name: 'Email',
      links: [
        { beforeText: '', text: 'moben.h@outlook.com', url: 'mailto:moben.h@outlook.com' },
      ],
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/moben-haq',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/mobenh',
    },
  ],
};

// Define the icon mapping
const iconMapping = {
  // Frameworks
  'React': <SiReact size={20} style={{ marginLeft: '8px' }} />,
  'Angular': <SiAngular size={20} style={{ marginLeft: '8px' }} />,

  // Languages
  'Python': <SiPython size={20} style={{ marginLeft: '8px' }} />,
  'Golang': <SiGo size={20} style={{ marginLeft: '8px' }} />,
  'JavaScript': <SiJavascript size={20} style={{ marginLeft: '8px' }} />,
  'C++': <SiCplusplus size={20} style={{ marginLeft: '8px' }} />,

  // Infrastructure
  'Terraform': <SiTerraform size={20} style={{ marginLeft: '8px' }} />,
  'AWS': <FaAws size={20} style={{ marginLeft: '8px' }} />, // Use FaAws here
  'Gitlab': <SiGitlab size={20} style={{ marginLeft: '8px' }} />,
  'Azure': <SiMicrosoftazure size={20} style={{ marginLeft: '8px' }} />,
};

// Define the Footer component within App.js
function Footer({ theme, isMobile }) {
  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60px',
    backgroundColor: theme.footerBackground,
    color: theme.footerText,
    padding: isMobile ? '2px 0 0 0' : '0 20px',
    boxSizing: 'border-box',
    display: isMobile ? 'block' : 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.secondary}`,
    textAlign: 'center',
  };

  const linkContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'center' : 'flex-start',
    marginTop: isMobile ? '10px' : '0',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: theme.footerText,
    marginLeft: '15px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s',
  };

  const linkHoverColor = theme.linkHoverColor;

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
          href="https://github.com/mobenh"
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
const NodeDiagram = ({ nodes, pathPoints, boxPosition = [0, 0.25, 0], visibleLeaves, onLeafClick, theme }) => {
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
          theme={theme}
        />
      ))}
      <Line
        points={pathPoints}
        color={theme.lineColor} // Use theme.lineColor here
        lineWidth={2}
        dashed={false}
      />
    </group>
  );
};

// Node component with hover and appearance animations
const Node = ({ node, groupRef, camera, visibleLeaves, onLeafClick, theme }) => {
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

  const hoveredColor = hovered ? theme.hoverColor : theme.nodeColor;

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
      <Text position={[0, 0.25, 0.07]} fontSize={0.25} color={theme.text}>
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
              theme={theme}
            />
          );
        }
        return null;
      })}
    </animated.group>
  );
};

// Leaf component with hover and appearance animations
const Leaf = ({ nodeId, leaf, position, onLeafClick, theme }) => {
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

  const hoveredColor = hovered ? theme.hoverColor : theme.nodeColor;

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
      <Text position={[position[0], position[1], 0.05]} fontSize={0.175} color={theme.text}>
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

const NameTag = ({ theme }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',  // Adjust this value if you need it closer or further from the top
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: theme.text,
        zIndex: 10,
        pointerEvents: 'none', // Prevents interaction issues with the 3D canvas
      }}
    >
      <h1 style={{ fontSize: '2rem', margin: 0 }}>
        Moben Haq
      </h1>
      <p
        style={{
          fontSize: '1rem',
          color: theme.accent,
          fontFamily: '"Courier New", Courier, monospace',
        }}
      >
        <Typewriter
          words={[
            'Developing my way into the future',
            'Delivering clean code...',
            'Crafting beautiful interfaces...',
          ]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={50}
          deleteSpeed={80}
          delaySpeed={10000}
        />
      </p>
    </div>
  );
};


// CombinedVisualization component
function CombinedVisualization({
  nodes,
  scrollProgress,
  pathPoints,
  visibleLeaves,
  onNodeReached,
  onLeafClick,
  isFreeRotate,
  theme,
}) {
  const controlsRef = useRef();

  // State to track if the device supports hover (i.e., mouse)
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover)');
    setIsHoverable(mql.matches);

    const handleChange = (e) => {
      setIsHoverable(e.matches);
    };

    // Listen for changes to the hover media query
    mql.addEventListener('change', handleChange);

    return () => {
      mql.removeEventListener('change', handleChange);
    };
  }, []);

  // Decide the style based on hover capability
  const canvasStyle = isHoverable
    ? {}
    : { pointerEvents: isFreeRotate ? 'auto' : 'none' };

  return (
    <Canvas style={canvasStyle}>
      <ResponsiveScene isFreeRotate={isFreeRotate}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <NodeDiagram
          nodes={nodes}
          pathPoints={pathPoints}
          visibleLeaves={visibleLeaves}
          onLeafClick={onLeafClick}
          theme={theme}
        />
        <CarAnimation pathPoints={pathPoints} scrollProgress={scrollProgress} onNodeReached={onNodeReached} />
        <OrbitControls
          ref={controlsRef}
          enabled={isFreeRotate}
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
const RightSidePanel = ({ revealedNodes, theme, isMobile, onClose }) => {
  const panelStyle = {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: isMobile ? 0 : '60px',
    width: isMobile ? '90%' : '30%',
    maxWidth: '500px',
    backgroundColor: theme.panelBackground,
    color: theme.panelText,
    padding: '20px',
    overflowY: 'auto',
    boxShadow: isMobile ? 'none' : '-2px 0 5px rgba(0,0,0,0.3)',
    zIndex: 100, // Ensure it's above other elements
  };


  const headerStyle = {
    color: theme.panelText,
    fontSize: isMobile ? '1.2rem' : '1.5rem',
  };

  const listItemStyle = {
    fontSize: isMobile ? '0.9rem' : '1rem',
  };

  const overlayStyle = isMobile
    ? {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 99,
    }
    : {};

  return (
    <>
      {isMobile && <div style={overlayStyle} onClick={onClose} />}
      <div style={panelStyle}>
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 101,
              backgroundColor: theme.primary,
              color: theme.text,
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            Close
          </button>
        )}
        {revealedNodes.map((node, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3 style={headerStyle}>{node.id}</h3>
            <ul>
              {content[node.id].map((leaf, leafIndex) => (
                <li key={leafIndex} style={listItemStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', color: theme.panelText }}>
                    {leaf.url ? (
                      <a
                        href={leaf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.primary, textDecoration: 'underline', display: 'flex', alignItems: 'center' }}
                      >
                        {leaf.name}
                        {iconMapping[leaf.name]}
                      </a>
                    ) : (
                      <>
                        {leaf.name}
                        {iconMapping[leaf.name]}
                      </>
                    )}
                  </span>
                  {leaf.descriptions && (
                    <ul>
                      {leaf.descriptions.map((desc, descIndex) => (
                        <li key={descIndex} style={{ color: theme.panelText }}>{desc}</li>
                      ))}
                    </ul>
                  )}
                  {leaf.links && (
                    <ul>
                      {leaf.links.map((link, linkIndex) => (
                        <li key={linkIndex} style={{ color: theme.panelText }}>
                          {link.beforeText}{' '}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: theme.primary, textDecoration: 'underline' }}
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

// Main App component
function App() {
  const [nodes, setNodes] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pathPoints, setPathPoints] = useState([]);
  const [visibleLeaves, setVisibleLeaves] = useState([]);
  const [revealedNodes, setRevealedNodes] = useState([]);
  const [isFreeRotate, setIsFreeRotate] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const controlsRef = useRef(); // <-- Reference for OrbitControls


  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define themes
  const lightTheme = {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#2196F3',
    secondary: '#F0F0F0',
    accent: '#BB86FC',
    footerBackground: '#F0F0F0',
    footerText: '#121212',
    panelBackground: 'rgba(255, 255, 255, 0.8)',
    panelText: '#000000',
    nodeColor: '#F0F0F0',
    hoverColor: '#2196F3',
    linkHoverColor: '#BB86FC',
    lineColor: 'black',
  };

  const darkTheme = {
    background: '#595858',
    text: '#e0e0e0',
    primary: '#BB86FC',
    secondary: '#333333',
    accent: '#03DAC6',
    footerBackground: '#121212',
    footerText: '#e0e0e0',
    panelBackground: 'rgba(0, 0, 0, 0.8)',
    panelText: '#e0e0e0',
    nodeColor: '#333333',
    hoverColor: '#014a43',
    linkHoverColor: '#03DAC6',
    lineColor: '#03DAC6',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Scroll handling to update scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);

      // Disable OrbitControls pointer events when rotation is locked
      if (controlsRef.current && !isFreeRotate) {
        controlsRef.current.enabled = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFreeRotate]); // <-- Ensure `isFreeRotate` is used here


  // Save isDarkMode to localStorage
  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  // Load isDarkMode from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'true');
    }
  }, []);

  // Set body background color
  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }, [theme]);

  const generateCoordinates = () => {
    const nodeIds = Object.keys(content);
    const cornerPoints = [];
    let currentZ = 0;
    let currentX = 0;
    const Z_INCREMENT = 3.5;
    const X_OFFSET = -6;

    // Step 1: Generate corner points
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
    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listeners for better performance

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

      // Automatically open the panel when the car reaches the last node
      if (nearbyNode.id === nodes[nodes.length - 1].id) {
        setIsPanelOpen(true);
      }
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

  // Handle menu click
  const handleMenuClick = () => {
    setIsPanelOpen(true);
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleMenuClick}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 11,
            color: theme.text,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Main content area */}
      <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Left Side: 3D Visualization */}
        <div style={{ width: isMobile ? '100%' : '70%', position: 'relative' }}>
          {/* Fixed position items inside the left side */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: isMobile ? '100%' : '70%',
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
              theme={theme}
            />
            <NameTag theme={theme} />
          </div>


          {/* Toggle Switches */}
          <div style={{
            position: 'fixed',
            bottom: '60px',
            left: '20px',
            zIndex: 2,
            backgroundColor: theme.panelBackground,
            color: theme.panelText,
            padding: '10px',
            borderRadius: '5px',
          }}>
            <div>
              <Switch
                checked={isFreeRotate}
                onChange={(e) => setIsFreeRotate(e.target.checked)}
              />
              <span>{isFreeRotate ? 'Free Rotate' : 'Rotation Locked'}</span>
            </div>
            <div>
              <Switch
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
              />
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
          </div>

          {/* Scrollable Content Spacer */}
          <div style={{ height: '400vh' }} />
        </div>

        {/* Right Side Panel */}
        {isMobile ? (
          isPanelOpen && (
            <RightSidePanel
              revealedNodes={revealedNodes}
              theme={theme}
              isMobile={isMobile}
              onClose={() => setIsPanelOpen(false)}
            />
          )
        ) : (
          <RightSidePanel
            revealedNodes={revealedNodes}
            theme={theme}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Footer */}
      <Footer theme={theme} isMobile={isMobile} />
    </div>
  );
}

export default App;
