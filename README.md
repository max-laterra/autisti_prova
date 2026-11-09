# La Terra Autisti – App dell'autista

**Versione 1.14** — 9 novembre 2026

Il numero di versione è scritto anche nell'app, in fondo alla pagina **Profilo**:
serve a controllare quale versione è arrivata sul telefono dopo un aggiornamento.

---

## I file di questo pacchetto

Vanno caricati tutti nella radice del repository **autisti_prova** su GitHub
(Add file › Upload files, poi Commit changes).

| File | A cosa serve |
|---|---|
| `index.html` | **È l'app.** |
| `sw.js` | Riceve le notifiche e apre l'app quando le tocchi. |
| `manifest.webmanifest` | Nome e icona dell'app sulla schermata Home. |
| `icons/` | Le icone. |
| `vendor/` | La libreria che mostra i fogli di servizio in PDF (pdf.js, licenza Apache 2.0) e la licenza del carattere Archivo (SIL OFL). |
| `README.md` | Questo file. |

Dopo il caricamento: sul telefono chiudi del tutto l'app, aspetta 10 minuti e
riaprila. In fondo al Profilo deve esserci «versione 1.14».

Questa versione va insieme al **servizio notifiche 1.9** (Cloudflare) e
all'**app Presenze 1.11** (che non cambia).

---

## Modifiche della versione 1.14

### Più autisti nello stesso servizio
Quando nell'Agenda Massimo mette più autisti sullo stesso servizio, il foglio
arriva già a tutti. Dalla 1.14 l'app riconosce due casi:
- **Stesso pullman**: più autisti nello stesso foglio (un solo pullman), come
  la gita a Cesarò dell'8 novembre con Lo Buglio e Calabrese.
- **Pullman separati**: fogli diversi con **stesso cliente, stessi giorni,
  stessa ora di partenza e stesso luogo di carico**, come le navette del
  Comune di Ragusa del 1° novembre. Il luogo di carico è la parte «da …»
  dell'itinerario («da ragusa x scicli» → Ragusa); se l'itinerario non comincia
  con «da», conta l'itinerario intero. Se un giorno l'Agenda manderà un campo
  `luogoCarico`, l'app userà quello.

### Animazione «insieme» (i tesserini)
- «MARIO / DOMANI SEI INSIEME A / LUCA» (con più colleghi «PINO E UGO»), con i
  tesserini degli autisti: collegati a un solo pullman se è lo stesso, ognuno
  con il suo pullman se sono separati. Sotto: «Sullo stesso pullman» con data,
  posti e targa, oppure «Ognuno con il suo pullman» con i posti di ciascuno.
- Compare **quando arriva il foglio** (con il giorno: «GIOVEDÌ 12 SEI INSIEME
  A») e **la sera prima** («DOMANI»), una volta ciascuna; se il foglio arriva
  proprio la sera prima, una volta sola. Si chiude **solo con OK**.
