// components/GoalsComponent.js
'use client';

import { useState } from 'react';
import styles from '../Styles/goals.module.css';

export default function GoalsComponent() {
  const [goals, setGoals] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const [newSubsteps, setNewSubsteps] = useState(['']);

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric' };
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

  const handleSubmitGoal = (e) => {
    e.preventDefault();
    if (newGoalTitle && newGoalDate) {
      const filteredSubsteps = newSubsteps.filter(step => step.trim() !== '');
      setGoals([...goals, { 
        id: Date.now(), 
        title: newGoalTitle, 
        date: newGoalDate,
        substeps: filteredSubsteps.map(step => ({ text: step, completed: false })),
        completed: false
      }]);
      handleCancelGoal();
    }
  };

  const handleFinishGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleCompleteSubstep = (goalId, substepIndex) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedSubsteps = [...goal.substeps];
        updatedSubsteps[substepIndex].completed = !updatedSubsteps[substepIndex].completed;
        return { ...goal, substeps: updatedSubsteps };
      }
      return goal;
    }));
  };

  const calculateProgress = (substeps) => {
    const completedSteps = substeps.filter(step => step.completed).length;
    return (completedSteps / substeps.length) * 100;
  };

  return (
    <div className={styles.goalsContainer}>
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
          <button type="submit" className={styles.submitGoalButton}>Create Goal</button>
        </form>
      )}

      <div className={styles.goalsList}>
        {goals.map(goal => (
          <div key={goal.id} className={styles.goalItem}>
            <h3 className={styles.goalTitle}>{goal.title}</h3>
            <p>Due: {formatDate(goal.date)}</p>
            {goal.substeps.length > 0 && (
              <>
                <div className={styles.substepsList}>
                  {goal.substeps.map((substep, index) => (
                    <div key={index} className={`${styles.substep} ${substep.completed ? styles.completed : ''}`}>
                      <span>{substep.text}</span>
                      <button onClick={() => handleCompleteSubstep(goal.id, index)} className={styles.completeSubstepButton}>
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
            <button onClick={() => handleFinishGoal(goal.id)} className={styles.finishGoalButton}>Finished</button>
          </div>
        ))}
      </div>
    </div>
  );
}