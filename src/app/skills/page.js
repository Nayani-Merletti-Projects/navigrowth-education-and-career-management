import Link from "next/link";
import React from "react";
import { NavBar } from "../../../Components/NavBar";
import SkillsComponent from "./skills.js";  

import "../Styles/Home_Page.css";
import "../Styles/mukta.css";

export default function SkillsPage() { 
  return (
    <>
      <div>
        <header className="Homepage-header">
          <div className="Website-Title">
            <span className="title-text">Skills</span>
          </div>

          <div className="info-section">
            <Link href="/about">About Us</Link>
          </div>

          <div className="info-section">
            <Link href="/settings">Settings</Link>
          </div>
        </header>

        <main className="body-text">
          <SkillsComponent /> 
        </main>

        <div className="js-navbar"></div>
      </div>
      <NavBar />
    </>
  );
}