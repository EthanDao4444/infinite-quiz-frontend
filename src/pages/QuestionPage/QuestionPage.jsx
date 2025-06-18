// src/pages/QuestionScreen.js
import React from "react";
import QuestionCard from "../../components/QuestionPage/QuestionCard/QuestionCard";
import ExitButton from "../../components/QuestionPage/QuestionCard/ExitButton/ExitButton";
import useQuizFlow from "../../hooks/useQuizFlow";
import styles from './QuestionPage.module.css';

export default function QuestionScreen() {
  const { quizzes, index, handleNext, loading } = useQuizFlow(true);

  if (loading && quizzes.length === 0) return <p>Loading...</p>;
  if (index >= quizzes.length) return <p>No more questions (yet)!</p>;

  const quiz = quizzes[index];

  return (
    <div className={styles.screenWrapper}>
      {/* {
        index >= 20 && <ExitButton question={quiz.question} index={index} degradation={quiz.degradation}/>
      } */}
      <ExitButton question={quiz.question} index={index} degradation={quiz.degradation}/>
      <QuestionCard quiz={quiz} index={index} onNext={handleNext} />
    </div>
  );
}
