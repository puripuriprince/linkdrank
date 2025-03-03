import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Network Graph Background Component
const NetworkGraphBackground = () => {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [debugMessage, setDebugMessage] = useState('');
  
  useEffect(() => {
    if (!containerRef.current) {
      setDebugMessage('Container ref is null');
      return;
    }
    
    // Check for WebGL support first
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setHasWebGL(false);
        setDebugMessage('WebGL not supported');
        console.warn('WebGL not supported - rendering fallback background');
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      setDebugMessage(`WebGL check error: ${e.message}`);
      console.warn('WebGL initialization error:', e);
      return;
    }
    
    // Initialize Three.js scene
    let scene, camera, renderer, animationFrameId;
    
    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
      );
      
      // Create renderer without specifying a canvas yet
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff, 1);
      
      // Append the renderer's DOM element to our container
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderer.domElement);
      
      // Set debug message
      setDebugMessage('Renderer initialized');
      
      // Camera position
      camera.position.z = 30;
      
      // Generate random nodes
      const nodes = [];
      const nodeCount = 30; // Reduced from 40 for performance
      const nodeGeometry = new THREE.SphereGeometry(0.3, 8, 8); // Simplified geometry
      
      const colors = [
        0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF,
        0xFF5500, 0x55FF00, 0x0055FF, 0xFF0055, 0x00FF55, 0x5500FF
      ];
      
      // Create nodes with random positions and colors
      for (let i = 0; i < nodeCount; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        
        const node = new THREE.Mesh(nodeGeometry, material);
        
        // Random position within bounds
        node.position.x = (Math.random() - 0.5) * 50;
        node.position.y = (Math.random() - 0.5) * 30;
        node.position.z = (Math.random() - 0.5) * 20;
        
        scene.add(node);
        nodes.push(node);
      }
      
      setDebugMessage('Nodes created');
      
      // Create connections between nodes
      const connectionsGroup = new THREE.Group();
      scene.add(connectionsGroup);
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.2
      });
      
      // Create connections - not all nodes are connected, random selection
      nodes.forEach((node, i) => {
        // Each node connects to 1-3 other random nodes (reduced for performance)
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < connectionCount; j++) {
          // Pick a random node that isn't this one
          let targetIndex;
          do {
            targetIndex = Math.floor(Math.random() * nodes.length);
          } while (targetIndex === i);
          
          const targetNode = nodes[targetIndex];
          
          // Create line geometry for connection
          const points = [];
          points.push(new THREE.Vector3(node.position.x, node.position.y, node.position.z));
          points.push(new THREE.Vector3(targetNode.position.x, targetNode.position.y, targetNode.position.z));
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMaterial);
          
          connectionsGroup.add(line);
        }
      });
      
      setDebugMessage('Connections created');
      
      // Animation function
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // Rotate the entire scene slightly
        scene.rotation.x += 0.0005;
        scene.rotation.y += 0.0010;
        
        // Subtle movement of nodes - reduced movement for stability
        nodes.forEach((node) => {
          node.position.x += (Math.random() - 0.5) * 0.005;
          node.position.y += (Math.random() - 0.5) * 0.005;
          node.position.z += (Math.random() - 0.5) * 0.005;
        });
        
        // Update only a few connection lines each frame for performance
        if (Math.random() < 0.05) {
          const lineToUpdate = Math.floor(Math.random() * connectionsGroup.children.length);
          const line = connectionsGroup.children[lineToUpdate];
          
          if (line && line.geometry && line.geometry.attributes && line.geometry.attributes.position) {
            const linePositions = line.geometry.attributes.position.array;
            const sourceIndex = Math.floor(Math.random() * nodes.length);
            const targetIndex = Math.floor(Math.random() * nodes.length);
            
            linePositions[0] = nodes[sourceIndex].position.x;
            linePositions[1] = nodes[sourceIndex].position.y;
            linePositions[2] = nodes[sourceIndex].position.z;
            linePositions[3] = nodes[targetIndex].position.x;
            linePositions[4] = nodes[targetIndex].position.y;
            linePositions[5] = nodes[targetIndex].position.z;
            
            line.geometry.attributes.position.needsUpdate = true;
          }
        }
        
        renderer.render(scene, camera);
      };
      
      setDebugMessage('Animation started');
      
      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Start animation
      animate();
      
      // Force initial render to make sure something appears
      renderer.render(scene, camera);
      
      // Cleanup function
      return () => {
        setDebugMessage('Cleaning up');
        window.removeEventListener('resize', handleResize);
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        
        if (renderer) {
          renderer.dispose();
        }
        
        // Dispose of all geometries and materials
        if (nodes) {
          nodes.forEach(node => {
            if (node.geometry) node.geometry.dispose();
            if (node.material) node.material.dispose();
          });
        }
        
        if (connectionsGroup && connectionsGroup.children) {
          connectionsGroup.children.forEach(line => {
            if (line.geometry) line.geometry.dispose();
            if (line.material) line.material.dispose();
          });
        }
      };
    } catch (error) {
      console.error("Error initializing Three.js:", error);
      setHasWebGL(false);
      setDebugMessage(`Three.js error: ${error.message}`);
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, []);
  
  return (
    <>
      {hasWebGL ? (
        <div
          ref={containerRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: '#ffffff'
          }}
        >
          {/* The renderer will append its canvas here */}
        </div>
      ) : (
        // Fallback background when WebGL isn't available
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)'
          }}
        />
      )}
      
      {/* Debug message - only visible during development/debugging */}
      {process.env.NODE_ENV !== 'production' && debugMessage && (
        <div style={{
          position: 'fixed',
          bottom: 10,
          left: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: 5,
          fontSize: 12,
          zIndex: 1000
        }}>
          Debug: {debugMessage}
        </div>
      )}
    </>
  );
};

// Export the component for use in the main Search component
export default NetworkGraphBackground;