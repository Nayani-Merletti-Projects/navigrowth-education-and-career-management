"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavBar } from "../../Components/NavBar";
import { useAuth } from "./context/AuthContext"; // Adjust the path as needed

import "./Styles/Home_Page.css";
import "./Styles/mukta.css";

export default function Home() {
  const { user } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user && user.username) {
      // If the username contains an email (username|email format), split it
      const [name] = user.username.split('|');
      setUsername(name);
    }
  }, [user]);

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
            <p className="no-goals-msg">You are all done!</p>
            <Link href="/goals" className="no-goals-link">
              Make some new ones!
            </Link>
          </div>
        </main>

        <div className="js-navbar"></div>
      </div>
      <NavBar />
    </>
  );
}