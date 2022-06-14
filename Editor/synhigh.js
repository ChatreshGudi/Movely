function enclose(string, word, tag, attributes){
    let replacestr = '<'+tag;
    for (i in attributes){
        
        replacestr+=' '+i+' = '+attributes[i];
    }
    replacestr+='> '+word+' </'+tag+'>';
    string = string.replaceAll(word, replacestr);
    return string;
}

function detectSTR(code){
    let strbeg = false;
    let string = '';
    let strings = [];
    for ( let i = 0; i<code.length; i++ ){
        if (strbeg == false){
            if (code.charAt(i) == '"'){
                strbeg = true;
            }
        }
        else if (strbeg == true){
            if (code.charAt(i) == '"'){
                strbeg = false;
                strings.push(string);
                string = '';
            }
            else{
                string+=code.charAt(i);
            }
        }
    }
    strbeg = false;
    for ( let i = 0; i<code.length; i++ ){
        if (strbeg == false){
            if (code.charAt(i) == "'"){
                console.log();
                strbeg = true;
            }
        }
        else if (strbeg == true){
            if (code.charAt(i) == "'"){
                strbeg = false;
                console.log(string);
                strings.push(string);
            }
            else{
                string+=code.charAt(i);
            }
        }
    }
    return strings;
}

function highlight(code, dict){
    for (i in dict){
        words = dict[i]
        let color = i;
        for (let j = 0; j<words.length;j++){
            code = enclose(code, words[j], 'font', {'color': color});
        }
    }
    console.log(code);
    let strings = detectSTR(code);
    console.log(strings);
    for (let i = 0; i<strings.length; i++){
        code = enclose(code, strings[i], 'font', {'color':'#00FF00'});
    }
    return code;
}

function highlightjs(domobj){
    code = domobj.innerHTML;

}
