import React, { useState, useEffect } from "react";
import styles from "./QuestionCard.module.css";
import SineWavesBackground from "../SineWavesBackground";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import QuadrantAnswer from "./QuadrantAnswer";
import ProgressBar from "./ProgressBar/ProgressBar";
import useTransitionAnimation from "./UseTransitionAnimation";
import getRandomColor from "../../../utils/getRandomColor";
import { MaxEquation, RGBA_ASTC_10x10_Format } from "three";

export default function QuestionCard({ quiz, index, onNext }) {
  const [bgColor, setBgColor] = useState(getRandomColor());
  const { isTransitioning, transitionProgress, triggerTransition } =
    useTransitionAnimation(() => onNext());
  console.log(quiz)
  useEffect(() => {
    setBgColor(getRandomColor());
  }, [index]);

  return (
    <div className={styles.cardContainer}>
      <SineWavesBackground backgroundColor={bgColor} degradation={quiz.degradation} />

      <div className={styles.questionWrapper}>
        <ProgressBar current={index + 1} total={Math.max(25, index + 5)} />
        <h2 className={styles.questionText}>Q{index + 1}: {quiz.question}</h2>
      </div>

      <div className={styles.canvasWrapper}>
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} />
          <Environment preset="sunset" />
          <OrbitControls enableZoom={false} enableRotate={false} />

          {quiz.answers.slice(0, 4).map((answer, i) => (
            <QuadrantAnswer key={i} index={i} answer={answer} onClick={triggerTransition} />
          ))}
        </Canvas>
      </div>

      {isTransitioning && (
        <>
          <div
            className={styles.transitionOverlay}
            style={{
              opacity: transitionProgress,
              backdropFilter: `blur(${transitionProgress * 10}px)`,
            }}
          />
          <div className={styles.interactionBlocker} />
        </>
      )}
    </div>
  );
}