import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Play, Volume2, VolumeX, Trophy,
    Settings, LogOut, Save, Grid3x3, ArrowLeft,
    Crown, Zap, Home, History, Clock, Sun, Moon, Medal, Flame, AlertTriangle, FolderOpen, Smartphone, Power,
    ShoppingBag, BarChart2, Trash2, RefreshCw, ChevronsUp, Infinity as InfinityIcon, Info, X, Gift, CheckCircle,
    Ghost, Snowflake, CloudRain, Sun as SunIcon, Wind
} from 'lucide-react';

import ErrorBoundary from './components/ErrorBoundary';
import MaterialButton from './components/UI/MaterialButton';
import InfoModal from './components/UI/InfoModal';
import Confetti from './components/Effects/Confetti';
import { haptic } from './utils/haptic';
import { audio } from './utils/audio';
import {
    VER, TIME_ATTACK_START, ANIMATION_DURATION, COMBO_TIMEOUT, generateId,
    UI_THEME, THEME_PACKS, SHOP_ITEMS, ACHIEVEMENTS_LIST
} from './constants/gameConfig';

// --- APP CONTENT ---
const AppContent = () => {
    const [view, setView] = useState('menu');
    const [gameSize, setGameSize] = useState(4);
    const [mode, setMode] = useState('classic');

    const [tiles, setTiles] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIME_ATTACK_START);
    const [bursts, setBursts] = useState([]);
    const [startTime, setStartTime] = useState(Date.now());

    const [isBombing, setIsBombing] = useState(false);
    const [notification, setNotification] = useState(null);
    const [selectedTrophy, setSelectedTrophy] = useState(null);
    const [showPowerupInfo, setShowPowerupInfo] = useState(false);
    const [showModeInfo, setShowModeInfo] = useState(false);

    // Combo System
    const [combo, setCombo] = useState(1);
    const [lastMergeTime, setLastMergeTime] = useState(0);

    const [settings, setSettings] = useState({ theme: 'dark', volume: 0.5, muted: false, vibration: true });
    const [wallet, setWallet] = useState(0);
    const [inventory, setInventory] = useState({ bomb: 1, shuffle: 1, boost: 1 });
    const [stats, setStats] = useState({ totalMoves: 0, gamesPlayed: 0, maxTile: 0 });
    const [saves, setSaves] = useState({ classic: null, time_attack: null, zen: null });
    const [history, setHistory] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [unlockedThemes, setUnlockedThemes] = useState(['classic']);
    const [currentThemePack, setCurrentThemePack] = useState('classic');

    const mounted = useRef(true);
    const tilesRef = useRef([]);
    const touchStart = useRef(null);

    // --- SAFE LOAD ---
    useEffect(() => {
        const safeLoad = (key, setter, def) => {
            try {
                const v = localStorage.getItem(key);
                if (v) setter(JSON.parse(v));
                else if (def !== undefined) setter(def);
            } catch (e) { if (def !== undefined) setter(def); }
        };

        safeLoad(`2048-${VER}-settings`, setSettings);
        safeLoad(`2048-${VER}-wallet`, setWallet, 0);
        safeLoad(`2048-${VER}-inventory`, setInventory, { bomb: 1, shuffle: 1, boost: 1 });
        safeLoad(`2048-${VER}-stats`, setStats, { totalMoves: 0, gamesPlayed: 0, maxTile: 0 });
        safeLoad(`2048-${VER}-saves`, setSaves, { classic: null, time_attack: null, zen: null });
        safeLoad(`2048-${VER}-history`, setHistory, []);
        safeLoad(`2048-${VER}-themes`, setUnlockedThemes, ['classic']);
        safeLoad(`2048-${VER}-currentTheme`, setCurrentThemePack, 'classic');
        safeLoad(`2048-${VER}-achievements`, setAchievements, []);

        return () => { mounted.current = false; };
    }, []);

    // AUTO SAVE
    useEffect(() => { try { localStorage.setItem(`2048-${VER}-settings`, JSON.stringify(settings)); } catch (e) { } audio.volume = settings.volume; audio.muted = settings.muted; haptic.enabled = settings.vibration; }, [settings]);
    useEffect(() => { try { localStorage.setItem(`2048-${VER}-wallet`, JSON.stringify(wallet)); } catch (e) { } }, [wallet]);
    useEffect(() => { try { localStorage.setItem(`2048-${VER}-inventory`, JSON.stringify(inventory)); } catch (e) { } }, [inventory]);
    useEffect(() => { try { localStorage.setItem(`2048-${VER}-stats`, JSON.stringify(stats)); } catch (e) { } }, [stats]);
    useEffect(() => { try { localStorage.setItem(`2048-${VER}-themes`, JSON.stringify(unlockedThemes)); } catch (e) { } }, [unlockedThemes]);
    useEffect(() => { try { localStorage.setItem(`2048-${VER}-currentTheme`, JSON.stringify(currentThemePack)); } catch (e) { } }, [currentThemePack]);

    const saveGame = (t, s, m, sz, tm) => {
        const gd = { tiles: t, score: s, mode: m, size: sz, timeLeft: tm, date: new Date().toLocaleString() };
        const ns = { ...saves, [m]: gd };
        setSaves(ns);
        try { localStorage.setItem(`2048-${VER}-saves`, JSON.stringify(ns)); } catch (e) { }
    };

    const deleteSave = (m) => {
        const ns = { ...saves, [m]: null };
        setSaves(ns);
        try { localStorage.setItem(`2048-${VER}-saves`, JSON.stringify(ns)); } catch (e) { }
    };

    const showToast = (msg, type = 'info') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const buyTheme = (packId) => {
        const pack = THEME_PACKS[packId];
        if (wallet >= pack.price) {
            haptic.success();
            setWallet(w => w - pack.price);
            setUnlockedThemes(t => [...t, packId]);
            setCurrentThemePack(packId);
            showToast(`Tema ${pack.name} Sbloccato!`, 'success');
        } else {
            haptic.failure();
            showToast("Punti insufficienti!", 'info');
        }
    };

    const buyItem = (item) => {
        if (wallet >= item.price) {
            haptic.success();
            setWallet(w => w - item.price);
            setInventory(inv => ({ ...inv, [item.id]: inv[item.id] + 1 }));
        } else {
            haptic.failure();
        }
    };

    const executeShuffle = () => {
        haptic.medium();
        audio.playPowerUp();
        const positions = tilesRef.current.map(t => ({ r: t.r, c: t.c }));
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        const newTiles = tilesRef.current.map((t, i) => ({ ...t, r: positions[i].r, c: positions[i].c, isMerged: false, isNew: true }));
        setTiles(newTiles);
        tilesRef.current = newTiles;
        saveGame(newTiles, score, mode, gameSize, timeLeft);
        return newTiles;
    };

    const zenAutoRescue = () => {
        let nt = executeShuffle();
        let dead = true;
        const g = Array(gameSize).fill().map(() => Array(gameSize).fill(0));
        nt.forEach(t => g[t.r][t.c] = t.val);
        for (let r = 0; r < gameSize; r++) for (let c = 0; c < gameSize; c++) {
            const v = g[r][c];
            if ((r < gameSize - 1 && g[r + 1][c] === v) || (c < gameSize - 1 && g[r][c + 1] === v)) dead = false;
        }
        if (dead) {
            showToast("Blocco! Eliminazione...", 'info'); audio.playZenRescue(); haptic.heavy();
            const min = Math.min(...nt.map(t => t.val));
            const vic = nt.find(t => t.val === min);
            nt = nt.filter(t => t.id !== vic.id);
            setTiles(nt); tilesRef.current = nt;
            saveGame(nt, score, mode, gameSize, timeLeft);
        } else { showToast("Auto Shuffle!", 'info'); }
    };

    const activateShuffle = () => { if (inventory.shuffle > 0) { setInventory(i => ({ ...i, shuffle: i.shuffle - 1 })); executeShuffle(); } };
    const activateBoost = () => { if (inventory.boost > 0 && tilesRef.current.length > 0) { haptic.medium(); audio.playPowerUp(); setInventory(i => ({ ...i, boost: i.boost - 1 })); const idx = Math.floor(Math.random() * tilesRef.current.length); const nt = [...tilesRef.current]; nt[idx].val *= 2; nt[idx].isMerged = true; setTiles(nt); tilesRef.current = nt; saveGame(nt, score, mode, gameSize, timeLeft); } };
    const activateBomb = () => { if (inventory.bomb > 0) { haptic.light(); setIsBombing(true); } };

    const handleTileClick = (tileId) => {
        if (isBombing) {
            haptic.heavy(); audio.playTone(100, 'sawtooth', 0.3);
            setInventory(i => ({ ...i, bomb: i.bomb - 1 }));
            setIsBombing(false);
            const nt = tilesRef.current.filter(t => t.id !== tileId);
            setTiles(nt); tilesRef.current = nt;
            saveGame(nt, score, mode, gameSize, timeLeft);
        }
    };

    const unlockAchievement = (id) => {
        if (!achievements.includes(id)) {
            const ach = ACHIEVEMENTS_LIST.find(a => a.id === id);
            if (!ach) return;
            const na = [...achievements, id];
            setAchievements(na);
            try { localStorage.setItem(`2048-${VER}-achievements`, JSON.stringify(na)); } catch (e) { }
            audio.playReward(); haptic.success();
            let txt = '';
            if (ach.type === 'random') {
                const types = ['bomb', 'shuffle', 'boost'];
                for (let i = 0; i < ach.reward; i++) { const t = types[Math.floor(Math.random() * types.length)]; setInventory(inv => ({ ...inv, [t]: inv[t] + 1 })); }
                txt = `+${ach.reward} Power-up`;
            } else {
                setInventory(inv => ({ ...inv, [ach.type]: inv[ach.type] + ach.reward }));
                txt = `+${ach.reward} ${ach.type === 'bomb' ? 'Bomba' : ach.type === 'shuffle' ? 'Shuffle' : 'Boost'}`;
            }
            showToast(`🏆 ${ach.title} Sbloccato! ${txt}`, 'success');
        }
    };

    const startGame = (m, s) => {
        audio.init();
        const t1 = { id: generateId(), val: 2, r: Math.floor(Math.random() * s), c: Math.floor(Math.random() * s) };
        let t2 = { id: generateId(), val: 2, r: Math.floor(Math.random() * s), c: Math.floor(Math.random() * s) };
        while (t1.r === t2.r && t1.c === t2.c) t2 = { r: Math.floor(Math.random() * s), c: Math.floor(Math.random() * s) };
        const st = [t1, t2];
        setTiles(st); tilesRef.current = st;
        setScore(0); setGameOver(false); setMode(m); setGameSize(s);
        setTimeLeft(TIME_ATTACK_START); setBursts([]); setIsBombing(false); setShowPowerupInfo(false); setShowModeInfo(false); setNotification(null);
        setStats(p => ({ ...p, gamesPlayed: p.gamesPlayed + 1 }));
        setStartTime(Date.now()); setCombo(1);
        setView('game');
        saveGame(st, 0, m, s, TIME_ATTACK_START);
    };

    const resumeGame = (gd) => {
        if (!gd) return; audio.init();
        setTiles(gd.tiles || []); setScore(gd.score || 0); setMode(gd.mode || 'classic');
        setGameSize(gd.size || 4); setTimeLeft(gd.timeLeft || TIME_ATTACK_START);
        tilesRef.current = gd.tiles || []; setGameOver(false); setIsBombing(false); setShowPowerupInfo(false); setShowModeInfo(false); setNotification(null);
        setStartTime(Date.now()); setCombo(1);
        setView('game');
    };

    const addTile = (ct) => {
        const taken = new Set(ct.map(t => `${t.r},${t.c}`));
        const empty = [];
        for (let r = 0; r < gameSize; r++) for (let c = 0; c < gameSize; c++) if (!taken.has(`${r},${c}`)) empty.push({ r, c });
        if (empty.length === 0) return ct;
        const pos = empty[Math.floor(Math.random() * empty.length)];
        return [...ct, { id: generateId(), val: Math.random() > 0.9 ? 4 : 2, r: pos.r, c: pos.c, isNew: true }];
    };

    const move = useCallback((dir) => {
        if (gameOver || isBombing || isMoving.current) return;
        audio.init();

        const current = [...tilesRef.current];
        let moved = false; let points = 0; let bigMerge = false;
        const sorted = current.sort((a, b) => {
            if (dir === 'up') return a.r - b.r;
            if (dir === 'down') return b.r - a.r;
            if (dir === 'left') return a.c - b.c;
            return b.c - a.c;
        });
        const grid = Array(gameSize).fill().map(() => Array(gameSize).fill(null));
        const nextTiles = sorted.map(t => ({ ...t, isMerged: false, isNew: false }));

        nextTiles.forEach(tile => {
            let { r, c } = tile;
            let nextR = r, nextC = c;
            while (true) {
                let tr = nextR, tc = nextC;
                if (dir === 'up') tr--; else if (dir === 'down') tr++; else if (dir === 'left') tc--; else tc++;
                if (tr < 0 || tr >= gameSize || tc < 0 || tc >= gameSize) break;
                if (grid[tr][tc] && !grid[tr][tc].isMerged && grid[tr][tc].val === tile.val) {
                    const target = grid[tr][tc]; target.val *= 2; target.isMerged = true;
                    points += target.val; tile.toDelete = true; tile.r = tr; tile.c = tc;
                    if (target.val >= 32) bigMerge = true; moved = true; return;
                } else if (grid[tr][tc]) break;
                nextR = tr; nextC = tc;
            }
            if (nextR !== r || nextC !== c) moved = true;
            tile.r = nextR; tile.c = nextC;
            grid[nextR][nextC] = tile;
        });

        if (!moved) return;
        isMoving.current = true;
        if (bigMerge) { audio.playFirework(); haptic.medium(); setBursts(p => [...p, Date.now()]); setTimeout(() => setBursts(b => b.slice(1)), 3000); }
        else { audio.playMove(); haptic.light(); }

        setTiles(nextTiles);
        setStats(s => ({ ...s, totalMoves: s.totalMoves + 1 }));

        if (mode === 'time_attack' && points > 0) {
            const now = Date.now();
            if (now - lastMergeTime < COMBO_TIMEOUT) {
                const nc = Math.min(combo * 2, 8);
                if (nc > 1) { setCombo(nc); audio.playTone(600, 'sawtooth', 0.1, 0.4); points *= nc; showToast(`Combo x${nc}!`, 'success'); }
            } else { setCombo(1); }
            setLastMergeTime(now);
        }

        setTimeout(() => {
            if (!mounted.current) { isMoving.current = false; return; }
            try {
                let final = nextTiles.filter(t => !t.toDelete).map(t => ({ ...t, isMerged: false }));
                final = addTile(final);
                setTiles(final); tilesRef.current = final;
                const newScore = score + points; setScore(newScore);

                const currentMax = Math.max(...final.map(t => t.val));
                if (currentMax > stats.maxTile) setStats(s => ({ ...s, maxTile: currentMax }));
                if (mode === 'time_attack' && points > 0) setTimeLeft(t => Math.min(t + (points >= 8 ? 2 : 1), 60));
                if (currentMax >= 128 && points > 0) setWallet(w => w + Math.ceil(points / 10));

                if (currentMax >= 512) unlockAchievement('novice');
                if (currentMax >= 1024) unlockAchievement('pro');
                if (currentMax >= 2048) unlockAchievement('veteran');
                if (currentMax >= 4096) unlockAchievement('king');
                if (currentMax >= 8192) unlockAchievement('emperor');
                if (mode === 'time_attack' && newScore >= 1000 && (Date.now() - startTime < 60000)) unlockAchievement('speedster');
                if (mode === 'time_attack' && newScore >= 5000) unlockAchievement('survivor');
                if (gameSize === 3 && currentMax >= 2048) unlockAchievement('tiny');
                if (mode === 'zen' && stats.totalMoves % 500 === 0 && stats.totalMoves > 0) unlockAchievement('zen_master');

                if (final.length === gameSize * gameSize) {
                    let dead = true;
                    const g = Array(gameSize).fill().map(() => Array(gameSize).fill(0));
                    final.forEach(t => g[t.r][t.c] = t.val);
                    for (let r = 0; r < gameSize; r++) for (let c = 0; c < gameSize; c++) {
                        const v = g[r][c];
                        if ((r < gameSize - 1 && g[r + 1][c] === v) || (c < gameSize - 1 && g[r][c + 1] === v)) dead = false;
                    }
                    if (dead) {
                        if (mode === 'zen') zenAutoRescue();
                        else {
                            setGameOver(true); audio.playGameOver(); haptic.failure();
                            const rec = { score: newScore, date: new Date().toLocaleDateString(), mode, size: gameSize };
                            const newHist = [...history, rec].sort((a, b) => b.score - a.score).slice(0, 10);
                            setHistory(newHist);
                            try { localStorage.setItem(`2048-${VER}-history`, JSON.stringify(newHist)); } catch (e) { }
                            deleteSave(mode);
                        }
                    } else { saveGame(final, newScore, mode, gameSize, timeLeft); }
                } else { saveGame(final, newScore, mode, gameSize, timeLeft); }
            } catch (e) { console.error(e); }
            finally { isMoving.current = false; }
        }, ANIMATION_DURATION);
    }, [gameOver, gameSize, mode, score, history, timeLeft, isBombing, stats, inventory, achievements, combo, lastMergeTime]);

    useEffect(() => {
        const h = (e) => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); move(e.key.replace('Arrow', '').toLowerCase()); } };
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
    }, [move]);

    useEffect(() => {
        if (mode !== 'time_attack' || gameOver || view !== 'game') return;
        const i = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { setGameOver(true); audio.playGameOver(); haptic.failure(); deleteSave(mode); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(i);
    }, [mode, gameOver, view, score, gameSize]);

    const uiTheme = UI_THEME[settings.theme] || UI_THEME.dark;
    const currentPack = THEME_PACKS[currentThemePack] || THEME_PACKS.classic;

    const getTileStyle = (val) => {
        const c = currentPack.colors[val] || { bg: currentPack.grid, text: '#fff' };
        if (typeof c === 'string') return { bg: c, color: val > 4 ? '#fff' : '#333', shadow: val > 128 ? `0 0 15px ${c}` : 'none' };
        return { bg: c, color: '#fff' };
    };

    // --- RENDER ---
    return (
        <div className={`w-full h-screen overflow-hidden select-none font-sans transition-colors duration-500 ${uiTheme.bg} ${uiTheme.text}`}
            onTouchStart={e => { audio.init(); touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
            onTouchEnd={e => {
                if (!touchStart.current) return;
                const dx = e.changedTouches[0].clientX - touchStart.current.x; const dy = e.changedTouches[0].clientY - touchStart.current.y;
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) move(dx > 0 ? 'right' : 'left'); else if (Math.abs(dy) > 30) move(dy > 0 ? 'down' : 'up');
            }}>
            {bursts.map(k => <Confetti key={k} />)}

            {/* NOTIFICATION BANNER (FIXED CENTERED) */}
            {notification && (
                <div className="fixed top-4 left-0 right-0 flex justify-center z-[100] pointer-events-none px-4 animate-fade-in">
                    <div className={`bg-gradient-to-r ${notification.type === 'success' ? 'from-yellow-600 to-orange-600' : 'from-indigo-600 to-purple-600'} text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl border border-white/20 flex items-center justify-center gap-2`}>
                        {notification.type === 'success' ? <Gift size={18} /> : <Info size={18} />}
                        {notification.msg}
                    </div>
                </div>
            )}

            {selectedTrophy && <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-fade-in p-6"><div className={`${uiTheme.panel} w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10 text-center`}><div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${achievements.includes(selectedTrophy.id) ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/30'}`}><selectedTrophy.icon size={40} /></div><h2 className="text-2xl font-black mb-2">{selectedTrophy.title}</h2><p className="text-sm opacity-70 mb-4">{selectedTrophy.desc}</p><div className="bg-black/20 p-4 rounded-xl text-left space-y-2 mb-6"><div className="flex justify-between text-sm"><span className="opacity-50">Modalità:</span><span className="font-bold text-blue-400">{selectedTrophy.mode}</span></div><div className="flex justify-between text-sm"><span className="opacity-50">Ricompensa:</span><span className="font-bold text-green-400">{selectedTrophy.reward} {selectedTrophy.type}</span></div><div className="flex justify-between text-sm"><span className="opacity-50">Stato:</span><span className={achievements.includes(selectedTrophy.id) ? "font-bold text-yellow-500" : "font-bold text-red-500"}>{achievements.includes(selectedTrophy.id) ? "SBLOCCATO" : "BLOCCATO"}</span></div></div><button onClick={() => setSelectedTrophy(null)} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold">Chiudi</button></div></div>}
            {showPowerupInfo && <InfoModal onClose={() => setShowPowerupInfo(false)} theme={uiTheme} title="Guida Power-up" items={[{ title: 'Bomba', desc: 'Distruggi una tessera.', icon: <Trash2 size={24} />, color: 'red' }, { title: 'Shuffle', desc: 'Mescola tutte le tessere.', icon: <RefreshCw size={24} />, color: 'blue' }, { title: 'Boost', desc: 'Raddoppia una tessera.', icon: <ChevronsUp size={24} />, color: 'yellow' }]} />}
            {showModeInfo && <InfoModal onClose={() => setShowModeInfo(false)} theme={uiTheme} title="Modalità" items={[{ title: 'Classica', desc: 'Strategia pura.', icon: <Grid3x3 size={24} />, color: 'gray' }, { title: 'Time Attack', desc: '15s. Unisci per tempo extra.', icon: <Clock size={24} />, color: 'red' }, { title: 'Zen', desc: 'Relax. No Game Over.', icon: <InfinityIcon size={24} />, color: 'purple' }]} />}
            {view === 'exit' && <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in"><Power size={80} className="text-red-500 mb-6 animate-pulse" /><h1 className="text-4xl font-black text-white mb-4">Arrivederci</h1></div>}

            {view === 'menu' && <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in"><h1 className="text-7xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-b from-current to-gray-500 tracking-tighter">2048</h1><div className="flex flex-col w-full max-w-xs gap-3"><MaterialButton onClick={() => setView('size_select')} icon={Play} label="Nuova Partita" colorClass={uiTheme.buttonPrimary} />{(saves.classic || saves.time_attack || saves.zen) && <MaterialButton onClick={() => setView('resume_select')} icon={FolderOpen} label="Continua" colorClass="bg-emerald-600 text-white" />}<div className="grid grid-cols-2 gap-3"><button onClick={() => setView('shop')} className={`${uiTheme.subPanel} py-4 rounded-2xl font-bold flex flex-col items-center hover:brightness-110 shadow-md`}><ShoppingBag size={20} /><span className="text-[10px] mt-1">SHOP</span></button><button onClick={() => setView('themes')} className={`${uiTheme.subPanel} py-4 rounded-2xl font-bold flex flex-col items-center hover:brightness-110 shadow-md`}><div className="text-lg">🎨</div><span className="text-[10px] mt-1">TEMI</span></button></div><div className="grid grid-cols-3 gap-3"><button onClick={() => setView('records')} className={`${uiTheme.subPanel} py-4 rounded-2xl font-bold flex flex-col items-center hover:brightness-110 shadow-md`}><Trophy size={18} /><span className="text-[10px] mt-1">RECORD</span></button><button onClick={() => setView('achievements')} className={`${uiTheme.subPanel} py-4 rounded-2xl font-bold flex flex-col items-center hover:brightness-110 shadow-md`}><Medal size={18} /><span className="text-[10px] mt-1">TROFEI</span></button><button onClick={() => setView('settings')} className={`${uiTheme.subPanel} py-4 rounded-2xl font-bold flex flex-col items-center hover:brightness-110 shadow-md`}><Settings size={18} /><span className="text-[10px] mt-1">OPZ</span></button></div><button onClick={() => { haptic.heavy(); setView('exit'); }} className="mt-4 flex items-center justify-center gap-2 text-red-500 py-2"><LogOut size={18} /> <span className="font-bold text-sm uppercase">Esci</span></button></div></div>}
            {view === 'shop' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-6"><h2 className="text-3xl font-bold mb-2">Negozio</h2><div className="bg-black/20 px-4 py-2 rounded-full mb-8 font-mono text-yellow-400 font-bold">🪙 {wallet} Punti</div><div className="w-full max-w-xs flex flex-col gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">{SHOP_ITEMS.map(item => (<div key={item.id} className={`${uiTheme.subPanel} p-4 rounded-2xl flex items-center gap-4 shadow-md`}><div className={`p-3 rounded-xl bg-indigo-500 text-white`}><item.icon size={24} /></div><div className="flex-1"><div className="font-bold">{item.name}</div><div className="text-[10px] opacity-60">{item.desc}</div><div className="flex justify-between items-center mt-1"><span className="text-xs font-bold text-yellow-500">{item.price} pts</span><span className="text-[10px] font-bold text-green-400">Possiedi: {inventory[item.id]}</span></div></div><button onClick={() => buyItem(item)} className={`px-4 py-2 rounded-lg font-bold text-sm ${wallet >= item.price ? 'bg-white text-black' : 'bg-white/10 text-white/50'}`}>Compra</button></div>))}</div><button onClick={() => setView('menu')} className="mt-4 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}
            {view === 'themes' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-6"><h2 className="text-3xl font-bold mb-2">Temi</h2><div className="bg-black/20 px-4 py-2 rounded-full mb-6 font-mono text-yellow-400 font-bold">🪙 {wallet} Punti</div><div className="grid grid-cols-2 gap-4 w-full max-w-xs flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">{Object.entries(THEME_PACKS).map(([id, pack]) => { const unlocked = unlockedThemes.includes(id); const active = currentThemePack === id; return (<div key={id} onClick={() => { if (unlocked) { setCurrentThemePack(id); haptic.medium(); } else buyTheme(id); }} className={`${uiTheme.subPanel} p-4 rounded-2xl flex flex-col items-center justify-center text-center relative border-2 ${active ? 'border-green-500' : 'border-transparent'} ${!unlocked && wallet < pack.price ? 'opacity-50' : ''}`}><div className="text-2xl mb-2">{typeof pack.icon === 'string' ? pack.icon : <pack.icon size={28} />}</div><div className="font-bold text-sm">{pack.name}</div>{unlocked ? <span className="text-[10px] text-green-400 uppercase font-bold mt-1">Sbloccato</span> : <span className="text-xs text-yellow-500 font-bold mt-1">{pack.price} pts</span>}{active && <div className="absolute top-2 right-2 text-green-500"><CheckCircle size={16} /></div>}</div>) })}</div><button onClick={() => setView('menu')} className="mt-4 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}
            {view === 'stats' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-6"><h2 className="text-3xl font-bold mb-8">Statistiche</h2><div className="grid grid-cols-2 gap-4 w-full max-w-xs"><div className={`${uiTheme.subPanel} p-4 rounded-2xl text-center shadow-md`}><div className="text-3xl font-black text-indigo-400">{stats.gamesPlayed}</div><div className="text-[10px] uppercase font-bold opacity-50">Partite</div></div><div className={`${uiTheme.subPanel} p-4 rounded-2xl text-center shadow-md`}><div className="text-3xl font-black text-pink-400">{stats.totalMoves}</div><div className="text-[10px] uppercase font-bold opacity-50">Mosse</div></div><div className={`${uiTheme.subPanel} p-4 rounded-2xl text-center shadow-md col-span-2`}><div className="text-4xl font-black text-yellow-400">{stats.maxTile}</div><div className="text-[10px] uppercase font-bold opacity-50">Tessera Massima</div></div></div><button onClick={() => setView('menu')} className="mt-8 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}
            {view === 'resume_select' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-8"><h2 className="text-3xl font-bold mb-8">Riprendi</h2><div className="w-full max-w-xs flex flex-col gap-4">{saves.classic ? <MaterialButton onClick={() => resumeGame(saves.classic)} icon={Grid3x3} label="Classica" subLabel={`${saves.classic.score} pts • ${saves.classic.size}x`} colorClass="bg-blue-600 text-white" /> : <div className="text-center opacity-30 italic p-4 border border-dashed border-current rounded-xl">Nessuna Classica</div>}{saves.time_attack ? <MaterialButton onClick={() => resumeGame(saves.time_attack)} icon={Clock} label="Time Attack" subLabel={`${saves.time_attack.score} pts • ${saves.time_attack.timeLeft}s`} colorClass="bg-red-600 text-white" /> : <div className="text-center opacity-30 italic p-4 border border-dashed border-current rounded-xl">Nessuna Time Attack</div>}{saves.zen ? <MaterialButton onClick={() => resumeGame(saves.zen)} icon={InfinityIcon} label="Zen" subLabel={`${saves.zen.score} pts`} colorClass="bg-purple-600 text-white" /> : <div className="text-center opacity-30 italic p-4 border border-dashed border-current rounded-xl">Nessuna Zen</div>}</div><button onClick={() => setView('menu')} className="mt-8 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}
            {view === 'size_select' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-6"><div className="flex justify-between w-full max-w-xs items-center mb-2"><h2 className="text-4xl font-black">Dimensione</h2><button onClick={() => setShowModeInfo(true)} className="p-2 bg-white/10 rounded-full"><Info size={20} /></button></div><div className="grid grid-cols-2 gap-4 w-full max-w-xs mt-8">{[3, 4, 5, 6].map(s => (<button key={s} onClick={() => startGame(mode, s)} className={`${uiTheme.subPanel} aspect-square rounded-3xl font-black text-4xl shadow-lg active:scale-95 flex flex-col items-center justify-center hover:brightness-110 border-b-4 border-black/10`}>{s}<span className="text-lg opacity-40">x</span>{s}</button>))}</div><div className="flex gap-2 mt-8 w-full max-w-xs"><button onClick={() => { haptic.medium(); setMode('classic'); }} className={`flex-1 py-3 rounded-xl font-bold text-[10px] border transition-all ${mode === 'classic' ? 'bg-current text-black border-transparent' : 'border-current opacity-40'}`} style={mode === 'classic' ? { backgroundColor: settings.theme === 'dark' ? 'white' : '#333', color: settings.theme === 'dark' ? 'black' : 'white' } : {}}>CLASSIC</button><button onClick={() => { haptic.medium(); setMode('time_attack'); }} className={`flex-1 py-3 rounded-xl font-bold text-[10px] border transition-all ${mode === 'time_attack' ? 'bg-red-500 border-red-500 text-white' : 'border-current opacity-40'}`}>TIME</button><button onClick={() => { haptic.medium(); setMode('zen'); }} className={`flex-1 py-3 rounded-xl font-bold text-[10px] border transition-all ${mode === 'zen' ? 'bg-purple-500 border-purple-500 text-white' : 'border-current opacity-40'}`}>ZEN</button></div><button onClick={() => setView('menu')} className="mt-8 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}
            {view === 'settings' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-8"><h2 className="text-3xl font-bold mb-8">Impostazioni</h2><div className="w-full max-w-xs flex flex-col gap-4"><button onClick={() => setSettings(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))} className={`${uiTheme.subPanel} p-5 rounded-2xl flex justify-between items-center shadow-md active:scale-95`}><span className="font-bold">Tema</span> {settings.theme === 'dark' ? <Moon className="text-indigo-400" /> : <Sun className="text-orange-400" />}</button><button onClick={() => setSettings(s => ({ ...s, muted: !s.muted }))} className={`${uiTheme.subPanel} p-5 rounded-2xl flex justify-between items-center shadow-md active:scale-95`}><span className="font-bold">Audio</span> {settings.muted ? <VolumeX className="text-red-400" /> : <Volume2 className="text-green-400" />}</button><button onClick={() => setSettings(s => ({ ...s, vibration: !s.vibration }))} className={`${uiTheme.subPanel} p-5 rounded-2xl flex justify-between items-center shadow-md active:scale-95`}><span className="font-bold">Vibrazione</span> {settings.vibration ? <Smartphone className="text-green-400" /> : <Smartphone className="text-red-400 opacity-50" />}</button><div className={`${uiTheme.subPanel} p-5 rounded-2xl shadow-md`}><div className="flex justify-between mb-3 text-sm font-bold opacity-70"><span>Volume</span> <span>{Math.round(settings.volume * 100)}%</span></div><input type="range" min="0" max="1" step="0.1" value={settings.volume} onChange={e => { const v = parseFloat(e.target.value); setSettings(s => ({ ...s, volume: v })); if (!settings.muted) audio.playTestFeedback(); haptic.light(); }} className="w-full accent-indigo-500 h-2 bg-black/20 rounded-full appearance-none cursor-pointer" /></div></div><button onClick={() => setView('menu')} className="mt-8 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}
            {view === 'records' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-8"><h2 className="text-3xl font-bold mb-8">Record</h2><div className="w-full max-w-xs flex-1 overflow-y-auto custom-scrollbar pr-2">{history.length === 0 ? <div className="text-center opacity-30 py-10 border border-dashed border-current rounded-2xl">Nessun record salvato.</div> : history.map((rec, i) => (<div key={i} className={`${uiTheme.subPanel} p-4 rounded-2xl mb-3 flex justify-between items-center shadow-sm`}><div><div className="font-black text-xl">{rec.score}</div><div className="text-[10px] opacity-60 font-medium uppercase">{rec.date} • {rec.mode}</div></div>{i === 0 && <Crown className="text-yellow-500 drop-shadow-md" size={24} />}</div>))}</div><button onClick={() => { setHistory([]); try { localStorage.removeItem(`2048-${VER}-history`); } catch (e) { } }} className="text-red-500 text-sm mt-4 font-bold">Cancella Tutto</button><button onClick={() => setView('menu')} className="mt-6 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}
            {view === 'achievements' && <div className="flex flex-col items-center justify-center h-full animate-fade-in p-8"><h2 className="text-3xl font-bold mb-8">Trofei</h2><div className="w-full max-w-xs flex-1 overflow-y-auto custom-scrollbar pr-2">{ACHIEVEMENTS_LIST.map((a) => { const unlocked = achievements.includes(a.id); return (<div onClick={() => { setSelectedTrophy(a); haptic.light(); }} key={a.id} className={`${uiTheme.subPanel} p-4 rounded-2xl mb-3 flex items-center gap-4 cursor-pointer active:scale-95 transition-transform ${unlocked ? 'shadow-md border-l-4 border-yellow-500' : 'opacity-40 grayscale'}`}><div className={`p-3 rounded-full ${unlocked ? 'bg-yellow-500 text-black' : 'bg-black/20'}`}><a.icon /></div><div className="flex-1"><div className="font-bold text-base leading-tight">{a.title}</div><div className="text-[10px] opacity-70 mt-1 truncate">{a.desc}</div></div>{unlocked ? <CheckCircle size={16} className="text-yellow-500" /> : <Info size={16} className="opacity-50" />}</div>) })}</div><button onClick={() => setView('menu')} className="mt-6 opacity-50 flex gap-2 items-center"><ArrowLeft size={18} /> Indietro</button></div>}

            {view === 'game' && (
                <div className="flex flex-col h-full max-w-lg mx-auto p-4 justify-center">
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setView('menu')} className={`${uiTheme.subPanel} p-3 rounded-2xl hover:brightness-110 shadow-md transition-all`}><Home size={22} /></button>
                            <div><div className="text-3xl font-black leading-none tracking-tight">2048</div><div className={`text-[10px] font-bold uppercase tracking-widest ${mode === 'time_attack' ? 'text-red-500' : mode === 'zen' ? 'text-purple-400' : uiTheme.accent}`}>{mode.replace('_', ' ')}</div></div>
                        </div>
                        <div className={`${uiTheme.subPanel} px-5 py-2.5 rounded-2xl text-right shadow-md min-w-[100px]`}>
                            <div className="text-[9px] uppercase font-bold opacity-50 tracking-widest">Punti</div>
                            <div className="text-2xl font-black leading-none">{score}</div>
                        </div>
                    </div>

                    {/* POWER UPS BAR */}
                    <div className="flex justify-between gap-2 mb-4">
                        <div className="flex gap-2 flex-1">
                            <button onClick={activateBomb} className={`flex-1 p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${isBombing ? 'bg-red-600 text-white animate-pulse' : uiTheme.subPanel}`}>
                                <Trash2 size={18} className={isBombing ? 'text-white' : 'text-red-400'} /><span className="text-[9px] font-bold">{inventory.bomb}</span>
                            </button>
                            <button onClick={activateShuffle} className={`flex-1 p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${uiTheme.subPanel}`}>
                                <RefreshCw size={18} className="text-blue-400" /><span className="text-[9px] font-bold">{inventory.shuffle}</span>
                            </button>
                            <button onClick={activateBoost} className={`flex-1 p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${uiTheme.subPanel}`}>
                                <ChevronsUp size={18} className="text-yellow-400" /><span className="text-[9px] font-bold">{inventory.boost}</span>
                            </button>
                        </div>
                        <button onClick={() => setShowPowerupInfo(true)} className={`${uiTheme.subPanel} p-3 rounded-xl flex flex-col items-center justify-center w-12 active:scale-95`}><Info size={20} className="opacity-50" /></button>
                    </div>

                    {mode === 'time_attack' && (
                        <div className="mb-6 relative h-4 bg-black/30 rounded-full overflow-hidden shadow-inner border border-white/5">
                            <div className={`h-full progress-striped transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-gradient-to-r from-green-500 to-emerald-400'}`} style={{ width: `${(timeLeft / 60) * 100}%` }} />
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md z-10 tracking-widest uppercase">{timeLeft}s rimanenti</div>
                        </div>
                    )}

                    {/* COMBO INDICATOR */}
                    {mode === 'time_attack' && combo > 1 && (
                        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-20 animate-pop-in">
                            <span className="text-4xl font-black text-yellow-400 drop-shadow-lg italic">x{combo}!</span>
                        </div>
                    )}

                    {/* GRID WITH THEME SUPPORT - FIX COLORI */}
                    <div className={`aspect-square rounded-3xl p-3 relative shadow-2xl ${isBombing ? 'ring-4 ring-red-500 cursor-pointer' : ''}`}
                        style={{ display: 'grid', gridTemplateColumns: `repeat(${gameSize}, 1fr)`, gap: '10px', backgroundColor: currentPack.grid }}>
                        {Array(gameSize * gameSize).fill(0).map((_, i) => <div key={i} className="rounded-xl" style={{ backgroundColor: currentPack.empty }} />)}
                        {tiles.map(t => {
                            const packColor = currentPack.colors[t.val];
                            const bgColor = typeof packColor === 'string' ? packColor : packColor?.bg || '#333';
                            const textColor = t.val > 4 ? '#fff' : '#333';
                            return (
                                <div key={t.id} onClick={() => handleTileClick(t.id)}
                                    className={`absolute flex items-center justify-center font-bold rounded-xl transition-all duration-200 ${t.isNew ? 'animate-pop-in' : ''} ${t.isMerged ? 'z-20 scale-110 shadow-xl' : 'z-10'} ${isBombing ? 'hover:opacity-50' : ''}`}
                                    style={{
                                        width: `calc((100% - 20px) / ${gameSize} - 10px)`, height: `calc((100% - 20px) / ${gameSize} - 10px)`,
                                        left: `calc(((100% - 20px) / ${gameSize}) * ${t.c} + 10px)`, top: `calc(((100% - 20px) / ${gameSize}) * ${t.r} + 10px)`,
                                        backgroundColor: bgColor, color: textColor, boxShadow: t.val > 128 ? `0 0 15px ${bgColor}` : 'none',
                                        fontSize: gameSize > 4 ? (t.val > 100 ? '14px' : '18px') : (t.val > 1000 ? '26px' : '34px')
                                    }}>
                                    {t.val}
                                </div>
                            )
                        })}
                    </div>
                    {gameOver && <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-fade-in backdrop-blur-md"><h2 className="text-6xl font-black text-red-500 mb-2 drop-shadow-lg">Game Over</h2><div className="flex gap-3"><button onClick={() => startGame(mode, gameSize)} className="bg-white text-black px-6 py-3 rounded-xl font-bold">Riprova</button><button onClick={() => setView('menu')} className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold">Menu</button></div></div>}
                </div>
            )}

            <style>{`
            @keyframes pop-in { 0% { transform: scale(0); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
            @keyframes stripes { from { background-position: 0 0; } to { background-position: 20px 20px; } }
            .progress-striped { background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent); background-size: 20px 20px; animation: stripes 1s linear infinite; }
            .animate-pop-in { animation: pop-in 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
            .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
            .animate-confetti { animation: confetti 2.5s linear forwards; }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }
          `}</style>
        </div>
    );
};

const App = () => (
    <ErrorBoundary>
        <AppContent />
    </ErrorBoundary>
);

export default App;
