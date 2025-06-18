import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExitButton.module.css";

// function hashString(str) {
//   let hash = 5381;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash * 33) ^ str.charCodeAt(i);
//   }
//   return (hash >>> 0).toString(16);
// }

export default function ExitButton({ question, index, degradation = 1 }) {
  const navigate = useNavigate();

  // const handleExit = () => {
  //   const seed = index > 100 
  //     ? "palimpsest"
  //     : `Q${index + 1}: ${question}`;
  //   const hash = hashString(seed);
  //   console.log(`Exited on Q${index + 1} → Flower: ${hash}`);
  //   navigate(`/flower/${hash}`); // ✅ navigates to FlowerPage
  // };
  const handleExit = () => {
    navigate("/info");
  }

  return (
    <button className={styles.exitButton} onClick={handleExit}>
      Exit
    </button>
  );
}