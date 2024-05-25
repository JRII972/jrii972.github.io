export var genModal = function (data) {
    if( !$('#modalView').length ) {
        $('body').append(`<div id="modalView" class="modal" style="display: block;">
        <div class="modal-content">
            <div class="modal-header">
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                      <a class="nav-link active competence" href="#">Compétence</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link parent" href="#">Hierarchy</a>
                    </li>
                </ul>
            </div>
            <div class="modal-body">
                <div class="box">
                    <div class="data-box assassin" id="assassin_de_lombre">
                        <div class="data-header">
                            <div class="data-info">
                                <h1>Assassin de l'ombre</h1>
                                <div class="damage">
                                    <div>
                                        <!-- <img src="./public/img/icon/archerie.png" alt="Damage Icon" width="20"> -->
                                        Bonus de discrétion dans les ombres
                                    </div>
                                </div>
                                <span class="sub-info">Assassin</span>
                            </div>
                            <div class="data-img">
                                <img src="./public/img/bonus-deg.png" alt="Data Icon">    
                            </div>
                        </div>
                        
                        <div class="weapon-enchantment more-info">
                            <span>Furtivité</span>
                        </div>
                        <div class="proficiency more-info">
                            <span>Become one with the shadows, like Batman, but quieter.</span>
                            <img src="./public/img/icon/bonus-deg.png" alt="Bonus de dégat" width="35" class="proficiency-icon">
                        </div>
                        <div class="description more-info">
                            <span>Bonus de discrétion lorsqu'il est dans l'ombre.</span>
                        </div><div class="warning more-info">
                            <span>⚠️ Nécessite une source d'ombre</span> 
                        </div><div class="cost"> <div class="type"><span><img src="./public/img/icon/archerie.png" alt="archerie" width="35"></span></div>
                            <div><span>?⚖️</span>
                            <span>2⚡</span></div>
                        </div>
                    </div>
                </div>
                <div class="parent">
                    <div id="accordion">
                        <div class="card">
                          <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                              <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Débloquer par 
                              </button>
                            </h5>
                          </div>
                      
                          <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                            <div class="card-body">
                                <h5>Obligatoire</h5>
                                <ul>
                                    <li>Parent 1</li>
                                    <li>Parent 2</li>
                                    <li>Parent 3</li>
                                </ul>
                                <hr>
                                <h5>Composant</h5>
                                <ul>
                                    <li>Parent 1</li>
                                    <li>Parent 2</li>
                                    <li>Parent 3</li>
                                </ul>
                            </div>
                          </div>
                        </div>
                        <div class="card">
                          <div class="card-header" id="headingTwo">
                            <h5 class="mb-0">
                              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Débloque
                              </button>
                            </h5>
                          </div>
                          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                            <div class="card-body">
                              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            </div>
                          </div>
                        </div>
                        <div class="card">
                          <div class="card-header" id="headingThree">
                            <h5 class="mb-0">
                              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Collapsible Group Item #3
                              </button>
                            </h5>
                          </div>
                          <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                            <div class="card-body">
                              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
            </div>
        </div>
    </div>`)
    }
    
    $('#modalView .modal-content .modal-body .box').empty();
    $('#modalView .modal-content .box').append(genBox(data, null));
    $("#modalView").show();

    $('#modalView .competence').click(function () {
        $('#modalView .modal-header .nav-link').removeClass('active')
        $(this).addClass('active')
        $('#modalView .modal-content .modal-body .box').show()
        $('#modalView .modal-content .modal-body .parent').hide()
    })
    $('#modalView .parent').click(function () {
        $('#modalView .modal-header .nav-link').removeClass('active')
        $(this).addClass('active')
        $('#modalView .modal-content .modal-body .box').hide()
        $('#modalView .modal-content .modal-body .parent').show()
    })    
}

$('#modalView .competence').click(function () {
    $('#modalView .modal-header .nav-link').removeClass('active')
    $(this).addClass('active')
    $('#modalView .modal-content .modal-body .box').show()
    $('#modalView .modal-content .modal-body .parent').hide()
})
$('#modalView .parent').click(function () {
    $('#modalView .modal-header .nav-link').removeClass('active')
    $(this).addClass('active')
    $('#modalView .modal-content .modal-body .box').hide()
    $('#modalView .modal-content .modal-body .parent').show()
}) 