- Se arriva il foglio di un altro collega dello stesso servizio, ricompare con
  i nomi aggiornati (anche con l'app aperta).
- Ordine all'apertura: animazione di apertura, festa, riposo o rimessa di
  domani, «insieme», poi la domanda sulle crocette di ieri.
- Nelle schede dei servizi: «Con Luca Verdi · stesso pullman» oppure «Con Pino
  Bianchi · ognuno il suo pullman».
- Nella prova con i dati di esempio: Profilo › Animazioni › «Insieme».

### Busta spese con lo stesso pullman
- Scrive nella busta **solo il primo autista** dell'elenco dell'Agenda.
- Gli altri la vedono, aggiornata, con la scritta «La busta la gestisce …: tu
  puoi solo guardarla»: niente spese nuove, km, note o consegna. Il loro
  telefono non riscrive mai la busta.
- Con i pullman separati ognuno ha la sua busta, come prima.

### Dati sul telefono
Dei fogli degli altri autisti il telefono tiene solo quello che serve per
sapere chi è insieme: una chiave cifrata del servizio, i nomi degli autisti e
i posti del pullman (niente cliente né itinerario). Alla prima apertura della
1.14 i fogli degli altri si rileggono una volta.

### Prove fatte prima della consegna (1.14)
Con Dropbox e archivio simulati e due telefoni: 32 controlli sulle novità
(stesso pullman, pullman separati, luogo di carico o ora diversi esclusi,
animazione all'arrivo e la sera prima, solo con OK, collega aggiunto con l'app
aperta, schede, busta in sola lettura per il secondo autista, notifiche del
servizio 1.9, errore 520), più i 36 controlli di sicurezza e i 45 del giro con
l'app Presenze: tutti superati.

---

## Modifiche della versione 1.13

### 1. Tasto «OK» e conferma per l'ufficio
- Nelle animazioni del riposo e della rimessa di domani il tasto ora dice
  **«OK»** (prima «Va bene»). Nelle feste resta **«Grazie!»**.
- Riposo e rimessa si chiudono **solo con OK**: toccando lo schermo non si
  chiudono più. Le feste si chiudono anche toccando lo schermo, come prima.
- Quando l'autista preme OK, il telefono scrive in
  `/telefoni/visti/<autista>.json` il giorno, il tipo (`RI` riposo, `RM`
  rimessa) e l'ora; se non c'è campo lo manda appena torna. Il servizio
  notifiche 1.8 lo porta all'app Presenze 1.11, dove l'icona si colora.
- Il file si scrive anche vuoto alla prima apertura: così l'ufficio sa che quel
  telefono ha l'app 1.13 (per gli altri le icone in Presenze restano come prima).
- Se l'ufficio cambia il giorno (per esempio da riposo a rimessa), compare la
  nuova animazione e serve un nuovo OK.
- Si tengono le conferme degli ultimi 7 giorni e di quelli futuri.

### 2. Animazione di apertura
- Le tre frecce del pullman (arancio, rossa, rosso scuro) attraversano lo
  schermo, poi compaiono il logo, «AUTISTI» e **«BUON LAVORO»**. Dura circa
  2,5 secondi; toccando lo schermo si salta.
- Parte quando si apre l'app e quando ci si torna dopo un po' che non la si
  usa. I minuti si scelgono nel **Profilo › Animazione di apertura** (1, 2, 3,
  4, 5 o 10 minuti; **predefinito 3**); lì c'è anche «Guardala adesso».
- Non parte: entrando con la password (c'è già il pullman della schermata
  d'ingresso), tornando dalla fotocamera dello scontrino, sui telefoni con
  «riduci movimento» attivo.
- Dopo l'animazione di apertura arrivano, come prima, la festa del giorno e il
  riposo o la rimessa di domani. Il riposo di domani ricompare quando parte
  l'animazione di apertura (prima: dopo 5 minuti fissi).

### Prove fatte prima della consegna (1.13)
Giro completo con un archivio Supabase simulato, un Dropbox simulato, il
servizio notifiche (prima 1.7, poi aggiornato alla 1.8) e due telefoni:
45 controlli tutti superati (tasto OK, chiusura solo con OK, conferma inviata
con l'ora, icone grigie e colorate in Presenze, avviso, cambio da riposo a
rimessa, animazione di apertura con i minuti scelti, salto col tocco,
fotocamera, «riduci movimento», feste con «Grazie!», prova con i dati di
esempio). Più i 36 controlli di sicurezza della 1.12, tutti superati.

---

## Modifiche della versione 1.12 – sicurezza

Per l'autista non cambia niente nell'uso di tutti i giorni: fogli, busta, crocette,
notifiche e animazioni funzionano come nella 1.11. Il servizio notifiche su
Cloudflare resta alla **versione 1.7**.

### 1. Niente più istruzioni nascoste nei dati
I codici dei fogli e delle spese che arrivano da Dropbox vengono «ripuliti» prima
di essere mostrati: un foglio o una spesa manipolati non possono più far eseguire
istruzioni all'app (nella 1.11 potevano leggere la chiave di Dropbox del telefono).
Nelle immagini delle spese vanno solo le foto fatte dall'app.

### 2. Elenco dei siti permessi
In cima a `index.html` c'è la riga **Content-Security-Policy**: l'app può
collegarsi solo a Dropbox e a Google Gemini (lettura scontrini). Tutto il resto è
bloccato dal telefono.
**Se un giorno l'app deve usare un servizio nuovo, il suo indirizzo va aggiunto in
quella riga, dopo `connect-src`, altrimenti il telefono lo blocca.**

### 3. Carattere dentro l'app
Il carattere Archivo è dentro `index.html` (licenza in `vendor/LICENSE-archivo.txt`):
il telefono non contatta più Google Fonts a ogni apertura.

### 4. Sul telefono solo i fogli dell'autista
Prima ogni telefono teneva in memoria i fogli di servizio di **tutti** gli autisti
(clienti, itinerari, buste). Ora tiene solo i suoi. Di un tour passato a un altro
autista, se la busta era già iniziata, tiene solo numero della busta, mezzo e date
(per poter mandare le spese ancora in sospeso). Alla prima apertura della 1.12 i
fogli degli altri già salvati vengono tolti.

### 5. Link di collegamento diverso: controlli e conferma
- Se il telefono è già collegato e si apre un link diverso, l'app chiede conferma
  («Nuovo collegamento»; se il link è per un altro autista lo dice).
- Prima di usarlo controlla che sia della **stessa app Dropbox** e dello **stesso
  Dropbox dell'ufficio**; se no compare «Link non valido» e il telefono resta com'era.
- Prima del cambio manda all'ufficio quello che è rimasto sul telefono.
- **Stesso autista** (per esempio password dimenticata): spese, foto e crocette
  restano sul telefono; si sceglie solo una password nuova.
- **Altro autista**: se c'è qualcosa non ancora arrivato all'ufficio, l'app avvisa
  e serve un secondo tocco («Collega lo stesso»); poi i dati del vecchio autista
  vengono tolti e le sue notifiche spente su quel telefono.
- Il telefono si ricorda il Dropbox dell'ufficio (campo `acc` nel collegamento,
  letto da Dropbox al primo aggiornamento).
- Facoltativo: nel codice c'è la costante `APP_DROPBOX`. Se ci si scrive l'«App
  key» dell'app Dropbox dell'ufficio, l'app accetta solo link di quell'app anche
  sui telefoni nuovi.

### 6. Icona sulla schermata Home
Su Android il codice di collegamento non va più nell'indirizzo dell'icona (non
serve: l'icona usa la memoria di Chrome). Su iPhone resta, perché lì l'icona ha una
memoria separata da Safari.

### 7. Password
- Le password nuove devono avere almeno **6 caratteri** e non possono essere troppo
  facili (123456, tutte uguali, il proprio nome…). Le password già scelte restano valide.
- I tentativi sbagliati restano contati anche chiudendo e riaprendo l'app: dopo 5
  errori si aspetta 30 secondi, dopo 10 cinque minuti, dopo 15 mezz'ora.

### 8. Telefono bloccato dall'ufficio
Come prima: il telefono cancella collegamento, dati e foto non ancora inviate. È
voluto: serve quando un telefono viene perso o rubato.

### Restano da fare (servono l'Agenda e il servizio su Cloudflare)
- Il link/QR contiene ancora la chiave di Dropbox: chi lo copia può entrare nella
  cartella finché l'ufficio non blocca il telefono.
- La chiave di ogni telefono può leggere e scrivere tutta la cartella
  «Autisti La Terra», anche i dati degli altri autisti.
Soluzione prevista: il QR contiene un codice che vale una volta sola e il telefono
parla con il servizio su Cloudflare, non direttamente con Dropbox.

#### Da chiedere nella chat dell'Agenda
> L'app autisti 1.12 ripulisce (escape HTML) tutto quello che arriva da Dropbox.
> L'Agenda deve fare lo stesso con tutti i testi scritti dai telefoni prima di
> mostrarli: `spese.json` (righe: id, luogo, nota, autista, modificataDa; note),
> `letto_*.json` (autista), `telefoni/*.json` (autista, dispositivo),
> `telefoni/push/*.json`, `telefoni/pasti/*/*.json`. Un telefono può scrivere in
> tutta la cartella, quindi questi file non sono affidabili.

#### Prove fatte prima della consegna (1.12)
Con un Dropbox simulato e un telefono simulato, 36 controlli tutti superati:
foglio e spesa manipolati (nessuna istruzione eseguita), foglio di un altro
autista non salvato, PDF del foglio, invio di spese e «aperto», password corte o
facili rifiutate, attesa dopo 5 errori che resta riaprendo l'app, link nuovo per
lo stesso autista (spese conservate, vecchie notifiche spente), link di un'altra
app Dropbox e link verso un altro Dropbox (rifiutati), telefono passato a un altro
autista con spese non inviate (avviso, poi dati tolti), icona sulla Home su
Android e su iPhone, lettura dello scontrino con Gemini, telefono bloccato, prova
con i dati di esempio; nessun collegamento a siti non previsti, nessun errore.
In più: pulizia dei fogli degli altri salvati dalla 1.11 e blocco di un invio
verso un sito non permesso.

---

## Modifiche della versione 1.11

- Nelle animazioni del riposo la scritta grande ora è **«NOME DOMANI RIPOSO»**
  (prima era «RELAX»), in tutte le scene: inverno, primavera, estate, autunno
  e feste.
- Nei riquadri della pagina Servizi ora c'è scritto **«Oggi a riposo»** e
  **«Domani a riposo»** (prima «relax»).
- Nessun altro cambiamento: rimessa, feste, notifiche, Profilo e Impostazioni
  funzionano come nella 1.10.

## Modifiche della versione 1.10

### Profilo più semplice per i ragazzi
Nel Profilo dei telefoni collegati all'ufficio restano solo:
- il nome dell'autista;
- **Notifiche** (attivarle e scegliere l'orario dell'avviso del servizio di domani);
- **Collegamento con l'ufficio** (fogli ricevuti, ultimo invio, «Aggiorna e invia adesso»);
- **Intestazione per la fattura**;
- **Esci**.

### Impostazioni nascoste
Toccando **6 volte di fila** la scritta «Profilo» (entro 4 secondi) si apre la
pagina **Impostazioni**, con:
- la **chiave per la lettura degli scontrini** (Gemini): salva o togli;
- le istruzioni per l'**icona sulla schermata Home**.
In alto «‹ Profilo» torna indietro; cambiando pagina le Impostazioni si
richiudono. Con meno tocchi, o troppo lenti, non succede niente e non compare
nessun avviso. Il pulsante «Metti l'app sulla schermata Home» in Servizi apre
direttamente le istruzioni dentro Impostazioni.

Nella prova con i dati di esempio il Profilo resta come prima (con le
anteprime delle animazioni).

Prove: 9 controlli sul nuovo Profilo e tutte le prove delle versioni
precedenti. Il servizio notifiche resta alla **versione 1.7**.

---

## Modifiche della versione 1.9

### Il riposo cambia con le stagioni
L'animazione del riposo di domani («MARIO DOMANI RELAX») ha una scena diversa
secondo la stagione del giorno di riposo:
- ☃️ **inverno** (dicembre–febbraio): casetta di notte con la neve sul tetto, fiocchi
  che cadono, pupazzo di neve, camino che fuma;
- 🌷 **primavera** (marzo–maggio): casetta di giorno, sole, nuvole, fiori che
  ondeggiano, albero in fiore, farfalle;
- 🏖️ **estate** (giugno–agosto): amaca tra le palme, mare, sole, gabbiano;
- 🍂 **autunno** (settembre–novembre): casetta al tramonto, alberi arancioni,
  foglie che cadono.
Se il riposo cade in una festa, la scena è quella della festa (sotto c'è il nome
della festa). Anche i riquadri in cima a Servizi hanno i colori della stagione.

### Le feste
La **prima volta che l'autista apre l'app** in un giorno di festa compare
un'animazione di auguri a tutto schermo (pulsante «Grazie!»); poi in cima a
Servizi resta il riquadro degli auguri, che la fa rivedere.
- 25/12 **Natale** – albero con le lucine, stella, regali, neve;
- 26/12 **Santo Stefano** – capanna illuminata e stella cometa;
- 31/12 **San Silvestro** – «Buona fine e buon inizio», orologio che arriva a
  mezzanotte, fuochi sulla città;
- 1/1 **Capodanno** – «Buon anno» con l'anno nuovo, calici che brindano, fuochi,
  coriandoli;
- 6/1 **Befana** – la Befana sulla scopa davanti alla luna, calze appese;
- **Pasqua** (calcolata ogni anno) – uovo che si apre con il pulcino, colomba;
- 15/8 **Ferragosto** – ombrellone, anguria, pallone, mare;
- **San Giorgio** (23 aprile; si cambia con la costante SAN_GIORGIO nel codice)
  – il Duomo con i fuochi, le bandierine e le luminarie.
Se domani è riposo o rimessa: prima la festa, poi l'animazione di domani.
Riaprendo l'app lo stesso giorno la festa non si ripete.

### Prova con i dati di esempio
In Profilo › **Animazioni** ci sono i pulsanti per vedere tutte le scene: le 4
stagioni del riposo, la rimessa e le 8 feste.

Il servizio notifiche resta alla **versione 1.7**.

---

## Modifiche della versione 1.8

### Oggi e domani sono due giorni distinti
- In cima a **Servizi** ci sono due riquadri separati:
  - **oggi** riposo o rimessa → «Oggi relax» / «Oggi in rimessa», **senza data**
    e senza freccia (non si apre);
  - **domani** riposo o rimessa → «Domani relax» / «Domani in rimessa» con la
    data e la freccia: toccandolo si rivede l'animazione di domani.
- Se oggi è riposo o rimessa e oggi non ci sono servizi, la parte «Oggi – Oggi
  nessun servizio» non compare più (se c'è un foglio per oggi, resta).
- L'animazione a tutto schermo resta solo per domani.

### Servizio notifiche 1.7 (Cloudflare)
- Una notifica **per ogni giorno**: con oggi rimessa e domani riposo arrivano
  «🔧 Giorno in rimessa – …oggi…» e «🏡 Giorno di riposo – …domani…».
- Dalla 1.5: campanelli (Dropbox per l'Agenda, Supabase per le Presenze) per le
  notifiche in pochi secondi, lucchetto contro i doppioni, motivo dei rifiuti nel
  registro. Dalla 1.6: Lo Buglio/Lobuglio e Cascone Saro/Rosario abbinati.

---

## Modifiche della versione 1.7

### Il riposo compensativo è un riposo come gli altri
Per l'autista non c'è più differenza tra riposo e riposo compensativo:
- **una sola animazione per il riposo**: la casetta, con «MARIO DOMANI RELAX»
  e sotto «Domani sei a riposo» (tolta l'animazione dell'amaca e la frase
  «ti aspetta un altro po' di riposo»);
- la parola «compensativo» non compare più da nessuna parte nell'app
  dell'autista: riquadro in Servizi «Domani relax» / «Oggi relax», crocette del
  tour «riposo»;
- nella prova con i dati di esempio restano due pulsanti: Riposo e Rimessa.

Servizio notifiche su Cloudflare: **versione 1.4** – anche nelle notifiche il
compensativo è «🏡 Giorno di riposo … sei a riposo. Relax!»; se l'ufficio
cambia un riposo in compensativo (o il contrario) non parte nessuna notifica,
perché per l'autista non cambia niente.

---

## Modifiche della versione 1.6

### L'animazione parte solo per il giorno dopo
Per non creare confusione:
- **domani** riposo, riposo compensativo o rimessa → all'apertura dell'app parte
  l'animazione a tutto schermo («MARIO DOMANI RELAX», «MARIO DOMANI IN
  RIMESSA», «MARIO TI ASPETTA UN ALTRO PO' DI RIPOSO»);
- **oggi** riposo, riposo compensativo o rimessa → **nessuna animazione**: c'è
  solo il riquadro in cima a Servizi («Oggi in rimessa», «Oggi relax»…), che
  non si apre;
- oggi e domani tutti e due → riquadro «Oggi in rimessa · domani in rimessa» e
  animazione solo per domani; toccando il riquadro si rivede l'animazione di
  domani;
- tolta dall'animazione la riga «E domani: …».

Prove: 35 controlli sulle schermate di riposo e rimessa (compresi «solo oggi»,
«oggi e domani», riposo segnato con l'app aperta), più le prove di busta,
crocette e collegamento con le Presenze: tutte superate.

Servizio notifiche su Cloudflare: versione 1.3 (notifiche quando l'ufficio
segna, cambia o toglie un riposo, un compensativo o una rimessa).

---

## Modifiche della versione 1.5

### 1. Schermate di riposo, riposo compensativo e rimessa
Quando nell'app Presenze l'ufficio segna per un autista **Riposo**, **Riposo
compensativo** o **Rimessa**, l'app dell'autista lo mostra a tutto schermo con
un'animazione, il giorno prima e il giorno stesso:
- **Riposo** – casetta animata (fumo dal camino, finestre accese, luna, stelle,
  «z» che salgono): «MARIO DOMANI RELAX» / «MARIO OGGI RELAX».
- **Riposo compensativo** – amaca che dondola tra due palme, mare, sole e
  medaglia: «MARIO TI ASPETTA UN ALTRO PO' DI RIPOSO».
- **Rimessa** – capannone con l'insegna La Terra illuminata, la serranda si alza
  e il pullman entra: «MARIO DOMANI IN RIMESSA» / «MARIO OGGI IN RIMESSA».
- Il nome è quello dell'autista collegato. Sotto ci sono il giorno e la data.
- Compare **ogni volta che l'autista apre l'app**, quando la riapre dopo almeno
  5 minuti in un'altra app, e subito se l'ufficio segna il giorno mentre l'app è
  aperta. Si chiude con «Va bene» o toccando lo schermo.
- (1.5) Se oggi è rimessa e domani riposo, si vedeva oggi con la riga «E domani: relax» — cambiato nella 1.6.
- In cima a **Servizi** resta un riquadro («Domani relax», «Domani in
  rimessa»…) che riapre l'animazione.
- Nelle crocette del tour quel giorno è scritto «riposo», «riposo
  compensativo» o «in rimessa».
- **Malattia e lutto: nessuna animazione** e nessun motivo scritto (come prima:
  solo niente crocette).
- La domanda «Ieri non hai messo la crocetta» arriva dopo la chiusura
  dell'animazione.
- Nella prova con i dati di esempio, in Profilo › «Riposo e rimessa», tre
  pulsanti mostrano le tre schermate.

### 2. Il pullman delle animazioni è il due piani La Terra
Nella schermata d'ingresso e nella rimessa il pullman è disegnato come il due
piani della flotta: argento, finestre scure sui due piani, frecce arancio,
rossa e rosso scuro dietro, scritta La Terra al centro, tre assi.

### Servizio notifiche 1.2 (Cloudflare)
Prima scriveva per ogni giorno solo «no» (niente crocette). Ora per Riposo,
Riposo compensativo e Rimessa scrive il codice (RI, RC, RM) in
`/telefoni/presenze/<autista>.json`; per malattia e lutto continua a scrivere
solo «no», perché la cartella è leggibile da tutti i telefoni.
L'app 1.4 legge il nuovo file senza problemi.

### Prove fatte prima della consegna
- 29 controlli sulle nuove schermate (i tre tipi di giorno, oggi e domani,
  riapertura dell'app, ritorno dopo 5 minuti, riposo segnato con l'app aperta,
  malattia e lutto senza animazione, vecchio servizio con «no», telefono da
  360 px, tema scuro, prova con i dati di esempio);
- prova completa Presenze → servizio notifiche 1.2 → telefono;
- tutte le prove delle versioni precedenti, senza errori.

---

## Modifiche della versione 1.4

### 1. La busta si apre sempre, appena arriva il foglio
Prima il pulsante «Busta spese n. …» compariva solo **durante** il servizio:
un tour inviato il giorno prima (per esempio Memory Viaggi, busta n. 103)
arrivava con il foglio ma senza la busta. Adesso la busta si apre prima del
servizio, durante e dopo (fino alla consegna), ogni volta che il foglio ha la
busta e non è stato ritirato.
- **Scheda grande** (foglio nuovo, oggi, prossimo servizio): sotto «Apri il
  foglio di servizio» c'è sempre «Busta spese n. … · restano € …».
- **Schede piccole** di «Altri giorni»: sotto la scheda c'è una riga
  «Busta spese n. …» che apre la busta.
- **Foglio di servizio aperto**: sotto il foglio c'è il pulsante della busta.
  Nei giorni del servizio ci sono anche le crocette, e la busta sta sotto.
- **Spese e km anche prima della partenza**: nessun blocco legato alla data.
  La data proposta per una nuova spesa è sempre quella di oggi.

### 2. Cambio bus durante il tour
Nella busta, sotto i chilometri, c'è il pulsante **«+ Cambio bus durante il
tour»**.
- Bus 1 (quello del foglio): km all'inizio e km alla fine.
- Bus 2, 3…: targa o numero del bus (lo scrive l'autista), km all'inizio e
  km alla fine. Fino a 6 bus; un bus aggiunto per sbaglio si toglie con «Togli».
- Il totale dei km è la somma di tutti i bus. Un bus con i km di fine minori
  di quelli di inizio non entra nel totale.
- Alla consegna, se mancano i km di fine di qualche bus, l'app avvisa (si può
  consegnare lo stesso).
- Se il tour passa a un altro autista, bus e km restano nella busta.

**Cosa arriva all'Agenda** (file `spese.json`, collegamento versione 1):
- `kmPartenza` e `kmRientro` restano quelli del **Bus 1**, come prima;
- nuovi campi `bus` (elenco: numero, targa o mezzo, km di inizio e di fine) e
  `kmTotali`; l'Agenda 2.5 li ignora senza errori;
- per vederli subito, l'app aggiunge in fondo alle **note** della busta un
  riepilogo «— Cambio bus (scritto dall'app) —» con i km di ogni bus e il
  totale. Quando l'app rilegge la busta, questo riepilogo non viene ripetuto.

### Non cambiato
«Consegna la busta», busta riaperta dall'ufficio, crocette, notifiche, grafica,
file `spese.json` e `letto_*.json` come previsto dal foglio di collegamento con
l'Agenda.

#### Da chiedere nella chat dell'Agenda (facoltativo)
> L'app autisti 1.4 scrive in spese.json, quando c'è un cambio bus, i campi
> `bus: [{n, mezzo, kmPartenza, kmRientro}]` (n = 1 è il bus del foglio) e
> `kmTotali`. Mostrare nella scheda spese una tabella dei bus e usare
> `kmTotali` come «Km effettuati» quando c'è.

#### Prove fatte prima della consegna (1.4)
Con un Dropbox simulato e un telefono simulato, tutte superate:
- 22 controlli sulla busta e sul cambio bus (busta prima della partenza, data
  proposta, spese e km prima della partenza, totale km, bus aggiunto e tolto,
  consegna con km mancanti, busta consegnata bloccata, busta riaperta
  dall'ufficio, riga busta sulle schede piccole, foglio senza busta, foglio
  ritirato, niente fuori dallo schermo);
- foglio di oggi con crocette e busta insieme;
- tutte le prove delle versioni precedenti (collegamento, foglio, «Aperto
  dall'autista», busta e consegna, cambio autista, notifiche, crocette e
  collegamento con l'app Presenze);
- lettura dei file da parte del codice vero dell'Agenda 2.5.

---

## Versioni precedenti (in breve)


- **1.3** – Giorni di riposo dall'app Presenze (niente crocette né
  promemoria); crocette corrette dall'ufficio che tornano sul telefono; nome di
  chi scrive ogni spesa; crocette di un tour già iniziato che restano se il
  tour passa a un altro autista; correzione del blocco degli invii al telefono.
- **1.2** – «Crocette del tour» solo durante i tour; nei servizi di
  un giorno le crocette sono sotto il foglio; prossimo servizio sempre grande
  ed evidenziato; crocette solo nei giorni con un foglio.
- **1.1** – Notifiche (fogli nuovi, crocette alle 16, 17 e 18,
  servizio di domani all'ora scelta), con il servizio su Cloudflare.
- **1.0.x** – Collegamento con l'Agenda tramite la cartella Dropbox
  «Autisti La Terra», QR, password, PDF del foglio, busta, icona sulla Home,
  controllo del collegamento nel Profilo.
