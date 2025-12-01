# 2048 - Guida Completa

Una versione moderna e ricca di funzionalità del classico gioco 2048, costruito con React e Vite.

## 📋 Sommario

- [Come Giocare](#-come-giocare) 
- [Modalità di Gioco](#-modalità-di-gioco)
- [Power-up](#-power-up)
- [Temi e Personalizzazione](#-temi-e-personalizzazione)
- [Trofei e Obiettivi](#-trofei-e-obiettivi)
- [Come Buildare e Eseguire](#-come-buildare-e-eseguire)

---

## 🎮 Come Giocare

### Obiettivo del Gioco

L'obiettivo di 2048 è creare una tessera con il valore **2048** combinando tessere con numeri uguali.

### Controlli

- **Frecce Direzionali** (↑ ↓ ← →): Muovi le tessere nella direzione scelta
- **Mouse/Touch**: Scorri per muovere (su dispositivi mobili)

### Meccanica Base

1. **Inizio**: Il gioco parte con due tessere di valore 2 su una griglia 4×4
2. **Movimento**: Premi una freccia per spostare tutte le tessere in quella direzione
3. **Fusione**: Quando due tessere con lo stesso valore si toccano, si uniscono in una tessera con il valore raddoppiato
   - 2 + 2 = 4
   - 4 + 4 = 8
   - 8 + 8 = 16
   - E così via...
4. **Nuova Tessera**: Dopo ogni mossa valida, una nuova tessera (90% probabilità 2, 10% probabilità 4) appare in una posizione casuale
5. **Game Over**: Quando la griglia è piena e non puoi fare altre mosse, il gioco termina
6. **Punti**: Guadagni punti ogni volta che fusioni due tessere (guadagni il valore della tessera risultante)

### Suggerimenti Strategici

- **Pianifica in anticipo**: Pensa alle prossime mosse per evitare di bloccarti
- **Mantieni spazi vuoti**: Non riempire la griglia troppo velocemente
- **Crea linee**: Allinea tessere dello stesso valore per fusion più grandi
- **Angoli strategici**: Prova a mantenere il numero più grande in un angolo

---

## 🎯 Modalità di Gioco

### 1. **Classica**
- Griglia illimitata (finché non riempi tutto)
- Nessun limite di tempo
- Perfetta per giocare senza stress

### 2. **Time Attack** ⏱️
- Hai **15 secondi** per iniziare
- Ogni fusione ti regala **1-2 secondi extra** (2 secondi se ottieni 8+ punti)
- Sistema di **combo**: fusioni consecutive moltiplicano i punti
- Massimo 8x combo

### 3. **Zen** 🧘
- Nessun game over!
- Se rimani bloccato, il gioco **mescola automaticamente la griglia**
- Perfetto per rilassarsi e giocare senza pressione

---

## ⚡ Power-up

Puoi acquistare power-up dal negozio usando i punti accumulati:

### 🔫 Bomba (500 punti)
- Distrugge una tessera a scelta
- Clicca su una tessera mentre la bomba è attiva per eliminarla
- Utile quando rimani bloccato

### 🔄 Shuffle (250 punti)
- Mescola tutte le tessere sulla griglia
- Perfetto per creare nuove opportunità di fusione

### ⬆️ Boost (1000 punti)
- Raddoppia il valore di una tessera casuale
- Accelera il progresso verso tessere più grandi

---

## 🎨 Temi e Personalizzazione

Sblocca 7 temi unici! Ogni tema ha colori e stili diversi:

| Tema | Prezzo | Descrizione |
|------|--------|------------|
| **Classico** | Gratis | Lo stile originale di 2048 |
| **Halloween** | 1000 | Tonalità scure e arancioni |
| **Natale** | 1500 | Rosso, verde e bianco natalizio |
| **Primavera** | 2000 | Colori pastello e floreali |
| **Estate** | 2500 | Giallo, blu e arancione vivace |
| **Autunno** | 2000 | Arancione, marrone e oro |
| **Inverno** | 1500 | Azzurro ghiacciato e bianco |

### Guadagnare Punti

I punti vengono guadagnati automaticamente:
- Fusioni di tessere ≥ 128 danno punti
- Formula: `⌊Punti della Mossa ÷ 10⌋`

---

## 🏆 Trofei e Obiettivi

Sblocca 9 trofei unici con ricompense di power-up!

### Trofei

| Trofeo | Obiettivo | Ricompensa |
|--------|-----------|-----------|
| 🟡 **Novizio** | Raggiungi 512 | 1× Shuffle |
| 🟡 **Pro** | Raggiungi 1024 | 1× Bomba |
| 🟡 **Veterano** | Raggiungi 2048 | 1× Boost |
| 👑 **Il Re** | Raggiungi 4096 | 2× Power-up Casuali |
| 🔥 **Imperatore** | Raggiungi 8192 | 3× Power-up Casuali |
| ⚡ **Velocista** (Time Attack) | 1000+ punti in < 60s | 1× Boost |
| 💪 **Sopravvissuto** (Time Attack) | 5000+ punti | 2× Shuffle |
| 📦 **Micrometrico** | Vinci su griglia 3×3 | 3× Power-up Casuali |
| 🧘 **Zen Master** (Zen) | Fai 500 mosse | 1× Shuffle |

---

## ⚙️ Come Buildare e Eseguire

### Prerequisiti

- **Node.js** (v16 o superiore)
- **npm** o **yarn**

### Installazione

```bash
# Clona o scarica il progetto
cd c:\2048-

# Installa le dipendenze
npm install
```

### Esecuzione in Modalità Sviluppo

```bash
npm run dev
```

Il gioco sarà disponibile su: `http://localhost:5173/`

### Build per Produzione

```bash
npm run build
```

I file compilati saranno in `dist/`

### Anteprima della Build

```bash
npm run preview
```

---

## 📱 Dispositivi Supportati

- ✅ **Desktop**: Mouse e tastiera
- ✅ **Tablet**: Touch con swipe
- ✅ **Mobile**: Touch e swipe
- ✅ **Responsive**: Si adatta a qualsiasi schermo

---

## 🎵 Funzionalità Aggiuntive

### Audio e Vibrazione

- **Audio**: Abilita/disabilita gli effetti sonori (Menu → Impostazioni)
- **Vibrazione**: Feedback tattile su dispositivi supportati
- **Controllo Volume**: Regola il livello dell'audio

### Temi di Sistema

- **Tema Scuro**: Perfetto per giocare di sera
- **Tema Chiaro**: Leggibile in piena luce

### Salvataggi Automatici

Il gioco salva automaticamente:
- La tua partita in corso (per ogni modalità)
- Le impostazioni (tema, volume, etc.)
- I tuoi record e statistiche
- I trofei sbloccati
- I temi acquistati

Tutto viene salvato nel browser usando `localStorage`.

---

## 📊 Statistiche

Nel gioco puoi tracciare:
- **Partite giocate**: Totale delle partite completate
- **Mosse totali**: Numero di mosse effettuate
- **Tessera massima**: La tessera più grande raggiunta finora

---

## 🔧 Tecnologie Usate

- **React 19**: Framework UI
- **Vite 7**: Build tool
- **Tailwind CSS**: Styling
- **Lucide React**: Icone
- **PostCSS**: Processing CSS

---

## 📸 Screenshots

### Schermata Principale
La schermata di avvio del gioco con le opzioni principali:
- **Nuova Partita**: Inizia una nuova partita
- **Continua**: Riprendi la partita in corso
- **Shop**: Acquista temi e power-up
- **Temi**: Personalizza l'aspetto del gioco
- **Record**: Visualizza i tuoi progressi e statistiche
- **Trofei**: Controlla i trofei sbloccati
- **Opzioni**: Regola le impostazioni

![Schermata Principale](./screenshots/Screenshot%202025-11-20%20153642.png)

### Selezione Dimensione Griglia
Scegli la dimensione della griglia prima di iniziare:
- **3×3**: Difficoltà massima
- **4×4**: Classico (Default)
- **5×5**: Più spazio, meno stress
- **6×6**: Extreme (per gli esperti)

Disponibile per tutte e 3 le modalità (Classica, Time Attack, Zen).

![Selezione Dimensione](./screenshots/Screenshot%202025-11-20%20153653.png)

### Guida Power-up
Un modal informativo che spiega i tre power-up disponibili:
- 🔫 **Bomba**: Distruggi una tessera
- 🔄 **Shuffle**: Mescola la griglia
- ⬆️ **Boost**: Raddoppia una tessera

![Guida Power-up](./screenshots/Screenshot%202025-11-20%20153708.png)

### Gameplay
Partita in corso con:
- Griglia 4×4 con tessere
- Punteggio corrente in alto a destra
- Icone per power-up, trofei e opzioni nella barra superiore
- Tessere da 2 fino a valori più alti

![Gameplay](./screenshots/Screenshot%202025-11-20%20153725.png)

### Trofei e Obiettivi
Visualizza tutti i 9 trofei sbloccabili:
- 🟡 **Novizio**: 512 (Shuffle)
- 🏆 **Pro**: 1024 (Bomba)
- 👑 **Veterano**: 2048 (Boost)
- 👑 **Il Re**: 4096 (2× Power-up)
- 🔥 **Imperatore**: 8192 (3× Power-up)
- E altri per Time Attack, Zen e griglie speciali

Scorri per vedere tutti gli obiettivi!

![Trofei](./screenshots/Screenshot%202025-11-20%20153737.png)

### Negozio Temi e Impostazioni
Sblocca e acquista 7 temi unici:
- 🟩 **Classico**: SBLOCCATO (Gratis)
- 🎃 **Halloween**: 1000 punti
- ❄️ **Natale**: 1500 punti
- 🌸 **Primavera**: 2000 punti
- ☀️ **Estate**: 2500 punti
- 🍂 **Autunno**: 2000 punti
- ❄️ **Inverno**: 1500 punti

Personalizza l'esperienza di gioco:
- 🌓 **Tema**: Attiva il tema scuro/chiaro
- 🔊 **Audio**: Abilita/disabilita gli effetti sonori
- 📳 **Vibrazione**: Attiva/disattiva il feedback tattile
- 🔉 **Volume**: Regola il livello audio (slider 0-100%)

![Temi e Impostazioni](./screenshots/Screenshot%202025-11-20%20153752.png)

---

## 📝 Note

- Ogni sessione di gioco è indipendente (puoi avere una partita in corso per ogni modalità)
- I dati vengono salvati nel browser, non online
- Cancellare i dati del browser rimuoverà tutti i progressi salvati

---

## 🎉 Divertiti!

Buon gioco! Cerca di raggiungere il 2048 e sblocca tutti i trofei! 🚀
