/*
Questo ho visto che la pagina punta a diverse categorie e voglio una lista delle stesse

cerco i tag <a> e filtro quelli che interessano il criterio, fino a trovare quello che mi serve e memorizzare
un file cats.json


*/



// ----------------------- cose comuni ------------------------------------
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const { Post, creaCartella, init } = require("liburno_lib");

var url = "https://www.qdpnews.it"


var post = new Post("");
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
    
    /*
    var data=await post.fetchtxt(`${url}`);
 
    var $ = cheerio.load(data);  // carica in cheerio
    $=removecoseinutili($); 
    // ho visto che non mi serve il footer 
    $('footer').remove();
    */ 
    var $=cheerio.load(fs.readFileSync("main.html"))
    var xx=$('a');
    var cat={};
    
    xx.each((i, data) => {
        var x = $(data);
        var a = x.attr('href')
        if (a.startsWith(url)) {
            a = a.substr(url.length);
            var rr=/^\/category(\/.+)?\/$/gim.exec(a);
            if (rr) {
                var ky=rr[1];
                if (!cat[ky]) cat[ky]=a;
                console.log(ky,a);
           }
        }
    })
    fs.writeFileSync('cats.json',JSON.stringify(cat,null,2));
    
}


main();









