/*
    qui metto insieme scape1, scape2 e scrape0, in modo da leggere le categorie direttamente dal file
    e per ogni categoria cercare gli articoli che sono riferiti
*/



// ----------------------- cose comuni ------------------------------------
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const { Post, creaCartella, init } = require("liburno_lib");
const { getMaxListeners } = require('process');

var url = "https://www.qdpnews.it"

var post = new Post("");
const { Reset, Bold, Reverse, Red, Green, Yellow, Blue, Magenta, Cyan, White } = init();

// --------------------------------------------------------------------------
var arts={}
var cats={}
var $;


function getcats($) {
    var xx=$('a');
    xx.each((i, data) => {
        var x = $(data);
        var a = x.attr('href')
        if (a.startsWith(url)) {
            a = a.substr(url.length);
            var rr=/^\/category(\/.+)?\/$/gim.exec(a);
            if (rr) {
                var ky=rr[1];
                if (!cats[ky]) cats[ky]=a;
           }
        }
    })
 
}

function getlinkedarts($) {
    var xx=$('article a');
    xx.each((i, data) => {
        var x = $(data);
        var a = x.attr('href')
        if (a.startsWith(url)) {
            a = a.substr(url.length);
            var rr=/\/[\w-]+(\/)$/gim.exec(a);
            if (rr) {
                var ini=a.substr(0,rr.index)
                if (cats[ini]) {
                    if (!arts[a]) {
                        arts[a]=1;   
                    }
                }
            }
        }
    })
 }


async function main() {
    console.log(Bold+Yellow+'get categories and new articles',Reset);
    $ = cheerio.load(await post.fetchtxt(`${url}`));  // carica in cheerio
    getcats($) ;
    getlinkedarts($);
    // dopo il main, cerco tutti gli articoli per ogni categoria selezionata
    for (var x in cats) {
        var art=`${url}${cats[x]}`
        console.log(Green,cats[x],Reset);
        $ = cheerio.load(await post.fetchtxt(art));  // carica in cheerio
        getlinkedarts($);
    }
    fs.writeFileSync("arts.json",JSON.stringify({cats,arts},null,2))    
}

main();









