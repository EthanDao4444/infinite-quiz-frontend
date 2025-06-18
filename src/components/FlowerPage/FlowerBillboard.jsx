import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture } from "three";
import { generateFlowerCanvas } from "../../utils/generateFlowerCanvas";
import { waterFlower, trampleFlower } from "../../utils/flowerInteractions";
import { Text } from "@react-three/drei";

export default function FlowerBillboard({ position, seed, isActive, setActive, isUser }) {
  const meshRef = useRef();
  const auraRef = useRef();
  const userInfoRef = useRef();
  const buttonsBgRef = useRef();
  const userInfoTextRef = useRef();
  const waterTextRef = useRef();
  const trampleTextRef = useRef();
  const cancelTextRef = useRef();
  const { camera } = useThree();
  const [version, setVersion] = useState(0);
  const [texture, setTexture] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const canvas = generateFlowerCanvas(seed);
    const tex = new CanvasTexture(canvas);
    setTexture(tex);
  }, [seed, version]);

  useEffect(() => {
    const stored = localStorage.getItem(`flower:${seed}`);
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored));
      } catch {
        setUserInfo(null);
      }
    }
  }, [seed]);

  useFrame(() => {
    if (meshRef.current) meshRef.current.lookAt(camera.position);
    if (auraRef.current) auraRef.current.lookAt(camera.position);
    if (userInfoRef.current) userInfoRef.current.lookAt(camera.position);
    if (buttonsBgRef.current) buttonsBgRef.current.lookAt(camera.position);

    // Billboard the Text components separately
    if (userInfoTextRef.current) userInfoTextRef.current.lookAt(camera.position);
    if (waterTextRef.current) waterTextRef.current.lookAt(camera.position);
    if (trampleTextRef.current) trampleTextRef.current.lookAt(camera.position);
    if (cancelTextRef.current) cancelTextRef.current.lookAt(camera.position);
  });

  const handleAction = (action) => {
    if (action === "water") waterFlower(seed);
    else if (action === "trample") trampleFlower(seed);
    setVersion((v) => v + 1);
    setActive(null);
  };

  return (
    <group>
      {(isUser || isActive) && (
        <mesh
          ref={auraRef}
          position={[position[0], position[1] + 0.1, position[2]]}
          scale={[0.5, 1, 1]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={isUser ? "yellow" : "lightblue"}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh ref={meshRef} position={position} onClick={() => setActive(seed)}>
        <planeGeometry args={[1.5, 1.5]} />
        {texture && <meshBasicMaterial map={texture} transparent side={2} color={"white"} />}
      </mesh>

      {isActive && (
        <group
          position={[position[0] + 1, position[1] + 0.2, position[2]]}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {userInfo && (
            <group ref={userInfoRef} position={[0.75, 0.6, 0.01]}>
              <mesh>
                <planeGeometry args={[2.5, 0.6]} />
                <meshBasicMaterial color="white" transparent opacity={0.9} depthTest={false} />
              </mesh>
              <Text
                ref={userInfoTextRef}
                position={[0, 0, 0.01]}
                fontSize={0.2}
                color="black"
                anchorX="center"
                anchorY="middle"
              >
                {userInfo.name}, {userInfo.age} — {userInfo.job}
              </Text>
            </group>
          )}

          <mesh ref={buttonsBgRef} position={[0.75, -0.5, 0]}>
            <planeGeometry args={[2.5, 1.6]} />
            <meshBasicMaterial color="white" transparent opacity={0.9} depthTest={false} />
          </mesh>

          <Text
            ref={waterTextRef}
            position={[0.75, 0.2, 0.01]}
            fontSize={0.25}
            color="blue"
            anchorX="center"
            anchorY="middle"
            onClick={() => handleAction("water")}
          >
            💧 Water
          </Text>
          <Text
            ref={trampleTextRef}
            position={[0.75, -0.2, 0.01]}
            fontSize={0.25}
            color="brown"
            anchorX="center"
            anchorY="middle"
            onClick={() => handleAction("trample")}
          >
            👢 Trample
          </Text>
          <Text
            ref={cancelTextRef}
            position={[0.75, -0.55, 0.01]}
            fontSize={0.2}
            color="gray"
            anchorX="center"
            anchorY="middle"
            onClick={() => setActive(null)}
          >
            ❌ Cancel
          </Text>
        </group>
      )}
    </group>
  );
}
