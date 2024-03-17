const myInput = document.querySelector("#start-checkbox");

proceedToTest();

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
