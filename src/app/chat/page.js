import ChatComponent from './chatComponent';
import Link from "next/link";
import React from "react";
import { NavBar } from "../../../Components/NavBar";

import "../Styles/Home_Page.css";
import "../Styles/mukta.css";

export default function ChatPage() {
  return (
  
    <>
      <div>
        <header className="Homepage-header">

          <div className="Website-Title">
            <span className="title-text"> NaviGrowth AI </span>
          </div>

          <div className="info-section">
            <Link href="/about">About Us</Link>
          </div>

          <div className="info-section">
            <Link href="/settings">Settings</Link>
          </div>
        </header>

        <main className="body-text">
        <ChatComponent />
        </main>

        <div className="js-navbar"></div>
      </div>
      <NavBar />
      
    </>
  
  );
}