# La Terra Autisti – App dell'autista

**Versione 1.5** — 4 novembre 2026

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
| `vendor/` | La libreria che mostra i fogli di servizio in PDF (pdf.js, licenza Apache 2.0). |
| `README.md` | Questo file. |

Dopo il caricamento: sul telefono chiudi del tutto l'app, aspetta 10 minuti e
riaprila. In fondo al Profilo deve esserci «versione 1.5».

**Insieme a questa versione va aggiornato il servizio delle notifiche su
Cloudflare alla versione 1.2** (file a parte, da NON mettere su GitHub): senza
quell'aggiornamento l'app funziona, ma le schermate di riposo e rimessa non
compaiono.

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
- Se oggi è rimessa e domani riposo, si vede oggi con la riga «E domani: relax».
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
