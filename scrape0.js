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
// --------------------------------------------------------------------------


function removecoseinutili($)  {
    $('script').remove();  
    $('link').remove();
    $('style').remove();
    $('noscript').remove();
    //    $('meta').remove();
    
    var v = $.html().split("<!--");
    for (var i = 1; i < v.length; i++) {
        var c = v[i].split('-->');
        c.shift();
    
        v[i] = c.join('')
    }
    v = v.join('\n').lines();
    
    var v1 = [];
    var i = 0;
    for (var a1 of v) {
        a = a1.replaceAll('\t', ' ').trim();
        if (a.length > 0) {
            v1.push(a1);
        }
        i++
    }
   return cheerio.load(v1.join('\n'));
} 


// toglie un po di cose inutili  e crea main.html

async function main() {
    // var data=fs.readFileSync("main_orig.html").toString();  // ottenuto con curl https://www.qdpnews.it >main_orig.html 
    var data=await post.fetchtxt(`${url}`);
     var $ = cheerio.load(data);  // carica in cheerio
    $=removecoseinutili($); 
    $('footer').remove();
 
 
 
    fs.writeFileSync("main.html",$.html());

}


main();









