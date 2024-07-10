"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getAllSkills, addSkill, removeSkill } from "@/app/actions";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const router = useRouter();
  const { user, logout } = useAuth();

  const fetchSkills = useCallback(async () => {
    if (user) {
      const fetchedSkills = await getAllSkills(user.id);
      setSkills(fetchedSkills);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchSkills();
    }
  }, [user, router, fetchSkills]);

  async function handleAddSkill(e) {
    e.preventDefault();
    if (newSkillName && newSkillDescription && user) {
      await addSkill(user.id, newSkillName, newSkillDescription);
      setNewSkillName("");
      setNewSkillDescription("");
      setShowInput(false);
      fetchSkills();
    } else {
      alert("Fill out both the boxes!");
    }
  }

  async function handleRemoveSkill(id) {
    if (user) {
      await removeSkill(id, user.id);
      fetchSkills();
    }
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Skills for {user.username}</h1>
      <button onClick={handleLogout}>Logout</button>
      <button
        onClick={() => setShowInput(!showInput)}
        className="js-add-skill-button"
      >
        {showInput ? "Cancel" : "Add Skill"}
      </button>

      {showInput && (
        <form
          onSubmit={handleAddSkill}
          className="js-skill-input-section s_s-input-section"
        >
          <div className="inputs">
            <input
              className="skill-name-input js-skill-name-input"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Skill Name"
              required
            />
            <textarea
              className="description-box js-skill-description-box"
              value={newSkillDescription}
              onChange={(e) => setNewSkillDescription(e.target.value)}
              placeholder="Skill Description"
              required
            />
          </div>
          <div className="done-button-container">
            <button type="submit" className="done-button js-create-button">
              Create
            </button>
          </div>
        </form>
      )}

      <div className="js-skill-box">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-box">
            <p className="skill-name">{skill.name}</p>
            <div className="skill-description">{skill.description}</div>
            <button
              onClick={() => handleRemoveSkill(skill.id)}
              className="remove-skill-button js-remove-skill-button"
              data-id={skill.id}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
