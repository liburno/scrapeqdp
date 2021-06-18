/*
    qui faccio lo scape di un articolo specifico che leggo dalla lista
    lo scopo è creare una struttura non HTML cheerio per ricavare i vari dati.
    Il testo dell' articolo viene tradotto in formato MarkDown, con il parsing delle varie funzioni 
*/



// ----------------------- cose comuni ------------------------------------
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const { Post, creaCartella, init } = require("liburno_lib");

var url = "https://www.qdpnews.it"
const urlpost = ""

var post = new Post("");
const { Reset, Bold, Reverse, Red, Green, Yellow, Blue, Magenta, Cyan, White } = init();
// --------------------------------------------------------------------------
var arts = {}
var cats = {}
var $;
var tot = [];
const mesi = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const artexp = /^\/([\w-]+)\/([\w-]+)\/?$/gim



// prova a convertire del testo HTML in markdown, dove possibile!
var parsepara = (tm, rr) => {
    var parsestr = (data) => {
        if (data) {
            data = data.replaceAll("&quot;", '"').replaceAll("&apos;", "'");
            var v = data.split('&#x');
            var v1 = [];
            v1.push(v[0]);
            for (var i = 1; i < v.length; i++) {
                var j = v[i].indexOf(';');
                if (j > 0) {
                    v1.push(String.fromCharCode(parseInt(v[i].substr(0, j), 16)))
                }
                v1.push(v[i].substr(j + 1));
            }
            return v1.join('');
        } else {
            return "";
        }
    }
    var myreplace = (data, from, to) => {
        var v = data.split(from);
        for (var i = 0; i < v.length; i++) {
            v[i] = v[i].trim();
        }
        return v.join(to);
    }
    tm = tm.replaceAll('\n', ' ').replaceAll('  ', ' ')
    var vv = tm.split('<br>');
    for (var v of vv) {
        if (v) {
            v = myreplace(v, "<strong>", " **");
            v = myreplace(v, "</strong>", "** ");
            v = myreplace(v, "<em>", " *");
            v = myreplace(v, "</em>", "* ");

            rr.push(parsestr(v));
        }
    }
}



function getcats($) {
    var xx = $('a');
    xx.each((i, data) => {
        var x = $(data);
        var a = x.attr('href')
        if (a.startsWith(url)) {
            a = a.substr(url.length);
            var rr = /^\/category(\/.+)?\/$/gim.exec(a);
            if (rr) {
                var ky = rr[1];
                if (!cats[ky]) cats[ky] = a;
            }
        }
    })

}

function getlinkedarts($) {
    var xx = $('a');
    res = new Set();
    xx.each((i, data) => {
        var x = $(data);
        var a = x.attr('href')
        if (a.startsWith(url)) {
            a = a.substr(url.length);

            var rr = /\/[\w-]+(\/)$/gim.exec(a);
            if (rr) {
                var ini = a.substr(0, rr.index)
                if (cats[ini]) {
                    res.add(a);
                    if (!arts[a]) {
                        arts[a] = 1;
                        //            console.log(Green,a);  
                    }
                }
            }
        }
    })
    return [...res];
}

function loadart($, art) {
    var res = {
        links: getlinkedarts($)
    };
    var xx = $('meta');
    xx.each((i, data) => {
        var x = $(data);
        var ky = x.attr("name");
        if (!ky) ky = x.attr("property");
        var v = x.attr("content");
        switch (ky) {
            case "author":
                res.autore = v;
                break;
            case "image":
                if (v.indexOf(':') < 0)
                    v = path.join(url, v);
                res.img = v;
                break;
        }
    })
    var rr = $('.cs-main-content').first();
    res.reading=rr.find('.cs-meta-reading-time').first().text();
    res.title = rr.find('.cs-entry__title').first().text();
    res.img = rr.find('.post-media img').first().attr("data-src")
    var tm = artexp.exec(art);
    if (tm) {
        res.section = tm[1].replace(/-/g, ' ');
    }
    res.dataoriginale=rr.find('.cs-meta-date').first().text();
    var tm = res.dataoriginale.split(',')[1].trim();
    var r2 = /(\d{1,2})\s+(\w+)\s+(\d{4})/gim.exec(tm);
    var dt;
    if (r2) {
        dt = new Date(parseInt(r2[3]), mesi.indexOf(r2[2].toLowerCase()), parseInt(r2[1]), 12)
    }
    if (!dt || dt>new Date()) dt = new Date();

    res.datepub = dt;
    res.datemod = dt;

    xx = rr.find('.entry-content p');
    var rb = [];
    xx.each((i, data) => {
        var x = $(data);
        var tm = x.html();
        var tm2 = x.text();
        //tm=tm.replace(/\(Foto:.*?\)/gim,"").replace(/\#?qdpnews.it/gim,"");
        parsepara(tm, rb);
    });
    res.body = rb;
    return res;

}



async function main() {
   
   
    var tm = JSON.parse(fs.readFileSync("arts.json"));
    cats = tm.cats;
    arts = tm.arts;
    var aa="/comuni/crocetta-del-montello/a-crocetta-del-montello-lo-sport-si-pratica-allaria-aperta-zanella-iniziativa-per-incentivare-lattivita-fisica-e-promuovere-il-territorio/"
    var data=await post.fetchtxt(`${url}${aa}`)
    $= cheerio.load(data);
    $('script,link,style,noscript,footer').remove();
    fs.writeFileSync("articolo.html",$.html());
    getlinkedarts($);
    $ = cheerio.load(data);
    var res=loadart($,aa);
    fs.writeFileSync("articolo.json",JSON.stringify(res,null,2));

}

main();









