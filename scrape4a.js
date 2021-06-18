

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



var page="https://www.qdpnews.it/comuni/crocetta-del-montello/a-crocetta-del-montello-lo-sport-si-pratica-allaria-aperta-zanella-iniziativa-per-incentivare-lattivita-fisica-e-promuovere-il-territorio/"
// "/comuni/maser/secondo-doro-per-mezzacasa-al-vallecamonica-terzo-podio-consecutivo-per-il-pilota-di-agordo-portacolori-di-xmotors-team/": 1,


async function main() {
    var $=cheerio.load (await post.fetchtxt(`${page}`));
    var rr = $('.cs-main-content').first();
  
    var tm=rr.find(".cs-entry__title").first();
    console.log(tm.text());    
    var autore=rr.find(".cs-author").first();
    console.log(Green,"Autore:",Reset,autore.text());
    


}

main();
