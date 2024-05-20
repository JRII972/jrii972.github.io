function size_dict(d){c=0; for (i in d) ++c; return c}

fetch('./assets/js/questions.json', { 
  method: 'GET'
})
.then(function(response) { return response.json(); })
.then(function(_questions) {
  
  let data = JSON.parse(localStorage.getItem('quizz_data')) || { 
    date : Date.now(),
    questions : [],
    actualKey : 0,
    ended : false
  }
  
  if ( data.date <= Date.now() ){ //  
    let questions = []
    while (questions.length != 5 ) {
      id = Math.floor(Math.random() * _questions.length)
      questions.push( _questions[id])
      _questions.splice(id, 1)
    }

    data.questions = questions

    data.date = new Date().setHours(24,0,0,0)
    localStorage.setItem('quizz_data', JSON.stringify(data));

  } else {
    // for (const id in data.questions) {
    //   questions.push(data.questions[id])
    // }
  }

  if ( data.ended ) {
    location.href = "result.html";
  }

  //Je crée des variables globales
  let questionCat = document.getElementById("categorie");
  let questionTitle = document.getElementById("question");
  let questionINDX = data.actualKey || 0;
  
  document.getElementById("total_steps").innerHTML = " / " + (data.questions.length - questionINDX);
  localStorage.total_steps = data.questions.length - questionINDX;
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
    data.questions.forEach((quest) => {
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
    for (let i = 0; i < data.questions[questionINDX].totAnswer.length; i++) {
      array.push(data.questions[questionINDX].totAnswer.slice(i, i + 1));
    }
  }

  //l'écran moule les valeurs de l'objet
  function printQuestion() {
    switch (data.questions[questionINDX].difficulty) {
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
    questionTitle.innerText = data.questions[questionINDX].question;
    questionCat.innerText = data.questions[questionINDX].category;
    data.questions[questionINDX].totAnswer = shuffle(data.questions[questionINDX].totAnswer);
    const answerContainer = document.querySelector("#answers");
    answerContainer.innerHTML = ""; // ------PrintQuestion imprime les 4 réponses et s'ajoute toujours à celles suivantes, donc elle vide les boutons des questions précédentes
    //boutons de création
    data.questions[questionINDX].totAnswer.forEach((answer) => {
      const btnAnswer = document.createElement("button");
      btnAnswer.classList.add("btn-answer");
      //accesso diretto alle risposte possibili
      btnAnswer.innerHTML = answer;
      btnAnswer.onclick = () => clicked(btnAnswer); //fonction qui relie la progression des questions
      answerContainer.appendChild(btnAnswer);
    });
  }

  function clicked(btn) {
    //** Lorsque je clique sur la réponse sélectionnée
    if (btn.innerText === data.questions[questionINDX].correct_answer) {
      correct += 1;
      wrong = data.questions.length - correct;
      data.questions[questionINDX].state = "correct"
    } else {      
      data.questions[questionINDX].state = "wrong"
      console.log("wrong");
    }
    localStorage.setItem("correct", correct);
    localStorage.setItem("wrong", wrong);    
    localStorage.setItem('quizz_data', JSON.stringify(data));
    ProgressiveQuestion();
  }

  // progression des questions
  function ProgressiveQuestion() {
    let stepsEl = document.getElementById("steps");
    let steps = parseInt(stepsEl.innerHTML);
    questionINDX++;
    if (questionINDX < data.questions.length) {
      stepsEl.innerHTML = ++steps;
      printQuestion();
      data.actualKey = questionINDX;
      localStorage.setItem('quizz_data', JSON.stringify(data));
    } else {
      data.ended = true;
      localStorage.setItem('quizz_data', JSON.stringify(data));
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
        data.questions[questionINDX].state = "skipped"        
        localStorage.setItem('quizz_data', JSON.stringify(data));
        ProgressiveQuestion();
      }
    }, 1000);
  }

});
