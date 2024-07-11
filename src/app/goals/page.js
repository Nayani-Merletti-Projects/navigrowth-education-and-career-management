import Link from "next/link";
import React from "react";
import { NavBar } from "../../../Components/NavBar";
import GoalsComponent from './goalsComponent';

import "../Styles/Home_Page.css";
import "../Styles/mukta.css";

export default function ChatPage() {
  return (
<<<<<<< HEAD
  
=======
>>>>>>> 32352ba8705ec76ff6b65e07e68e971d8a642ccc
    <>
      <div>
        <header className="Homepage-header">

          <div className="Website-Title">
            <span className="title-text"> Goals </span>
          </div>

          <div className="info-section">
            <Link href="/about">About Us</Link>
          </div>

          <div className="info-section">
            <Link href="/settings">Settings</Link>
          </div>
        </header>

        <main className="body-text">
          <GoalsComponent />
        </main>

        <div className="js-navbar"></div>
      </div>
      <NavBar />
<<<<<<< HEAD
      
    </>
  
=======
    </>
>>>>>>> 32352ba8705ec76ff6b65e07e68e971d8a642ccc
  );
}
