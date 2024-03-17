// prendo i miei elementi dall'html
let endGame = document.getElementById("end-game");
let correctResults = document.getElementById("correct-result");
let wrongResults = document.getElementById("wrong-result");
let pie = document.querySelector(".pie");
let endSpecificsTXT = document.getElementById("end-specifics");
let clearStorageBtn = document.getElementById("reset-storage");
let wrongQuestionNum = document.getElementById("wrong-questions-num");
let correctQuestionNum = document.getElementById("correct-questions-num");

// Récupération des données du localstorage
let correct = localStorage.getItem("correct");
let wrong = localStorage.getItem("wrong");

// ricompongo il risultato totale e calcolo la percentuale
let total = Number(correct) + Number(wrong);
const correctPercentage = (correct / total) * 100;
const incorrectPercentage = (wrong / total) * 100;

//****verifico se i miei dati arrivano correttamente!!
console.log(correct, "correct");
console.log(wrong, "correct");

init();
function init() {
  //fallback
  if ((isNaN(correct) && isNaN(wrong)) || (!correct && !wrong)) {
    endGame.innerHTML =
      "<div class='zIndex1'>Il semblerait que quelque chose se soit mal passé!</div>";
    pie.classList.remove("pie");
  } else {
    correctResults.innerHTML = `${correctPercentage}%`;
    wrongResults.innerHTML = `${incorrectPercentage}%`;
    // con l'operatore ternario setto i valori da popolare SE l'utente ha vinto o meno
    endGame.innerHTML =
      correctPercentage >= incorrectPercentage
        ? `<div class='zIndex1'>
    <p class="bold mb-20px">
        Toutes nos félicitations <br />
        <span class="light-blue">Vous avez de bonne connaissance sur le sujet!</span>
    </p>
    <p id="end-specifics" class="small">
      Chaque geste compte : sauvegardons notre planète par des actions quotidiennes responsables.
    </p>
    </div>`
        : `<div class='zIndex1'>
     <p class="bold">
         Merci de votre participation ! <br />
         <span class="fucsia mb-20px">Chaque erreur est une chance d'apprendre</span>
     </p>
     <p id="end-specifics" class="small">
     Continuez d'explorer et d'adopter des pratiques durables, car chaque petit geste contribue à un grand changement
     </p>
   </div>`;
    correctQuestionNum.innerHTML = `${correct}/${total} questions`;
    wrongQuestionNum.innerHTML = `${wrong}/${total} questions`;
    background = `background: conic-gradient(#d20094 ${incorrectPercentage}%, #00ffff 0deg)`;
    pie.setAttribute("style", background);

    // svuoto il local storage quando l'utente esce dalla pagina
    clearStorageBtn.onclick = () => {
      localStorage.clear();
    };
  }
}
