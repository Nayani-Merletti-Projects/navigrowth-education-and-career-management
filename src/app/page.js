"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavBar } from "../../Components/NavBar";
import { useAuth } from "./context/AuthContext";
import { getGoals, updateGoal, removeGoal } from './actions'; // Adjust the path as needed
import styles from "./Styles/Home_Page.css";
import "./Styles/mukta.css";

export default function Home() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (user && user.username) {
      const [name] = user.username.split('|');
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
      console.error('Error fetching goals:', error);
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
      console.error('Error updating goal:', error);
    }
  };

  const handleFinishGoal = async (goalTitle) => {
    try {
      await removeGoal(user.id, goalTitle);
      await fetchGoals();
    } catch (error) {
      console.error('Error removing goal:', error);
    }
  };

  const calculateProgress = (substeps) => {
    if (!substeps || substeps.length === 0) return 0;
    const completedSteps = substeps.filter(step => step.completed).length;
    return (completedSteps / substeps.length) * 100;
  };

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <div>
        <header className="Homepage-header">
          <div className="Website-Title">
            <span className="title-text">NaviGrowth Education</span>
          </div>

          <div className="info-section">
            <Link href="/about">About Us</Link>
          </div>

          <div className="info-section">
            <Link href="/settings">Settings</Link>
          </div>
        </header>

        <main className="body-text">
          <p className="home-msg">Hey There {username || 'Guest'}!</p>
          <span className="homepage-goal-header">GOALS</span>
          <div className="homepage-goal-tracker">
            {goals.length > 0 ? (
              goals.map((goal, goalIndex) => (
                <div key={`goal-${goalIndex}-${goal.title}`} className="goal-item">
                  <h3 className="goal-title">{goal.title}</h3>
                  <p>Due: {formatDate(goal.date)}</p>
                  {goal.substeps && goal.substeps.length > 0 && (
                    <>
                      <div className="substeps-list">
                        {goal.substeps.map((substep, substepIndex) => (
                          <div key={`substep-${goalIndex}-${substepIndex}`} className={`substep ${substep.completed ? 'completed' : ''}`}>
                            <span>{substep.text}</span>
                            <button onClick={() => handleCompleteSubstep(goalIndex, substepIndex)} className="complete-substep-button">
                              {substep.completed ? 'Undo' : 'Complete'}
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${calculateProgress(goal.substeps)}%` }}></div>
                      </div>
                      {calculateProgress(goal.substeps) === 100 && <p className="done-message">Done!</p>}
                    </>
                  )}
                  <button onClick={() => handleFinishGoal(goal.title)} className="finish-goal-button">Finished</button>
                </div>
              ))
            ) : (
              <>
                <p className="no-goals-msg">You are all done!</p>
                <Link href="/goals" className="no-goals-link">
                  Make some new ones!
                </Link>
              </>
            )}
          </div>
        </main>

        <div className="js-navbar"></div>
      </div>
      <NavBar />
    </>
  );
}