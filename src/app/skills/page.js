import React from "react";
import { NavBar } from "../../../Components/NavBar";
import SkillsComponent from "./skills.js";  

import "../Styles/Home_Page.css";
import "../Styles/mukta.css";

export default function SkillsPage() { 
  return (
    <>
      <SkillsComponent /> 
      <NavBar />
    </>
  );
}