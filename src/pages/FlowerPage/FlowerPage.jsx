import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useParams } from "react-router-dom";
import Garden from "../../components/FlowerPage/Garden";
import FirstPersonGardenControls from "../../components/FlowerPage/FirstPersonGardenControls";
import { Ground } from "../../components/FlowerPage/Ground"; // update path if needed
// import { Player } from "../../components/FlowerPage/Player"; // optional: if you have a Player capsule
// import { Cube, Cubes } from "../../components/FlowerPage/Cube"; // optional

export default function FlowerPage() {
  const { hash } = useParams();
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowRight", "d", "D"] },
          { name: "right", keys: ["ArrowLeft", "a", "A"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '10px',
          height: '10px',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '2px',
            height: '10px',
            background: 'white',
            position: 'absolute',
            left: '4px',
            top: '0'
          }} />
          <div style={{
            width: '10px',
            height: '2px',
            background: 'white',
            position: 'absolute',
            top: '4px',
            left: '0'
          }} />
        </div>
        <Canvas shadows camera={{ fov: 50 }}>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <pointLight castShadow intensity={0.8} position={[10, 10, 10]} />

          <Physics gravity={[0, -30, 0]}>
            <Ground />
            <Garden userHash={hash}/>
            <FirstPersonGardenControls />
            {/* <Player /> */}
            {/* <Cube position={[0, 0.5, -10]} />
            <Cubes /> */}
          </Physics>

          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
