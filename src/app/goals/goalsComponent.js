'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGoals, updateGoal, removeGoal } from '../actions';
import styles from '../Styles/goals.module.css';

export default function GoalsComponent() {
  const [goals, setGoals] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [newSubsteps, setNewSubsteps] = useState(['']);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
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
      console.error('Error fetching goals:', error);
      setError('Failed to fetch goals. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleAddGoal = () => {
    setShowInput(true);
  };

  const handleCancelGoal = () => {
    setShowInput(false);
    setNewGoalTitle('');
    setNewGoalDate('');
    setNewSubsteps(['']);
  };

  const handleAddSubstep = () => {
    setNewSubsteps([...newSubsteps, '']);
  };

  const handleSubstepChange = (index, value) => {
    const updatedSubsteps = [...newSubsteps];
    updatedSubsteps[index] = value;
    setNewSubsteps(updatedSubsteps);
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalDate) {
      alert('Please fill both name and date fields.');
      return;
    }
    setIsCreating(true);
    const filteredSubsteps = newSubsteps.filter(step => step.trim() !== '');
    const newGoal = { 
      title: newGoalTitle.trim(), 
      date: newGoalDate,
      substeps: filteredSubsteps.map(step => ({ text: step.trim(), completed: false })),
      completed: false
    };
    try {
      await updateGoal(user.id, newGoal);
      await fetchGoals();
      handleCancelGoal();
    } catch (error) {
      console.error('Error adding goal:', error);
      setError('Failed to add goal. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFinishGoal = async (goalTitle) => {
    try {
      await removeGoal(user.id, goalTitle);
      await fetchGoals();
    } catch (error) {
      console.error('Error removing goal:', error);
      setError('Failed to remove goal. Please try again.');
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
      setError('Failed to update goal. Please try again.');
    }
  };

  const calculateProgress = (substeps) => {
    if (!substeps || substeps.length === 0) return 0;
    const completedSteps = substeps.filter(step => step.completed).length;
    return (completedSteps / substeps.length) * 100;
  };

  return (
    <div className={styles.goalsContainer}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.goalButtons}>
        <button onClick={handleAddGoal} className={styles.addGoalButton}>Add Goal</button>
        {showInput && <button onClick={handleCancelGoal} className={styles.cancelGoalButton}>Cancel</button>}
      </div>
      
      {showInput && (
        <form onSubmit={handleSubmitGoal} className={styles.goalForm}>
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Goal Title"
            className={styles.goalInput}
          />
          <input
            type="date"
            value={newGoalDate}
            onChange={(e) => setNewGoalDate(e.target.value)}
            className={styles.goalInput}
          />
          {newSubsteps.map((substep, index) => (
            <input
              key={index}
              type="text"
              value={substep}
              onChange={(e) => handleSubstepChange(index, e.target.value)}
              placeholder={`Substep ${index + 1} (optional)`}
              className={styles.goalInput}
            />
          ))}
          <button type="button" onClick={handleAddSubstep} className={styles.addSubstepButton}>Add Substep</button>
          <button type="submit" className={styles.submitGoalButton} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Goal'}
          </button>
        </form>
      )}

      <div className={styles.goalsList}>
        {goals.map((goal, goalIndex) => (
          <div key={`goal-${goalIndex}-${goal.title}`} className={styles.goalItem}>
            <h3 className={styles.goalTitle}>{goal.title}</h3>
            <p>Due: {formatDate(goal.date)}</p>
            {goal.substeps && goal.substeps.length > 0 && (
              <>
                <div className={styles.substepsList}>
                  {goal.substeps.map((substep, substepIndex) => (
                    <div key={`substep-${goalIndex}-${substepIndex}`} className={`${styles.substep} ${substep.completed ? styles.completed : ''}`}>
                      <span>{substep.text}</span>
                      <button onClick={() => handleCompleteSubstep(goalIndex, substepIndex)} className={styles.completeSubstepButton}>
                        {substep.completed ? 'Undo' : 'Complete'}
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${calculateProgress(goal.substeps)}%` }}></div>
                </div>
                {calculateProgress(goal.substeps) === 100 && <p className={styles.doneMessage}>Done!</p>}
              </>
            )}
            <button onClick={() => handleFinishGoal(goal.title)} className={styles.finishGoalButton}>Finished</button>
          </div>
        ))}
      </div>
    </div>
  );
}