const myInput = document.querySelector("#start-checkbox");
let data = JSON.parse(localStorage.getItem('quizz_data'))  


const btnProceed = document.querySelector("#btn-proceed");
const pseudo = document.getElementById('pseudo');
const administration = document.getElementById('administration');

if ( data ) {
  if ( data.goToClassement) {
    location.href = "classement.html"; 
  }
  if ( data.date > Date.now() ){ 
    location.href = "test.html"; 
  } else {
    pseudo.value = localStorage.getItem('pseudo')
    administration.value = localStorage.getItem('administration')
  }
} 

proceedToTest();

function checkInput() {
  if (myInput.checked){
    if ( (pseudo.value != '') ) {
      btnProceed.disabled = false
    } else {
      btnProceed.disabled = true
    }
  } else btnProceed.disabled = true;
}

function proceedToTest() {
  myInput.onclick = () => {
    checkInput();
  };
  pseudo.addEventListener("keydown", (event) => {
    checkInput();
  });
  pseudo.addEventListener("change", (event) => {
    checkInput();
  });
  btnProceed.onclick = () => {    
    localStorage.setItem('pseudo', pseudo.value)
    localStorage.setItem('administration', administration.value)
    location.href = "test.html";
  };
}


