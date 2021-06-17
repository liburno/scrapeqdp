# scraper di esempio

Con questo Scraper scarichiamo un po'di articoli dal sito https://www.qdpnews.it.

Tali articoli saranno memorizzati in formato JSON nella cartella "data", e ogni volta che si rilancerà lo scraper, verranno aggiornati solo gli articoli nuovi.


il programma utilizza [cheerio](https://www.npmjs.com/package/cheerio) e 
[liburno_lib](https://www.npmjs.com/package/liburno_lib).

Per la gestione delle immagini viene installato [sharp](https://www.npmjs.com/package/sharp), anche se in questi esempi non viene utilizzato.




Il programma è sviluppato in 6 parti diverse, in cui l'ultima (scrape5.js) congloba il tutto: 





### scrape0

si deve prima scaricare il file da testare: 

```
curl https://www.qdpnews.it >main_orig.html 
```


Questo primo file processa il file main_orig.html,  precedentemente scaricato, rimuovendo tutti gli oggetti 
non necessari (link,script ecc ottenendo un file piú facile da leggere) e salvando il risultato su `main.html`

### scrape1 

Questo ho visto che la pagina punta a diverse categorie e voglio una lista delle stesse.

Cerco i tag <a> e filtro quelli che interessano il criterio, fino a trovare quello che mi serve e memorizzare
un file categorie.json

### scrape2 

Questo ho visto che la pagina punta a diverse categorie e voglio una lista delle stesse

cerco i tag <a> e filtro i soli articoli validi ossia, quelli che appartengono all'url del sito e sono 
referenziati dalla categoria

memorizzo il tutto in una variabile arts, che ha come chiave il riferimento all' articolo e come valore 1, (che diventerà 2 quando l'articolo sarà processato!)

### scrape3 

qui metto insieme scape1, scape2 e scrape0, in modo da leggere le categorie direttamente online, 
e per ogni categoria cercare gli articoli che sono riferiti.

il tutto è salvato su arts.json

### scrape4 

Qui faccio lo scape di un articolo specifico che leggo dalla lista

Lo scopo è creare una struttura non HTML cheerio per ricavare i vari dati.

Il testo dell' articolo viene tradotto in formato MarkDown, con il parsing delle varie funzioni  (`parsepara`).

Interessante è anche il parsing della data, da stringa italiana a data...

### scrape5

E'il prodotto finale:  Metto tutto insieme e creo un database (in realtà salvo gli articoli nella cartella data in formato MD.

il flusso è il seguente:

- leggo l'index.html e ricavo tutte le categorie,
- ricavo contemporaneamente l'elenco degli articoli della mainpage che appartengono a una delle categorie
- per ogni categoria leggo la sua pagina e determino l'elenco degli articoli da scaricare.
- controllo quali articoli sono già stati scaricati e gli elimino dalla lista
- per ogni articolo, lo scarico e ottengo un JSON con le informazioni dello stesso: titolo, autore, data, settore, corpo e articoli collegati; il corpo è parsato per passare da HTML a formato MD
- aggiungo gli articoli collegati non ancora scaricati alla lista degli articoli
- ripeto fino ad aver scaricato tutti gli articoli


AA







