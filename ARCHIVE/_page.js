// import Link from "next/link";
// import React from "react";
// import { NavBar } from "../Components/NavBar";
// import { updateStrengthsDisplay, addStrengthHTML } from "./S&S/strengths_class";

// import "../Styles/Home_Page.css";
// import "../Styles/mukta.css";
// import "../Styles/Skills.css"

// export default function Skills_Strengths() {

//   updateStrengthsDisplay();
//   addStrengthHTML();

//   return (
//     <>
//       <NavBar />
//       <div>
//         <header className="Homepage-header">

//           <div className="Website-Title">
//             <span className="title-text">NaviGrowth Education</span>
//           </div>

//           <div className="info-section">
//             <Link href="/about">About Us</Link>
//           </div>

//           <div className="info-section">
//             <Link href="/settings">Settings</Link>
//           </div>
//         </header>

//         <main className="s_s"> 
      
//           <div className="strengths">
//             <div className="strengths-header">
//               Strengths 
//             </div>

//             <button className="add-s-button js-add-strength-button">
//               Add Strength
//             </button>

//             <div className="js-strength-input-section"></div> 

//             <div className="js-strength-box"></div> 

//           </div>

//           <div className="skills">

//             <div className="skills-header">
//             Skills 
//             </div>

//             <button className="add-s-button">
//               Add Skill
//             </button>

//             <div className="s_s-input-section"> 
//               <div className="inputs">
//                 <input className="strength-name-input" placeholder="Type Skill Name"/>
//                 <textarea className="description-box" placeholder="Type Skill Description"></textarea>
//               </div>
//               <div className="done-button-container">
//                 <button className="done-button"> Create </button>
//               </div>
//             </div>

//             <div className="strength-box">
//               <p className="strength-name"> Skill XYz </p>
//               <div className="strength-description">
//                 "Able to quickly adjust to new situations and challenges, 
//                 demonstrating resilience and flexibility. Thrives in dynamic 
//                 environments by efficiently handling change and maintaining productivity under pressure."
//               </div>

//               <button className="remove-strength-button"> X </button>

//             </div>

//           </div>
//         </main>

//         <div className="js-navbar"></div>
//       </div>
    
//     </>
//   );
// }