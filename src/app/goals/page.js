"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getGoals, updateGoal, removeGoal, getAllSkills } from "../actions";
import { NavBar } from "../../../Components/NavBar";
import styles from "../Styles/goals.module.css";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    date: "",
    substeps: [""],
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const fetchedGoals = await getGoals(user.id);
      setGoals(Array.isArray(fetchedGoals) ? fetchedGoals : []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubstepChange = (index, value) => {
    const updatedSubsteps = [...newGoal.substeps];
    updatedSubsteps[index] = value;
    setNewGoal((prev) => ({ ...prev, substeps: updatedSubsteps }));
  };

  const addSubstep = () => {
    setNewGoal((prev) => ({ ...prev, substeps: [...prev.substeps, ""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.date) {
      alert("Please fill in both the title and date fields.");
      return;
    }
    try {
      const goalToAdd = {
        ...newGoal,
        substeps: newGoal.substeps
          .filter((step) => step.trim() !== "")
          .map((step) => ({ text: step, completed: false })),
      };
      await updateGoal(user.id, goalToAdd);
      setShowForm(false);
      setNewGoal({ title: "", date: "", substeps: [""] });
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Failed to add goal. Please try again.");
    }
  };

  const handleCompleteSubstep = async (goalIndex, substepIndex) => {
    const updatedGoals = [...goals];
    const goal = updatedGoals[goalIndex];
    goal.substeps[substepIndex].completed = !goal.substeps[substepIndex].completed;

    try {
      await updateGoal(user.id, goal);
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleFinishGoal = async (goalTitle) => {
    try {
      await removeGoal(user.id, goalTitle);
      fetchGoals();
    } catch (error) {
      console.error("Error removing goal:", error);
    }
  };

  const calculateProgress = (substeps) => {
    if (!substeps || substeps.length === 0) return 0;
    const completedSteps = substeps.filter((step) => step.completed).length;
    return (completedSteps / substeps.length) * 100;
  };

  const generateGoal = async () => {
    try {
      // Fetch user data
      const goals = await getGoals(user.id);
      const skills = await getAllSkills(user.id);
  
      const context = `
        User's current goals: ${JSON.stringify(goals)}
        User's skills: ${JSON.stringify(skills)}
        Generate a new goal for the user based on their current goals and skills. The goal should be challenging but achievable, and align with their current skillset and aspirations.
      `;
  
      const response = await fetch("/navigrowth-education-and-career-management/api/ai", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context, prompt: "Generate a new goal" }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Received data from AI:", data);  // Log the received data
  
      if (data && typeof data === 'object' && data.title && data.date && Array.isArray(data.substeps)) {
        setNewGoal({
          title: data.title,
          date: data.date,
          substeps: data.substeps.map(step => typeof step === 'string' ? step : ""),
        });
        setShowForm(true);
      } else {
        console.error("Invalid data structure received from AI:", data);
        alert("Failed to generate a valid goal structure. Please try again.");
      }
    } catch (error) {
      console.error("Error generating goal:", error);
      alert(`Failed to generate goal: ${error.message}. Please try again.`);
    }
  };
  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <div className={styles.contentArea}>
        <div className={styles.goalsContainer}>
          <header className={styles.goalsHeader}>
            <h1 className={styles.goalsTitle}>Goals</h1>
          </header>
          <button
            className={styles.addGoalButton}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Goal"}
          </button>
          <button className={styles.addGoalButton} onClick={generateGoal}>
            Generate New Goal
          </button>
          {showForm && (
            <form className={styles.goalForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="title">
                  Goal Title:
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newGoal.title}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="date">
                  Due Date:
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newGoal.date}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              {newGoal.substeps.map((substep, index) => (
                <div key={index} className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor={`substep-${index}`}>
                    Substep {index + 1}:
                  </label>
                  <input
                    type="text"
                    id={`substep-${index}`}
                    value={substep.text || substep}
                    onChange={(e) => handleSubstepChange(index, e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSubstep}
                className={styles.addSubstepButton}
              >
                Add Substep
              </button>
              <button type="submit" className={styles.submitButton}>
                Create Goal
              </button>
            </form>
          )}
          <div className={styles.goalsList}>
            {goals.map((goal, goalIndex) => (
              <div key={`goal-${goalIndex}`} className={styles.goalCard}>
                <h3 className={styles.goalTitle}>{goal.title}</h3>
                <p className={styles.goalDate}>
                  Due: {new Date(goal.date).toLocaleDateString()}
                </p>
                {goal.substeps && goal.substeps.length > 0 && (
                  <>
                    <ul className={styles.substepsList}>
                      {goal.substeps.map((substep, substepIndex) => (
                        <li
                          key={`substep-${substepIndex}`}
                          className={styles.substepItem}
                        >
                          <span
                            className={`${styles.substepText} ${
                              substep.completed ? styles.completed : ""
                            }`}
                          >
                            {substep.text}
                          </span>
                          <button
                            onClick={() => handleCompleteSubstep(goalIndex, substepIndex)}
                            className={styles.completeSubstepButton}
                          >
                            {substep.completed ? "Undo" : "Complete"}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${calculateProgress(goal.substeps)}%`,
                        }}
                      ></div>
                    </div>
                  </>
                )}
                <button
                  onClick={() => handleFinishGoal(goal.title)}
                  className={styles.finishGoalButton}
                >
                  Finish Goal
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}