export var genBox = function (data, cible = 'body', active = true, modalOnly = false) {
    
    if (data.Titre.includes('(Lv1)')) { 
        data.level = 1
        data.Titre = data.Titre.replace('(Lv1)', '')
     }
    if (data.Titre.includes('(Lv2)')) { 
        data.level = 2
        data.Titre = data.Titre.replace('(Lv2)', '')
     }
    if (data.Titre.includes('(Lv3)')) { 
        data.level = 3
        data.Titre = data.Titre.replace('(Lv3)', '')
     }

    var start = '<div class="data-box ' + data.Type.toLowerCase() + '" id="' +  data.id + '">'
    var header = `
    <div class="data-header">
        <div class="data-info">
            <h1>` + data.Titre + `</h1>
            <div class="damage">
                <div>
                    <!-- <img src="./public/img/icon/archerie.png" alt="Damage Icon" width="20"> -->
                    ` + data.Sub_info + `
                </div>
            </div>
            <span class="sub-info">` + data.Type + `</span>
        </div>
        <div class="data-img">
            <img src="./public/img/` + (data.img ? data.img : "bonus-deg.png") + `" alt="Data Icon">    
        </div>
    </div>
    `
    var categorie = `
    <div class="weapon-enchantment more-info">
        <span>` + data.Catégorie + `</span>
    </div>
    `
    data.proficiency = [
        {
            "icon" : "bonus-deg.png",
            "alt" : "Bonus de dégat"
        }
    ]

    var proficiency = `<div class="proficiency more-info">
        <span>` + data.Bonus + `</span>
        ` + data.proficiency.map( function(e){
            return '<img src="./public/img/icon/' + e.icon + '" alt="' + e.alt + '" width="35" class="proficiency-icon">';        
        }).join() + `
    </div>
    `

    var description = `<div class="description more-info">
        <span>` + data.Description + `</span>
    </div>`
    
    var warning = data.Warning ? `<div class="warning more-info">
        <span>⚠️ ` + data.Warning + `</span> 
    </div>` : ""
    
    data.style = [data.Style_1.toLowerCase()]
    data.style = ["archerie"]
    var style = data.style ? '<div class="type">' + data.style.map( function(e){
        return '<span><img src="./public/img/icon/' + e + '.png" alt="' + e + '" width="35"></span>' ;        
    }).join() + '</div>' : ""

    var level = data.level ? '<div class="level"> Lv' + data.level + '</div>' : ""

    var cost = `<div class="cost"> ` + style + level + `
        <div><span>` + '?' + `⚖️</span>
        <span>` + data.Prix + `⚡</span></div>
    </div>` 

    var end = '</div>'
    
    if (cible == null) {
        return start + header + categorie + proficiency + description + warning + cost + end
    }


    $(cible).append(
        start + header + categorie + proficiency + description + warning + cost + end
    )

    if (active) {
        $('#'+ data.id).click(function () {
        
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || modalOnly == true) {
                genModal(data)
            } else {
                if ( $(this).find('.more-info').is(":hidden")) {
                    $('.more-info').hide()
                    $(this).find('.more-info').toggle();
                } else {
                    $('.more-info').hide()
                }
            }
            
            try {
                document.instance.repaint(document.getElementById("jsplumb"));
            } catch (error) {
                
            }
        } );
    }
};

// $(document).ready(function(data){

//     $.getJSON( "./public/js/data.json", function( data ) {
//         data.forEach(el => genBox(el));
//       });
    
// });



$(document).ready(function(){
    $('.data-box').click(function () {
        
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            genModal({
                "id": "aglet",
                "Titre": "AGLET",
                "Type": "Assassin",
                "Catégorie": "Attaque",
                "Sub_info": "Bonus de discrétion",
                "Bonus": "Assassinate with flair! Just like in those sneaky games.",
                "Description": "Permet de reverser un ennemi en étant discret.",
                "Warning": "Doit être en mode furtif",
                "Style_1": "Assassinat",
                "Style_2": "",
                "Prix": 3,
                "Level": 1
              })
        } else {
            if ( $(this).find('.more-info').is(":hidden")) {
                $('.more-info').hide()
                $(this).find('.more-info').toggle();
            } else {
                $('.more-info').hide()
            }
        }
        
        document.instance.repaint(document.getElementById("jsplumb"));
    } );

    

    $(document).mouseup(function(e) 
    {
        var container = $("#modalView .modal-content");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            $("#modalView").hide();
        }
    });

    addEventListener("gestureend", (event) => {
        console.log(event)
    });

});