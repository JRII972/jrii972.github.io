
// localStorage.setItem('pseudo', pseudo.value)
// localStorage.setItem('administration', administration.value)

last_score_movement = parseInt(localStorage.getItem('last_score_movement')) ?? null
score_description = localStorage.getItem('score_description') ?? null

if (last_score_movement) {
  if (last_score_movement > 0 ){
    document.getElementById('score-movement').innerHTML = "<p>" + localStorage.getItem('pseudo') + " vous avez gagner " + last_score_movement + " point(s) !</p>"
  } else {
    document.getElementById('score-movement').innerHTML = "<p>" + localStorage.getItem('pseudo') + " vous avez perdu " + last_score_movement + " point(s) !</p>"
  }
}

if (score_description) {
  document.getElementById("score-description").innerHTML = "<p>" + score_description + "</p>"
}

document.getElementById('score-point').innerText = localStorage.getItem('score') ?? 0
document.getElementById('pseudo').innerText = localStorage.getItem('pseudo') ?? ""

// localStorage.setItem('last_score_movement', 0)
// localStorage.setItem('score_description', "")
