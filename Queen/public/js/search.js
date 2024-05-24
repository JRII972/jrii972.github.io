import { genBox } from "./dataBox.js";

$(document).ready(function(data){

    var add_to_category = function (value) {
        localStorage.setItem("categories_selected", JSON.stringify(value))
    }
    var get_category = function () {
        return JSON.parse(localStorage.getItem("categories_selected"));
    };

    $.getJSON( "./public/js/data.json", function( data ) {
        var category = []
        var type = []
        var style = []
        data.forEach(_d => {
            category.push(_d.Catégorie)
            type.push(_d.Type)
            if (_d.Style_1 != undefined & _d.Style_1 != '') { style.push(_d.Style_1) }
            if (_d.Style_2 != undefined & _d.Style_2 != '') { style.push(_d.Style_2) }
        });
        category = [...new Set(category)];
        type = [...new Set(type)];
        style = [...new Set(style)];
        
        var cat = [...new Set(category.concat(style))]

        
        var search = function () {  
            var search_text = $('#search_box').val()
            var filter  = []
            $('#type input').each(function(i, input) {
                if ($(input).is(':checked')) {
                    filter.push($(input).val())
                }
            });

            var cat_filter = get_category() || []

            $('#results_empty').hide()
            $('#results').empty();
           var filtered_data = $.grep(data, function(obj) {
                if ( search_text != '') {
                    if (( !obj.Titre.includes(search_text) ) && ( !obj.Sub_info.includes(search_text) ) && ( !obj.Description.includes(search_text) ) && ( !obj.Warning.includes(search_text) ) ){
                        return false
                    }
                }
                if ( filter.length > 0 ) {
                    if ( filter.includes(obj.Type) == false ){ return false }
                }
                if ( cat_filter.length > 0 ) {
                    if ( (cat_filter.includes(obj.Catégorie) == false) && (cat_filter.includes(obj.Style_1) == false) && (cat_filter.includes(obj.Style_2) == false) ){ return false }
                }
                genBox(obj, '#results', true, true)
                return true
            })
            if (filtered_data.length == 0) {
                $('#results_empty').show()
            }
        };

        add_to_category([])
        
        document.selectize = $('#categories').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: true,
            valueField: 'title',
            labelField: 'title',
            searchField: 'title',
            options: cat.map(x => {
                return({
                    title: x
                });
              }),
            create: false,
            createFilter: function (input) {
                return cat.includes(input);
              },
            onChange       : add_to_category,
            onItemAdd       : search,
            onItemRemove    : search,
        });

        type.forEach(el => {
            $('#type').append(`<div class="filter">
                <label><input type="checkbox" name="`+ el + `" value="`+ el + `"> `+ el + `</label>
            </div>`)
        });

        $("#type input").change(function(){search()});
        $("#search_box").change(function(){search()});
        $("#search_box").keydown(function(){search()});

        search();
      });

});