
$(document).ready(function(data){
    data = {
        "id" : "AGLETLV1",
        "type" : "assassin",
        "titre" : "AGLET",
        "level" : "1",
        "sub_info" : "A.G.L.E.T",
        "categorie" : "Dash & Hit",
        "bonus" : "Assaut guerrier latéral en traître",
        "description" : "Si le joueur tente de reverser un ennemi en étant discret il gagne un bonus (égal au bonus de maitrise de son niveau) pour effectuer l'action. Si réussit, il inflige des dégâts (de son arme + ??)",
        "warning" : false,
        "style" : ["archerie"],
        "prix" : 3,
        "img" : "twins.png",
    
        "proficiency" : [
            {
                "icon" : "bonus-deg.png",
                "alt" : "Bonus de dégat"
            }
        ]
    }

    function genBox(data) {
        var start = '<div class="data-box ' + data.type + '" id="' +  data.id + '">'
        var header = `
        <div class="data-header">
            <div class="data-info">
                <h1>` + data.titre + `</h1>
                <div class="damage">
                    <div>
                        <!-- <img src="./.png" alt="Damage Icon" width="20"> -->
                        ` + data.sub_info + `
                    </div>
                    <span class="sub-info">` + data.type + `</span>
                </div>
            </div>
            <div class="data-img">
                <img src="./public/img/` + data.img + `" alt="Data Icon">
            </div>
        </div>
        `
        var categorie = `
        <div class="weapon-enchantment more-info">
            <span>` + data.categorie + `</span>
        </div>
        `
        
        var proficiency = `<div class="proficiency more-info">
            <span>` + data.bonus + `</span>
            ` + data.proficiency.map( function(e){
                    return '<img src="./public/img/icon/' + e.icon + '" alt="' + e.alt + '" width="35" class="proficiency-icon">';        
                }).join() + `
        </div>
        `

        var description = `<div class="description more-info">
            <span>bonus de dégât si attaque la même personne que son jumeau spirituelle</span>
        </div>`
        
        var warning = data.warning ? `<div class="warning more-info">
            <span>⚠️ ` + data.warning + `</span> 
        </div>` : ""
        
        
        var style = data.style ? '<div class="type">' + data.style.map( function(e){
            return '<span><img src="./public/img/icon/' + e + '.png" alt="Mace Icon" width="35"></span>' ;        
        }).join() + '</div>' : ""

        var cost = `<div class="cost">
            <span>` + '?' + `⚖️</span>
            <span>` + data.prix + `⚡</span>
        </div>` 

        var end = '</div>'

        $('body').prepend(
            start + header + categorie + proficiency + description + warning + style + cost + end
        )
    };

    genBox(data);
    
});


$(document).ready(function(){
    $('.data-box').click(function () {
        if ( $(this).find('.more-info').is(":hidden")) {
            $('.more-info').hide()
            $(this).find('.more-info').toggle();
        } else {
            $('.more-info').hide()
        }
        
        document.instance.repaint(document.getElementById("jsplumb"));
    } );
});