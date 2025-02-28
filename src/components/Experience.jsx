import React, { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Load the model
function Model({ scale }) {
  const { scene } = useGLTF("./public/model/SiittngRmBaked.glb"); // Ensure the model is in 'public/model/'

  scene.traverse((child) => {
    if (child.isMesh) {
      // Make sure the material exists and is not null
      if (child.material) {
        // Handle both single and multi-material meshes
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            console.log(child.material.side);
          });
        } else {
          console.log(child.material.side);
        }
      }
    }
  });
  return <primitive object={scene} scale={[scale, scale, scale]} />;
}

// Resize handling component
function ResizeHandler() {
  const { camera, gl } = useThree(); // Access camera and renderer (gl)

  useEffect(() => {
    const handleResize = () => {
      // Update camera aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Update renderer size and pixel ratio
      gl.setSize(window.innerWidth, window.innerHeight);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, gl]);

  return null; // This component doesn't render anything
}

// Main Experience component
function Experience() {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      {/* Add OrbitControls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.1}
        maxAzimuthAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
        maxDistance={10}
        minDistance={2}
        enablePan={false}
      />

      {/* Handle resizing */}
      <ResizeHandler />

      {/* Ambient and directional lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {/* Load the model */}
      <Suspense fallback={null}>
        <Model scale={3} />
      </Suspense>
    </Canvas>
  );
}

export default Experience;
