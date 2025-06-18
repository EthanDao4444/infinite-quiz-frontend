import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export default function FirstPersonGardenControls({ lerp = THREE.MathUtils.lerp }) {
  const ref = useRef();
  const { world } = useRapier();
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    if (!ref.current) return;

    const { forward, backward, left, right, jump } = get();
    const velocity = ref.current.linvel();
    const position = ref.current.translation();

    // Update camera position
    state.camera.position.set(position.x - 1, position.y + 0.6, position.z + 10);

    // Movement calculation
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    
    direction
      .copy(frontVector)
      .add(sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyQuaternion(state.camera.quaternion);

    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // Raycast for ground detection
    const rayOrigin = new RAPIER.Vector3(position.x, position.y, position.z);
    const rayDir = new RAPIER.Vector3(0, -1, 0);
    const ray = new RAPIER.Ray(rayOrigin, rayDir);

    const hit = world.castRay(ray, 1.75, true);
    const grounded = hit && hit.colliderHandle !== undefined;

    if (jump && grounded) {
      ref.current.setLinvel({ x: velocity.x, y: 7.5, z: velocity.z }, true);
    }
  });

  return (
    <RigidBody
      ref={ref}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 10, 0]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.75, 0.5]} />
    </RigidBody>
  );
}
