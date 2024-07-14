import Link from "next/link";
import React from "react";
import { NavBar } from "../../../Components/NavBar";
import SettingsComponent from "./settings.js";  // Changed this line

import "../Styles/mukta.css";

export default function SettingsPage() {  // Changed function name to PascalCase
  return (
    <>
      <SettingsComponent/>
      <NavBar />
    </>
  );
}