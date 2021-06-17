/*
   Metto tutto insieme e creo un database (in realtà salvo gli articoli nella cartella data in formato MD
*/



// ----------------------- cose comuni ------------------------------------
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const { Post, creaCartella, init } = require("liburno_lib");

var url = "https://www.qdpnews.it"

var post = new Post();
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
                    a = a.replace(/\/\s*$/gim, '') // ** toglie lo / finale, per forma connessa al servizio new.liburno.com
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
        id: art,
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
    res.title = rr.find('.cs-entry__title').first().text();
    res.img = rr.find('.post-media img').first().attr("data-src")
    var tm = artexp.exec(art);
    if (tm) {
        res.section = tm[1].replace(/-/g, ' ');
    }
    var tm = rr.find('.cs-meta-date').first().text().split(',')[1].trim();
    var r2 = /(\d{1,2})\s+(\w+)\s+(\d{4})/gim.exec(tm);
    var dt;
    if (r2) {
        dt = new Date(parseInt(r2[3]), mesi.indexOf(r2[2].toLowerCase()), parseInt(r2[1]), 12)
    }
    if (!dt || dt > new Date()) dt = new Date();

    res.datepub = dt;
    res.datemod = dt;

    xx = rr.find('.entry-content p');
    var rb = [];
    xx.each((i, data) => {
        var x = $(data);
        var tm = x.html();
        var tm2 = x.text();
        tm = tm.replace(/\(Foto:.*?\)/gim, "").replace(/\#?qdpnews.it/gim, "");
        parsepara(tm, rb);
    });
    res.body = rb;
    return res;

}

var mdname = (x) => {
    var v = x.split('/');
    var res = x;
    if (v.length >= 1) res = v[v.length - 1];
    return path.join("data", res + ".json"); ``
}

async function main() {
    console.log(Bold + Yellow + 'get categories and new articles', Reset);
    $ = cheerio.load(await post.fetchtxt(`${url}`));  // carica in cheerio
    getcats($);
    creaCartella("data");
    getlinkedarts($);
    // dopo il main, cerco tutti gli articoli per ogni categoria selezionata
    for (var x in cats) {
        var art = `${url}${cats[x]}`
        console.log(Green, cats[x], Reset);
        $ = cheerio.load(await post.fetchtxt(art));  // carica in cheerio
        getlinkedarts($);
    }
    //fs.writeFileSync("arts.json", JSON.stringify({ cats, arts }, null, 2));
    // a questo punto crea gli articoli
    var todos = [];
    for (var x in arts) {
        var md = mdname(x);
        if (fs.existsSync(md)) {
            arts[x] = 2; ``
        } else {
            todos.push(x);
        }
    }
    for (var ii = 0; ii < todos.length; ii++) {
        var art = todos[ii];
        var md = mdname(art);
        if (!fs.existsSync(md)) {
            $ = cheerio.load(await post.fetchtxt(`${url}${art}/`))
            var res = loadart($, art);
            console.log(Reset + "->", ii, Yellow, md);
            fs.writeFileSync(md, JSON.stringify(res, null, 2));
            arts[art] = 2;
            for (var x of res.links) {
                if (!arts[x]) {
                    arts[x] = 1;
                    todos.push(x);
                }
            }
        }
    }
//    fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2))
}

main();









