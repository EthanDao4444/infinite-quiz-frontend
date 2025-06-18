import React, { useState, useMemo, useEffect } from "react";
import FlowerBillboard from "./FlowerBillboard";
import { Ground } from "./Ground";

// Fake user data generator
const generateFakeUser = () => {
  const names = ["Alex", "Jamie", "Taylor", "Jordan", "Riley", "Morgan"];
  const jobs = ["Astronaut", "Chef", "Painter", "Engineer", "Poet", "Inventor"];
  return {
    name: names[Math.floor(Math.random() * names.length)],
    age: 18 + Math.floor(Math.random() * 50),
    job: jobs[Math.floor(Math.random() * jobs.length)],
  };
};

// Generate randomized but fixed positions
// Generate randomized but fixed positions,
// exclude positions within `excludeRadius` around excludePos
const generateRandomPositions = (count, radius = 8, excludePos = [0, 1, 2.5], excludeRadius = 3) => {
  const positions = [];
  while (positions.length < count) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius + 2;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    
    // Calculate distance to excludePos in XZ plane
    const dx = x - excludePos[0];
    const dz = z - excludePos[2];
    const distToExclude = Math.sqrt(dx * dx + dz * dz);

    // Only add if outside the excludeRadius
    if (distToExclude > excludeRadius) {
      positions.push([x, 1, z]);
    }
  }
  return positions;
};


export default function Garden({ userHash }) {
  const [activeFlower, setActiveFlower] = useState(null);

  // Generate once
  const randomPositions = useMemo(() => generateRandomPositions(60), []);
  const flowerData = useMemo(() => {
    return randomPositions.map((pos, i) => {
      const seed = `flower-${i}`;
      const user = generateFakeUser();
      localStorage.setItem(`flower:${seed}`, JSON.stringify(user));
      return { seed, position: pos };
    });
  }, [randomPositions]);

  // Load real user info once
  useEffect(() => {
    if (userHash && !localStorage.getItem(`flower:${userHash}`)) {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        localStorage.setItem(`flower:${userHash}`, stored);
      }
    }
  }, [userHash]);

  return (
    <>
      <Ground />

      {/* Real user flower */}
      <FlowerBillboard
        position={[0, 1, 2.5]}
        seed={userHash || "default-user"}
        isActive={activeFlower === (userHash || "default-user")}
        setActive={setActiveFlower}
        isUser={true}
      />

      {/* Random fake users' flowers */}
      {flowerData.map(({ seed, position }, i) => (
        <FlowerBillboard
          key={i}
          position={position}
          seed={seed}
          isActive={activeFlower === seed}
          setActive={setActiveFlower}
          isUser={false}
        />
      ))}
    </>
  );
}
