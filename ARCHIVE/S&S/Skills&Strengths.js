// import {addStrengthInputHTML, Strengths, updateStrengthsDisplay,} 
//   from "./S&S/strengths_class.js";
// import { strengthsList } from "./S&S/s-lists.js";

// updateStrengthsDisplay();

// export function createEventListener() {
//   document.querySelector(".js-create-button").addEventListener("click", () => {
//     const nameInput = document.querySelector(".js-strength-name-input");
//     const descriptionInput = document.querySelector(
//       ".js-strength-description-box"
//     );
//     const inputSection = document.querySelector(".js-strength-input-section");

//     if (nameInput.value === "" || descriptionInput.value === "") {
//       alert("Fill out both the boxes!");
//       return;
//     } else {
//       const strength = new Strengths(nameInput.value, descriptionInput.value);
//       strengthsList.push({
//         strengthId: Strengths.strengthId,
//         strengthName: strength.getstrengthName(),
//         strengthDescription: strength.getstrengthDescription(),
//       });

//       Strengths.strengthId++;
//       inputSection.innerHTML = "";
//       inputSection.classList.remove("s_s-input-section");
//       updateStrengthsDisplay();
//     }
//   });
// }


// export function addStrengthHTML() {

//   document.querySelector(".js-add-strength-button")
//     .addEventListener("click", () => {
//       const inputHTML = addStrengthInputHTML();
//       const inputSection = document.querySelector(".js-strength-input-section");

//       if (!inputSection.classList.contains("s_s-input-section")) {
//         inputSection.innerHTML = inputHTML;
//         inputSection.classList.add("s_s-input-section");
//         createEventListener();
//       } else {
//         inputSection.innerHTML = "";
//         inputSection.classList.remove("s_s-input-section");
//       }
//     });
//   }