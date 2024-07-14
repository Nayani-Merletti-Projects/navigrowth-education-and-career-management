// src/app/page.js (Home Page)
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavBar } from "../../Components/NavBar";
import { useAuth } from "./context/AuthContext";
import { getGoals, updateGoal, removeGoal } from "./actions";
import "./styles/Home_Page.css";

export default function Home() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (user && user.username) {
      const [name] = user.username.split("|");
      setUsername(name);
    }
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

  const handleCompleteSubstep = async (goalIndex, substepIndex) => {
    const updatedGoals = [...goals];
    const goal = updatedGoals[goalIndex];
    goal.substeps[substepIndex].completed =
      !goal.substeps[substepIndex].completed;

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
      await fetchGoals();
    } catch (error) {
      console.error("Error removing goal:", error);
    }
  };

  const calculateProgress = (substeps) => {
    if (!substeps || substeps.length === 0) return 0;
    const completedSteps = substeps.filter((step) => step.completed).length;
    return (completedSteps / substeps.length) * 100;
  };

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="main-container">
      <NavBar />
      <div className="content-area">
        <header className="header solarized-light-bg">
          <h1 className="title solarized-light-heading">
            NaviGrowth Education
          </h1>
          {username ? (
            <p className="welcome-message solarized-light-text">
              Welcome, {username}!
            </p>
          ) : (
            <>
              <p className="welcome-message solarized-light-text">
                Welcome, Guest! Get started by logging in or registering first.
              </p>
              <Link href="/login">
                <button
                  className="solarized-light-button"
                  style={{ marginRight: "1vw" }}
                >
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="solarized-light-button">Register</button>
              </Link>
            </>
          )}
        </header>
        <main>
          <section className="goals-section">
            <h2 className="section-title">Your Goals</h2>
            {goals.length > 0 ? (
              <div className="goals-list">
                {goals.map((goal, goalIndex) => (
                  <div
                    key={`goal-${goalIndex}-${goal.title}`}
                    className="goal-card"
                  >
                    <h3 className="goal-title">{goal.title}</h3>
                    <p className="goal-date">Due: {formatDate(goal.date)}</p>
                    {goal.substeps && goal.substeps.length > 0 && (
                      <>
                        <ul className="substeps-list">
                          {goal.substeps.map((substep, substepIndex) => (
                            <li
                              key={`substep-${goalIndex}-${substepIndex}`}
                              className="substep-item"
                            >
                              <span className="substep-text">
                                {substep.text}
                              </span>
                              <button
                                onClick={() =>
                                  handleCompleteSubstep(goalIndex, substepIndex)
                                }
                                className="substep-button"
                              >
                                {substep.completed ? "Undo" : "Complete"}
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${calculateProgress(goal.substeps)}%`,
                            }}
                          ></div>
                        </div>
                        {calculateProgress(goal.substeps) === 100 && (
                          <p className="completion-message">Goal Completed!</p>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => handleFinishGoal(goal.title)}
                      className="finish-button"
                    >
                      Finish Goal
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-goals">
                <p>You have no active goals.</p>
                <Link href="/goals" className="create-goal-link">
                  Create New Goal
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
