
export function genBox(data, cible = 'body') {
    
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
    console.log(cible)
    $(cible).append(
        start + header + categorie + proficiency + description + warning + cost + end
    )

    $('#'+ data.id).click(function () {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('#modalView .modal-content').empty();
            $(this).clone().appendTo('#modalView .modal-content');
            $("#modalView").show();
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
};

// $(document).ready(function(data){

//     $.getJSON( "./public/js/data.json", function( data ) {
//         data.forEach(el => genBox(el));
//       });
    
// });


$(document).ready(function(){
    $('.data-box').click(function () {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('#modalView .modal-content').empty();
            $(this).clone().appendTo('#modalView .modal-content');
            $("#modalView").show();
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