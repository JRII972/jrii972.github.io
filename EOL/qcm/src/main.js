/*jslint browser: true*/
/*global $, jQuery, alert*/


var _data = []
var _actual_question_id = undefined
var _step_number = 1
var result = []
function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

(function($) {
    'use strict';

    $(function() {
        

        $(document).ready(function() {
            console.log("start")
            var $dataJSON = './src/data.json';
            // $('body').on( "click", function (event)  {
            //     $('.modal').toggle();
            // });

            async function addToScrore(score) {
                var _score = parseInt(getCookie('quizz_score')) || 0
                $("#score").text(_score)
                if (_score == NaN) {
                    $("#score").text(_score)
                    _score = score
                    return
                }
                setCookie('quizz_score', _score+score, 120)

                $("#score").addClass("animate")
                for (let step = 1; step <= score; step++) {
                    _score = _score + 1
                    $("#score").text(_score)
                    await delay(300);
                }

                $("#score").removeClass("animate")

            }

            function splashScreen() {
                var images = ['buke cycling.gif', 'europe env.gif', 'good night earth.gif', 'legacy.gif', 'Poison Rouge.gif']
                
                $('.quiz-image').empty();
                $('.quiz-image').append(`
                    <img src="` + './public/gif/' + images[Math.floor(Math.random() * images.length)] +`" />
                `);
            
            }

            var $progressWizard = $('.stepper'),
                $tab_active,
                $tab_prev,
                $tab_next,
                $btn_prev = $progressWizard.find('.prev-step'),
                $btn_next = $progressWizard.find('.next-step'),
                $tab_toggle = $progressWizard.find('[data-toggle="tab"]'),
                $tooltips = $progressWizard.find('[data-toggle="tab"][title]');

                function getQuestionById(id) {
                    $.getJSON($dataJSON, function(data) {
                        data.forEach(question => {
                            if (question.id == id){
                                return question
                            }
                        });
                    })
                }

                function getHTMLResultById(id) {
                    $.getJSON($dataJSON, function(data) {
                        data.forEach(question => {
                            if (question.id == id){
                                $('.quizz-content').html(question.content)
                                return
                            }
                        });
                    })
                }
                
                function shwoResult() {
                    console.log('result')
                    $('.quiz-image').empty();
                    $('#quiz-anwser').empty();
                    $('#quiz-type').text("Info")
                    $('#quiz-question').text("")
                    $('#quiz-anwser').append(`
                    <div class="quiz-button precedent" >
                        Précédent
                    </div>
                    `);
                    $('#quiz-anwser').append(`
                    <div class="quiz-button suivant" >
                        Suivant
                    </div>
                    `);
                    var _r = undefined
                    for (const _result in result) {
                        if (result[_result].step == _step_number) {
                            _r = result[_result]
                            break
                        }
                    }
                    $('.c-stepper__item[step-number=' + _step_number + ']').addClass('active')
                    if (_step_number > 1) { $('.quiz-button.precedent').addClass('active')}
                    else{ $('.quiz-button.suivant').removeClass('active')}
                    if (_step_number < result.length) { $('.quiz-button.suivant').addClass('active')}
                    else{ $('.quiz-button.suivant').removeClass('active')}

                    getHTMLResultById(_r.id)

                    $('.quiz-button.suivant.active').on( "click", {_step_number : _step_number}, function (event) {
                        $('.c-stepper__item[step-number=' + event.data._step_number + ']').removeClass('active')
                        _step_number = event.data._step_number+ 1
                        shwoResult()
                    });
                    $('.quiz-button.precedent.active').on( "click", {_step_number : _step_number}, function (event) {
                        $('.c-stepper__item[step-number=' + event.data._step_number + ']').removeClass('active')
                        _step_number = event.data._step_number-1
                        shwoResult()
                    });
                    
                }

                function genQuestion(data) {
                    if ((data.length == 0 ) || (data == [])) {
                        $('#quiz-type').text("Score")
                        $('.quizz-content').text("Votre score est de " + getCookie('quizz_score'))
                        $('#quiz-question').text("Pas d'autre question pour aujourd'hui")
                        $('#quiz-anwser').empty();
                        $('.quiz-image').empty();
                        if (result.length){
                            $('#quiz-anwser').append(`
                            <div class="quiz-button" >
                            En découvrir plus
                            </div>
                            `);

                            $('.quiz-button').on( "click", function (event) {
                                _step_number = 1
                                shwoResult()
                            });
                        }else {
                            splashScreen();
                        }

                        return
                    }
                    _actual_question_id = data[0].id
                    $('.quizz-question-id').text(_actual_question_id)
                    $('#quiz-type').text(data[0].type)
                    $('#quiz-question').text(data[0].question)
                    $('.quiz-image').empty()
                    if (data[0].image ){
                        $('.quiz-image').append(`
                    <img id="quiz-image" title="Question image" src="` + data[0].image + `"/>
                    `)
                    }
                    $('#quiz-anwser').empty();
                    // data[0].réponse.forEach(réponse => {
                    //     $('#quiz-anwser').append(`
                    //         <div class="quiz-button" réponse="` + réponse.réponse + `">
                    //         ` + réponse.text +`
                    //     </div>
                    //     `);
                    // });
                    var _tmp = data[0].réponse;
                    console.log('tmp')
                    console.log(_tmp)
                    while (_tmp.length > 0) {
                        console.log(_tmp)
                        var _a = Math.floor(Math.random() * _tmp.length)
                        var réponse = _tmp[_a]
                        $('#quiz-anwser').append(`
                        <div class="quiz-button" réponse="` + réponse.réponse + `" value="` + (réponse.value || 1) + `" >
                        ` + réponse.text +`
                        </div>
                        `);
                        _tmp.splice(_a, 1)
                    }
                    console.log('tmp')

                    data.splice(0, 1)

                    $('.quiz-button').on( "click", {
                        data: data
                    }, function(event) {
                        var historique = JSON.parse( getCookie('quizz_historique') || JSON.stringify(
                            {
                                'question' : [],
                            }
                        ))
                        historique.question.push(_actual_question_id)
                        historique.question = historique.question.filter(onlyUnique)
                        setCookie('quizz_historique', JSON.stringify(historique), 120)
                        if( $(this).attr('réponse') == 'true' ){
                            result.push({
                                "step" : _step_number,
                                "id" : _actual_question_id,
                                'status' : 1

                            })
                            addToScrore(parseInt($(this).attr('value')) || 1)
                            $('.c-stepper__item[step-number=' + _step_number + ']').addClass('success')
                        }
                        else {
                            result.push({
                                "step" : _step_number,
                                "id" : _actual_question_id,
                                'status' : 0

                            })
                            $('.c-stepper__item[step-number=' + _step_number + ']').addClass('fail')
                        }
                        $('.c-stepper__item[step-number=' + _step_number + ']').removeClass('active')
                        _step_number+=1
                        $('.c-stepper__item[step-number=' + _step_number + ']').addClass('active')
                        genQuestion(event.data.data)
                    } );
                }

            splashScreen()
            $.getJSON($dataJSON, function(data) {
                _data = []
                var new_data = []
                var historique = JSON.parse( getCookie('quizz_historique') || JSON.stringify(
                    {
                        'question' : [],
                    }
                ))
                setCookie('quizz_historique', JSON.stringify(historique), 120)
                while ((new_data.length < 4) && (data.length > 0)) {
                    var a = Math.floor(Math.random() * data.length)
                    if (!(historique.question.includes(data[a].id))) {
                        _data.push(a)
                        new_data.push(data[a])
                    }
                    data.splice(a, 1)
                    if (a > 100){
                        break
                    }
                }
                $('.c-stepper').empty();
                for (let step = 1; step <= new_data.length; step++) {
                    // Runs 5 times, with values of step 0 through 4.
                    $('.c-stepper').append(`
                    <li class="c-stepper__item" step-number="` + step + `">
                    </li>
                    `)
                    console.log(step)
                }
                _step_number = 1
                $('.c-stepper__item[step-number=' + _step_number + ']').addClass('active')
                addToScrore(0)
                genQuestion(new_data)   
            });
            
            
        });
    });

}(jQuery, this));




