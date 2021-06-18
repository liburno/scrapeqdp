/*
Questo primo file processa un HTML precedentemente scaricato, rimuovendo tutti gli oggetti 
non necessari (link,script ecc ottenendo un file piú facile da leggere)


*/



// ----------------------- cose comuni ------------------------------------
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const { Post, creaCartella, init } = require("liburno_lib");

var url = "https://www.qdpnews.it"

var post = new Post();
init();

// toglie un po di cose inutili  e crea main.html

async function main() {
    var $ = cheerio.load(await post.fetchtxt(`${url}`));
   
    $('footer,script,style,link,img,noscript').remove();
    fs.writeFileSync("main.html",$.html());

}


main();









