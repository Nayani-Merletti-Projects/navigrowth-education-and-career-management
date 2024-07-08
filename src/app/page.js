import Link from "next/link";
import React from "react";
import { NavBar } from "../../Components/NavBar";

import "../../Styles/home_page.css";
import "../../Styles/mukta.css";

export default function Home() {
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
          <p className="home-msg">Hey There Luke!</p>
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
