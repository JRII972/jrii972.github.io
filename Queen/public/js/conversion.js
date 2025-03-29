var lexique = false;
var conv_table = false;

$(document).ready(function(){
    const phonemeToRune = {
        'i': 'ᚠ', 'e': 'ᚢ', 'ɛ': 'ᚦ', 'a': 'ᚨ', 'ɑ': 'ᚱ', 'o': 'ᚲ', 'ɔ': 'ᚷ',
        'u': 'ᚹ', 'y': 'ᚺ', 'ø': 'ᚾ', 'œ': 'ᛁ', 'ə': 'ᛃ', 'ɛ̃': 'ᛇ', 'œ̃': 'ᛈ',
        'ɑ̃': 'ᛉ', 'ɔ̃': 'ᛋ', 'p': 'ᛏ', 'b': 'ᛒ', 't': 'ᛖ', 'd': 'ᛗ', 'k': 'ᛚ',
        'g': 'ᛜ', 'f': 'ᛞ', 'v': 'ᛟ', 's': 'ᛠ', 'z': 'ᛡ', 'ʃ': 'ᛢ', 'ʒ': 'ᛣ',
        'm': 'ᛤ', 'n': 'ᛥ', 'ɲ': 'ᛦ', 'ŋ': 'ᛧ', 'l': 'ᛨ', 'ʁ': 'ᛩ', 'h': 'ᛪ',
        'ʔ': '᛫', 'j': '᛬', 'ɥ': '᛭', 'w': 'ᛮ'
    };

    const phonemeToMayaInca = {
        'i': '𐤀', 'e': '𐤁', 'ɛ': '𐤂', 'a': '𐤃', 'ɑ': '𐤄', 'o': '𐤅', 'ɔ': '𐤆',
        'u': '𐤇', 'y': '𐤈', 'ø': '𐤉', 'œ': '𐤊', 'ə': '𐤋', 'ɛ̃': '𐤌', 'œ̃': '𐤍',
        'ɑ̃': '𐤎', 'ɔ̃': '𐤏', 'p': '𐤐', 'b': '𐤑', 't': '𐤒', 'd': '𐤓', 'k': '𐤔',
        'g': '𐤕', 'f': '𐤖', 'v': '𐤗', 's': '𐤘', 'z': '𐤙', 'ʃ': '𐤚', 'ʒ': '𐤛',
        'm': '𐤜', 'n': '𐤝', 'ɲ': '𐤞', 'ŋ': '𐤟', 'l': '𐤠', 'ʁ': '𐤡', 'h': '𐤢',
        'ʔ': '𐤣', 'j': '𐤤', 'ɥ': '𐤥', 'w': '𐤦'
    };

    

    $.ajax({
        url: "./public/data/converson_phone_table.csv",
        async: false,
        success: function (csvd) {
            conv_table = $.csv.toObjects(csvd, {separator : ';'});
        },
        error: function (param) { alert(param); },
        dataType: "text",
        complete: function () {
            console.log(conv_table)
        }
    });

    $.ajax({
        url: "./public/data/Lexique383.csv",
        async: false,
        success: function (csvd) {
            lexique = $.csv.toObjects(csvd, {separator : ','});
        },
        error: function (param) { alert(param); },
        dataType: "text",
        complete: function () {
            $('#converter').click(function (e) { 
                e.preventDefault();
                convertText()
            });
        }
    });


    function convertToRunic(text) {
        var t = ''
        $.each(text.toLowerCase().split('\n'), function (indexInArray, lineRow) { 
            $.each(lineRow.split(' '), function (indexInArray, word) { 
                // console.log(word)
                var find = false
                for (const key in lexique) {
                    if (Object.hasOwnProperty.call(lexique, key)) {
                        const row = lexique[key];
                        if ( word == row['ortho'] ) {
                            $.each([...row['phon']], function (indexInArray, phoneme) { 
                                $.each(conv_table, function (indexInArray, conversion) {
                                    if ( phoneme == conversion['ortho'] ) { 
                                        t = t.concat(conversion['rune'])
                                        return;
                                    }
                                });
                            });
                            t = t.concat(' ')
                            return;
                        } 
                    }
                }

                if ( find == false ) {
                    t = t.concat(word)
                }
                t = t.concat(' ')
            });

            t = t.concat('<br>')       
        });
        console.log(t)
        return t;
    }

    function convertText() {
        const inputText = document.getElementById('inputText').value;
        
        $( "#midresult" ).html( convertToRunic(inputText) );
        // $( "#result" ).html( result );
        
    }
});