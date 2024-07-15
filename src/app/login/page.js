"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import styles from '../Styles/login.module.css';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  /*const handleClearDatabase = async () => {
    try {
      const response = await fetch('/navigrowth-education-and-career-management/api/auth/clear-database', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Database cleared successfully');
      } else {
        alert('Failed to clear database: ' + data.message);
      }
    } catch (error) {
      console.error('Error clearing database:', error);
      alert('Error clearing database');
    }
  };*/ 
  // database clear function for testing and not accessible to the users

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Attempting login for:", username);
      const response = await fetch("/navigrowth-education-and-career-management/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok) {
        console.log("Login successful", data);
        login(data.user);
      } else {
        console.log("Login failed", data.message);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or Email"
            required
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <p className={styles.registerLink}>
          Don&apos;t have an account? <Link href="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

//<button type="button" onClick={handleClearDatabase}>Clear Database</button>
// button to clear the database during testing