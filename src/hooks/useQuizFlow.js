// src/hooks/useQuizFlow.js
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000/quiz";
const ENDPOINTS = {
  INITIAL: [`${API_BASE}/first_50`, `${API_BASE}/last_50`],
  DIRTY_BATCH: `${API_BASE}/dirty_batch`,
};

export default function useQuizFlow(started) {
  const [quizzes, setQuizzes] = useState([]);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load initial quizzes
  useEffect(() => {
    if (!started || page !== 0) return;

    const fetchInitialQuizzes = async () => {
      try {
        setLoading(true);
        const [firstRes, lastRes] = await Promise.all(
          ENDPOINTS.INITIAL.map((url) => fetch(url).then((res) => res.json()))
        );
        setQuizzes([...firstRes.questions, ...lastRes.questions]);
      } catch (error) {
        console.error("Failed to fetch initial quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialQuizzes();
  }, [started, page]);

  // Load more when reaching near the end
  useEffect(() => {
    const needsMore = index >= quizzes.length - 1;
    if (!started || !needsMore || page === 0) return;

    const fetchMoreQuizzes = async () => {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINTS.DIRTY_BATCH);
        const data = await res.json();
        setQuizzes((prev) => [...prev, ...data.questions]);
      } catch (error) {
        console.error("Error fetching dirty batch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreQuizzes();
  }, [index, page, started, quizzes.length]);

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex >= quizzes.length - 1) {
      setPage((prev) => prev + 1);
    }
    setIndex(nextIndex);
  };

  return { quizzes, index, handleNext, loading };
}
