import { strengthsList } from "./s-lists.js";

export class Strengths {
  static strengthId = 1;
  #strengthName;
  #strengthDescription;

  constructor(name, description) {
    this.#strengthName = name;
    this.#strengthDescription = description;
  }

  getstrengthName() {
    return this.#strengthName;
  }
  getstrengthDescription() {
    return this.#strengthDescription;
  }
}

export function updateStrengthsDisplay() {
  const strengthCointainer = document.querySelector(".js-strength-box");
  strengthCointainer.innerHTML = "";

  strengthsList.forEach((strength) => {
    strengthCointainer.innerHTML += `
      <div class="strength-box">
        <p class="strength-name"> ${strength.strengthName} </p>
        <div class="strength-description">
          ${strength.strengthDescription}
        </div>

        <button class="remove-strength-button js-remove-strength-button" 
        data-id="${strength.strengthId}"> X </button>
      </div>  `;
  });

  console.log(strengthsList);

  document.querySelectorAll(`.js-remove-strength-button`).forEach((button) => {
    button.addEventListener("click", function () {
      removeStrength(this.dataset.id);
    });
  });
}

function removeStrength(strengthId) {
  const index = strengthsList.findIndex(
    (item) => item.strengthId === parseInt(strengthId)
  );
  if (index !== -1) {
    strengthsList.splice(index, 1);
    updateStrengthsDisplay();
  }
}

export function addStrengthInputHTML() {
  return `<div class="inputs">
      <input class="strength-name-input js-strength-name-input" placeholder="Type Strength Name">
      <textarea class="description-box js-strength-description-box" placeholder="Type Strength Description"></textarea>
    </div>
    <div class="done-button-container">
      <button class="done-button js-create-button"> Create </button>
    </div>`;
}
