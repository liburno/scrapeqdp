/*
Questo ho visto che la pagina punta a diverse categorie e voglio una lista delle stesse

cerco i tag <a> e filtro i soli articoli validi ossia, quelli che appartengono all'url del sito e sono 
referenziati dalla categoria

memorizzo il tutto in una variabile arts, che ha come chiave il riferimento all' articolo e come valore 1, (che diventerà 2 quando l'articolo sarà processato!)

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


async function main() {
    var $=cheerio.load(fs.readFileSync("main.html"))
    var xx=$('a');
    
    var cat=JSON.parse(fs.readFileSync('cats.json'));
    var art={};

    xx.each((i, data) => {
        var x = $(data);
        var a = x.attr('href')
        if (a.startsWith(url)) {
            a = a.substr(url.length);
            
            var rr=/\/[\w-]+(\/)$/gim.exec(a);
            if (rr) {
                console.log(rr);
                var ini=a.substr(0,rr.index)
                if (cat[ini]) {
                    if (!art[a]) {
                        art[a]=1;   
                    }
                }
            }
        }
    })
    fs.writeFileSync("art.json",JSON.stringify(art,null,2))    
}


main();









