import React from "react";
import { useThree } from "@react-three/fiber";
import AnswerBlock from "../AnswerBlock";

export default function QuadrantAnswer({ index, answer, onClick }) {
  const { viewport } = useThree();
  const halfW = viewport.width / 2;
  const halfH = viewport.height / 2;
  const quadrantPositions = [
    [-halfW / 2, halfH / 2, 0],
    [halfW / 2, halfH / 2, 0],
    [-halfW / 2, -halfH / 2, 0],
    [halfW / 2, -halfH / 2, 0],
  ];
  const position = quadrantPositions[index] || [0, halfH / 2 - index * 1.5, 0];

  return (
    <group position={position}>
      <AnswerBlock answer={answer} onClick={onClick} />
    </group>
  );
}