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

// toglie un po di cose inutili  e crea main.html

async function main() {
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
                console.log(rr);
                var ky=rr[1];
                if (!cat[ky]) cat[ky]=a;
               // console.log(ky,a);
           }
        }
    })
    fs.writeFileSync('cats.json',JSON.stringify(cat,null,2));
    
}


main();









