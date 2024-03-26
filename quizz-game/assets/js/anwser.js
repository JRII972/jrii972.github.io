
let data = JSON.parse(localStorage.getItem('quizz_data'))  

let question = document.getElementById("question");
let awnser = document.getElementById("réponse");
let statistique = document.getElementById("statistique");
let statistique_source = document.getElementById("statistique-source");

if ( data ) {
  var actualKey = data.actualAwnser || 0
  var actualStats = 0
  data.actualAwnser = actualKey;
  printAwnser()
  countDown(15)
} else {
  alert('Une érreur c\'est produite ! :(')
  location.href = "result.html";
}

function printAwnser() {

  question.innerText = data.questions[actualKey].question
  awnser.innerHTML = textToHtml(data.questions[actualKey].answer) || "<p>NOT FILLED</p>"

  actualStats = Math.floor(Math.random() * data.questions[actualKey].statistics.length)
  printStats();
}

document.getElementById("prec-btn").onclick = function () {
  actualKey--
  if (actualKey >= 0) {
    printAwnser();
    data.actualAwnser = actualKey;
    localStorage.setItem('quizz_data', JSON.stringify(data));
  } else {
    goToResultPage()
  } 
}

document.getElementById("suiv-btn").onclick = function () {
  actualKey++
  if (actualKey == data.questions.length - 1 ) {
    printAwnser();
    data.actualAwnser = actualKey;
    localStorage.setItem('quizz_data', JSON.stringify(data));

    this.innerText = "Résultats"
  } else if (actualKey < data.questions.length) {
    printAwnser();
    data.actualAwnser = actualKey;
    localStorage.setItem('quizz_data', JSON.stringify(data));
    this.innerText = "Suivant"
  } else {
    goToResultPage()
  } 
}

function goToResultPage() {
  data.actualAwnser = 0;
  localStorage.setItem('quizz_data', JSON.stringify(data));
  location.href = "result.html"; //Modification de la page
}

function textToHtml(text) {
  let _result = ""
  if (text) {
    text.split('\n').forEach(_text => {
      _result += "<p>" + _text + "</p>"
    });
  } 
  return _result
}

function printStats() {  
  statistique.innerHTML = textToHtml(data.questions[actualKey].statistics[actualStats].data)
  statistique_source.innerHTML = textToHtml(data.questions[actualKey].statistics[actualStats].source)
}

function countDown(_countdown=30) {
  let offset = 0;
  let countdown = _countdown
  intervalId = setInterval(function timer() {
    countdown = --countdown < 0 ? 30 : countdown;
    offset -= 10;
    offset = --offset < -326 ? 0 : offset;
    
    if (countdown == 0) {
      actualStats++
      if( actualStats >= data.questions[actualKey].statistics.length){
        actualStats = 0
      }
      printStats();
      countDown(_countdown);
    }
  }, 1000);
}