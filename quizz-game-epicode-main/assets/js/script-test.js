fetch('./assets/js/questions.json', { 
  method: 'GET'
})
.then(function(response) { return response.json(); })
.then(function(_questions) {
  
  var questions = []
  while (questions.length != 5 ) {
    id = Math.floor(Math.random() * _questions.length)
    questions.push( _questions[id])
    _questions.splice(id, 1)
  }

  //Je crée des variables globales
  let questionCat = document.getElementById("categorie");
  let questionTitle = document.getElementById("question");
  let questionINDX = 0;
  let singleQuestion = questions[questionINDX];
  document.getElementById("total_steps").innerHTML = " / " + questions.length;
  localStorage.total_steps = questions.length
  // let myTimer = document.getElementById("countdown");
  let correct = 0;
  let wrong;
  let countdown = 30;
  let intervalId;

  // Les fonctions
  concatAnswers();
  printQuestion();
  //

  //Je crée le tableau de REA total pour chaque OBJ en questions
  function concatAnswers() {
    questions.forEach((quest) => {
      quest.totAnswer = quest.incorrect_answers.concat(quest.correct_answer);
    });
  }

  // Ham les réponses dans un ordre aléatoire
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

  // Je décompose le tableau des réponses tot
  function sliceAnswers(array) {
    for (let i = 0; i < questions[questionINDX].totAnswer.length; i++) {
      array.push(questions[questionINDX].totAnswer.slice(i, i + 1));
    }
  }

  //l'écran moule les valeurs de l'objet
  function printQuestion() {
    switch (questions[questionINDX].difficulty) {
      case 'easy':
        countDown(20);
        break;
      case 'medium':
        countDown(15);
        break;
      case 'hard':
        countDown(8);
        break;
    
      default:
        countDown(30);
        break;
    }
    questionTitle.innerText = questions[questionINDX].question;
    questionCat.innerText = questions[questionINDX].category;
    questions[questionINDX].totAnswer = shuffle(questions[questionINDX].totAnswer);
    const answerContainer = document.querySelector("#answers");
    answerContainer.innerHTML = ""; // ------PrintQuestion imprime les 4 réponses et s'ajoute toujours à celles suivantes, donc elle vide les boutons des questions précédentes
    //boutons de création
    questions[questionINDX].totAnswer.forEach((answer) => {
      const btnAnswer = document.createElement("button");
      btnAnswer.classList.add("btn-answer");
      //accesso diretto alle risposte possibili
      btnAnswer.innerHTML = answer;
      btnAnswer.onclick = () => clicked(btnAnswer); //funzione che collega il progredire delle domande
      answerContainer.appendChild(btnAnswer);
    });
  }

  function clicked(btn) {
    //** Lorsque je clique sur la réponse sélectionnée
    if (btn.innerText === questions[questionINDX].correct_answer) {
      correct += 1;
      wrong = questions.length - correct;
    } else {
      console.log("wrong");
    }
    localStorage.setItem("correct", correct);
    localStorage.setItem("wrong", wrong);
    ProgressiveQuestion();
  }

  // progression des questions
  function ProgressiveQuestion() {
    let stepsEl = document.getElementById("steps");
    let steps = parseInt(stepsEl.innerHTML);
    if (steps !== questions.length) {
      stepsEl.innerHTML = ++steps;
      questionINDX++;
      printQuestion();
    } else {
      location.href = "result.html"; //Modification de la page
    }
  }

  function countDown(countdown=30) {
    let offset = 0;
    let circle = document.querySelector("circle");
    let myTimer = document.getElementById("countdown");
    myTimer.innerHTML = countdown;
    if (intervalId) {
      circle.style.display = "none";
      clearInterval(intervalId);
    }
    intervalId = setInterval(function timer() {
      countdown = --countdown < 0 ? 30 : countdown;
      offset -= 10;
      offset = --offset < -326 ? 0 : offset;
      circle.style.strokeDashoffset = `${offset}`;
      myTimer.innerHTML = countdown;
      circle.style.display = "block";
      if (countdown == 0) {
        ProgressiveQuestion();
      }
    }, 1000);
  }

});
