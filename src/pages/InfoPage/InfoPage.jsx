// src/components/InfoPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InfoPage.module.css";

export default function InfoPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    job: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const hashString = (str) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const seed = `${formData.name}-${formData.age}-${formData.job}`;
    const hash = hashString(seed);

    // Store metadata in localStorage
    localStorage.setItem(`flower:${hash}`, JSON.stringify(formData));

    navigate(`/flower/${hash}`);
  };

  return (
    <div className={styles.container}>
      <h2>Please fill in your info</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
          />
        </label>
        <label>
          Dream job:
          <input
            type="text"
            name="job"
            value={formData.job}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
