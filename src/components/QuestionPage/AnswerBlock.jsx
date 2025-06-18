import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export default function AnswerBlock({ answer, onClick, onLoad }) {
  const groupRef = useRef();
  const textRef = useRef();
  const [boxSize, setBoxSize] = useState([2.5, 2.5, 0.5]);
  const [hovered, setHovered] = useState(false);
  const textValue = typeof answer === "string" ? answer : answer.text;

  // 🌀 Generate unique float config per block
  const floatConfig = useMemo(() => ({
    freqX: 0.5 + Math.random() * 0.5,
    freqY: 0.8 + Math.random() * 0.4,
    freqZ: 0.3 + Math.random() * 0.3,
    ampX: 0.5 + Math.random() * 0.4,
    ampY: 0.6 + Math.random() * 0.5,
    ampZ: 0.3 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
  }), []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();

      const floatX = Math.sin(t * floatConfig.freqX + floatConfig.phase) * floatConfig.ampX;
      const floatY = Math.cos(t * floatConfig.freqY + floatConfig.phase) * floatConfig.ampY;
      const floatZ = Math.sin(t * floatConfig.freqZ + floatConfig.phase) * floatConfig.ampZ;

      // Position drift
      groupRef.current.position.x += (floatX - groupRef.current.position.x) * 0.1;
      groupRef.current.position.y += (floatY - groupRef.current.position.y) * 0.1;
      groupRef.current.position.z += (floatZ - groupRef.current.position.z) * 0.1;

      // Hover tilt + scale
      const targetScale = hovered ? 2.3 : 2;
      const targetRotX = hovered ? 0.1 : 0;
      const targetRotY = hovered ? 0.1 : 0;

      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    }
  });

  const handleTextSync = () => {
    if (textRef.current) {
      const size = new THREE.Vector3();
      textRef.current.geometry.computeBoundingBox();
      textRef.current.geometry.boundingBox.getSize(size);
      const paddingX = 0.4;
      const paddingY = 0.6;
      setBoxSize([size.x + paddingX, size.y + paddingY, 0.5]);
      onLoad?.();
    }
  };

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <boxGeometry args={boxSize} />
        <meshStandardMaterial color={hovered ? "#ffa500" : "#61dafb"} />
      </mesh>

      <Text
        font="/fonts/Unifont.otf"
        ref={textRef}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, boxSize[2] / 2 + 0.01]}
        maxWidth={boxSize[0] * 0.9}
        onSync={handleTextSync}
      >
        {textValue}
      </Text>
    </group>
  );
}
