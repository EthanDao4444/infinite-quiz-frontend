import React from "react";
import styles from "./ProgressBar.module.css";

export default function ProgressBar({ current, total }) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={styles.progressContainer}>
      <div
        className={styles.progressFill}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
