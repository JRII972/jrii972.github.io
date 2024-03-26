const myInput = document.querySelector("#start-checkbox");
let data = JSON.parse(localStorage.getItem('quizz_data'))  


if ( data ) {
  location.href = "test.html"; //Modification de la page
} else {
  proceedToTest();
}


function proceedToTest() {
  const btnProceed = document.querySelector("#btn-proceed");
  myInput.onclick = () => {
    if (myInput.checked) btnProceed.disabled = false;
    else btnProceed.disabled = true;
  };
  btnProceed.onclick = () => {
    location.href = "test.html";
  };
}


