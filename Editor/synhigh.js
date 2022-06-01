function enclose(string, word, tag, attributes){
    let replacestr = '<'+tag;
    for (i in attributes){
        replacestr+=' '+i+' = '+attributes[i];
    }
    replacestr+='> '+word+' </'+tag+'>';
    string = string.replaceAll(word, replacestr);
    return string;
}

function highlight(code, dict){
    for (i in dict){
        for (j in dict[i]){
            code = enclose(code, j, 'font', {'color':i});
        }
    }
}
