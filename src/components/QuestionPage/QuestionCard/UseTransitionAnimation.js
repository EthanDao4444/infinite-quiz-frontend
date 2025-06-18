import { useState } from "react";

export default function useTransitionAnimation(onComplete) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  const triggerTransition = () => {
    setIsTransitioning(true);
    let progress = 0;

    const interval = setInterval(() => {
      progress += 0.05;
      setTransitionProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        setIsTransitioning(false);
        setTransitionProgress(0);
        onComplete();
      }
    }, 50);
  };

  return { isTransitioning, transitionProgress, triggerTransition };
}
