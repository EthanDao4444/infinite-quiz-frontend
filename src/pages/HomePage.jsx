// src/components/IntroScreen.js
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, GridHelper } from "@react-three/drei";

const phrases = [
  "Who are you?",
  "Can I stay next to you?",
  "Do you like me?",
  "What is it that you wish for?",
  "What is that you want?",
  "What am I?",
];

function Neon3DText() {
  const textRef = useRef();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  // Cycle phrases every 4 seconds with fade out/in
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setOpacity(0);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % phrases.length);
        // Fade in
        setOpacity(1);
      }, 800); // fade duration
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(clock.elapsedTime / 3) * 0.1;
      textRef.current.rotation.x = Math.sin(clock.elapsedTime / 4) * 0.05;
    }
  });

  const layers = [
    { color: "#FF00C8", offset: [0.03, -0.03, 0.02] },
    { color: "#00FFF7", offset: [-0.03, 0.03, -0.02] },
    { color: "#FF00A5", offset: [0.06, -0.06, 0.04] },
    { color: "#00F4FF", offset: [-0.06, 0.06, -0.04] },
  ];

  return (
    <group ref={textRef} position={[0, 0, 0]} >
      {layers.map(({ color, offset }, i) => (
        <Text
          key={i}
          position={offset}
          fontSize={1}
          color={color}
          strokeWidth={0.1}
          strokeColor="#000"
          anchorX="center"
          anchorY="middle"
          depthWrite={false}
          // apply opacity for fade effect
          material-opacity={opacity}
          transparent={true}
        >
          {phrases[phraseIndex]}
        </Text>
      ))}

      <Text
        fontSize={1}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        depthWrite={false}
        material-opacity={opacity}
        transparent={true}
      >
        {phrases[phraseIndex]}
      </Text>
    </group>
  );
}

export default function IntroScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/quiz");
  };

  return (
    <>
      {/* Fullscreen Canvas background */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          background: "#120036",
        }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} color="#00ffff" />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ff00ff" />
        <gridHelper args={[10, 20, "#00ffff", "#002233"]} rotation={[-Math.PI / 2, 0, 0]} />
        <Neon3DText />
      </Canvas>

      {/* UI Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          marginTop: "10vh",
          color: "white",
          fontFamily: "'Orbitron', monospace",
          userSelect: "none",
        }}
      >
        <h1>Welcome to the Infinite Personality Quiz</h1>
        <p>There are no results. There is only the journey.</p>
        <button
          onClick={handleStart}
          style={{
            fontSize: "1.2rem",
            padding: "0.6em 1.2em",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#00ffff",
            color: "#120036",
            fontWeight: "700",
            boxShadow: "0 0 10px #00ffff",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00cccc")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#00ffff")}
        >
          Begin
        </button>
      </div>
    </>
  );
}
