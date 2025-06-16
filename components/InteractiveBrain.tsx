// src/components/InteractiveBrain.tsx
'use client'

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

const InteractiveBrain: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredPart, setHoveredPart] = useState<string>('None');
  const [loading, setLoading] = useState<boolean>(true);

  // Store variables that shouldn't trigger re-renders in refs
  // Note the explicit typing for refs that can be null initially.
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const outlinePassRef = useRef<OutlinePass | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const brainPartsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let lastHovered: THREE.Object3D | null = null;

    // === Basic Scene Setup ===
    const scene = sceneRef.current;
    scene.background = new THREE.Color(0x1a1a2a);

    cameraRef.current = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    cameraRef.current.position.z = 15;
    const camera = cameraRef.current; // Create a local const for easier access

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(currentMount.clientWidth, currentMount.clientHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(rendererRef.current.domElement);
    const renderer = rendererRef.current;

    // === Lights ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // === Controls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // === Post-processing for Glow Effect ===
    composerRef.current = new EffectComposer(renderer);
    const composer = composerRef.current;
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePassRef.current = new OutlinePass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), scene, camera);
    const outlinePass = outlinePassRef.current;
    outlinePass.edgeStrength = 5.0;
    outlinePass.edgeGlow = 0.7;
    outlinePass.edgeThickness = 1.5;
    outlinePass.pulsePeriod = 0;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#2222ff');
    composer.addPass(outlinePass);
    
    // === Model Loader ===
    const loader = new GLTFLoader();
    loader.load(
      '/human_brain.glb', // Path in the public folder
      (gltf: GLTF) => {
        const model = gltf.scene;
        model.scale.set(0.8, 0.8, 0.8);
        model.position.set(0, -5, 0);
        
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.metalness = 0.3;
            child.material.roughness = 0.6;
            brainPartsRef.current.push(child);
          }
        });
        
        scene.add(model);
        setLoading(false);
      },
      undefined,
      (error: ErrorEvent) => {
        console.error('An error happened while loading the model:', error);
        setLoading(false);
      }
    );
    
    // === Mouse Move Event for Raycasting ===
    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // === Animation Loop ===
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(brainPartsRef.current, false);

      if (intersects.length > 0) {
        const firstIntersected = intersects[0].object;
        if (lastHovered !== firstIntersected) {
          outlinePass.selectedObjects = [firstIntersected];
          setHoveredPart(firstIntersected.name || 'Unknown Part');
          lastHovered = firstIntersected;
        }
      } else {
        if (lastHovered) {
          outlinePass.selectedObjects = [];
          setHoveredPart('None');
          lastHovered = null;
        }
      }
      
      composer.render();
    };
    animate();

    // === Handle Window Resize ===
    const handleResize = () => {
      const { clientWidth, clientHeight } = currentMount;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      composer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // === Cleanup ===
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      // Check if currentMount and renderer exist before trying to remove the child
      if (currentMount && renderer) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div style={styles.loadingOverlay}>
          <p>Loading Brain Model...</p>
        </div>
      )}
      <div style={styles.infoBox}>
        <p>Hovered Part: <strong>{hoveredPart}</strong></p>
        <p style={styles.credits}>
          3D Model by <a href="https://sketchfab.com/Shaurya" target="_blank" rel="noopener noreferrer">Shaurya</a> on Sketchfab
        </p>
      </div>
    </div>
  );
};

// We can type the styles object for better autocompletion and safety.
const styles: { [key: string]: React.CSSProperties } = {
  infoBox: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
    fontSize: '16px',
    zIndex: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '24px',
    zIndex: 20,
  },
  credits: {
    fontSize: '12px',
    marginTop: '10px',
    opacity: 0.7,
  }
};

export default InteractiveBrain;