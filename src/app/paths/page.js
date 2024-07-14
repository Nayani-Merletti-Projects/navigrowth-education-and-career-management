"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllUniquePaths,
  getUsersByPath,
  addPath,
  removePath,
} from "../actions";
import styles from "../Styles/Paths.module.css";
import { NavBar } from "../../../Components/NavBar";
import "../Styles/Home_Page.css";
import "../Styles/mukta.css";

export default function PathsPage() {
  const [paths, setPaths] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newPath, setNewPath] = useState("");
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  const fetchPaths = useCallback(async () => {
    try {
      const fetchedPaths = await getAllUniquePaths();
      const pathData = await Promise.all(
        fetchedPaths.map(async (path) => {
          const users = await getUsersByPath(path.path);
          return {
            path: path.path,
            userCount: users.length,
          };
        })
      );
      setPaths(pathData);
      setError(null);
    } catch (error) {
      console.error("Error fetching paths:", error);
      setError("Failed to fetch paths. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const handleAddPath = async (e) => {
    e.preventDefault();
    if (!newPath) {
      alert("Please enter a path.");
      return;
    }
    if (user) {
      setIsAdding(true);
      try {
        await addPath(user.id, newPath);
        setNewPath("");
        setShowInput(false);
        await fetchPaths();
        setError(null);
      } catch (error) {
        console.error("Error adding path:", error);
        setError(`Failed to add path: ${error.message}`);
      } finally {
        setIsAdding(false);
      }
    } else {
      console.log("No user found in AuthContext");
      setError("User not authenticated. Please log in.");
    }
  };

  const handleRemovePath = async (path) => {
    if (user) {
      try {
        await removePath(user.id, path);
        fetchPaths();
        setError(null);
      } catch (error) {
        console.error("Error removing path:", error);
        setError("Failed to remove path. Please try again.");
      }
    } else {
      console.log("No user found in AuthContext");
      setError("User not authenticated. Please log in.");
    }
  };

  return (
    <div className={styles.pathsContainer}>
      <NavBar />
      {error && <p className={styles.error}>{error}</p>}
      <button
        onClick={() => setShowInput(!showInput)}
        className={styles.addButton}
        disabled={isAdding}
      >
        {showInput ? "Cancel" : "Add Path"}
      </button>
      {showInput && (
        <form onSubmit={handleAddPath} className={styles.inputForm}>
          <input
            type="text"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="New Path"
            className={styles.input}
            disabled={isAdding}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add"}
          </button>
        </form>
      )}
      <div className={styles.pathsList}>
        {paths.map((path) => (
          <div key={path.path} className={styles.pathItem}>
            <button
              onClick={() => handleRemovePath(path.path)}
              className={styles.removeButton}
            >
              X
            </button>
            <h3 className={styles.pathName}>{path.path}</h3>
            <p className={styles.userCount}>{path.userCount} users</p>
          </div>
        ))}
      </div>
    </div>
  );
}
