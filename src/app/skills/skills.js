"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllSkills, addSkill, removeSkill } from "../actions";
import styles from "../Styles/Skills.module.css";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  const fetchSkills = useCallback(async () => {
    if (user) {
      try {
        console.log("Fetching skills for user:", user.id);
        const fetchedSkills = await getAllSkills(user.id);
        console.log("Fetched skills:", fetchedSkills);
        setSkills(fetchedSkills);
        setError(null);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError("Failed to fetch skills. Please try again.");
      }
    } else {
      console.log("No user found in AuthContext");
    }
  }, [user]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    console.log("Add skill button clicked");
    if (!newSkillName || !newSkillDescription) {
      alert("Please fill in both the skill name and description.");
      return;
    }
    if (user) {
      setIsAdding(true);
      try {
        console.log("Adding skill:", { userId: user.id, newSkillName, newSkillDescription });
        await addSkill(user.id, newSkillName, newSkillDescription);
        console.log("Skill added successfully");
        setNewSkillName("");
        setNewSkillDescription("");
        setShowInput(false);
        await fetchSkills();
        setError(null);
      } catch (error) {
        console.error("Error adding skill:", error);
        setError(`Failed to add skill: ${error.message}`);
      } finally {
        setIsAdding(false);
      }
    } else {
      console.log("No user found in AuthContext");
      setError("User not authenticated. Please log in.");
    }
  };

  const handleRemoveSkill = async (skillName) => {
    if (user) {
      try {
        console.log("Removing skill:", skillName);
        await removeSkill(user.id, skillName);
        console.log("Skill removed successfully");
        fetchSkills();
        setError(null);
      } catch (error) {
        console.error("Error removing skill:", error);
        setError("Failed to remove skill. Please try again.");
      }
    } else {
      console.log("No user found in AuthContext");
      setError("User not authenticated. Please log in.");
    }
  };

  return (
    <div className={styles.skillsContainer}>
      {error && <p className={styles.error}>{error}</p>}
      <button 
        onClick={() => setShowInput(!showInput)} 
        className={styles.addButton}
        disabled={isAdding}
      >
        {showInput ? "Cancel" : "Add Skill"}
      </button>
      
      {showInput && (
        <form onSubmit={handleAddSkill} className={styles.inputForm}>
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Skill Name"
            className={styles.input}
            disabled={isAdding}
          />
          <textarea
            value={newSkillDescription}
            onChange={(e) => setNewSkillDescription(e.target.value)}
            placeholder="Skill Description"
            className={styles.textarea}
            disabled={isAdding}
          />
          <button type="submit" className={styles.submitButton} disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </button>
        </form>
      )}
      
      <div className={styles.skillsList}>
        {skills.map((skill, index) => (
          <div key={index} className={styles.skillItem}>
            <button 
              onClick={() => handleRemoveSkill(skill.name)} 
              className={styles.removeButton}
            >
              X
            </button>
            <h3 className={styles.skillName}>{skill.name}</h3>
            <p className={styles.skillDescription}>{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}