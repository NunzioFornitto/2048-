import {
    Grid3x3, Ghost, Snowflake, CloudRain, Sun as SunIcon, Wind,
    Trash2, RefreshCw, ChevronsUp, Zap, Trophy, Crown, Flame, Clock, Infinity as InfinityIcon
} from 'lucide-react';

export const VER = 'v6.1';
export const TIME_ATTACK_START = 15;
export const ANIMATION_DURATION = 200;
export const COMBO_TIMEOUT = 1500;
export const generateId = () => Date.now() + Math.random();

export const UI_THEME = {
    dark: { bg: 'bg-[#121212]', text: 'text-[#E0E0E0]', panel: 'bg-[#1E1E1E]', subPanel: 'bg-[#2C2C2C]', buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white', accent: 'text-indigo-400' },
    light: { bg: 'bg-[#FAF8EF]', text: 'text-[#776E65]', panel: 'bg-[#BBADA0]', subPanel: 'bg-[#cdc1b4]', buttonPrimary: 'bg-[#8F7A66] hover:bg-[#9F8B77] text-white', accent: 'text-[#EDC22E]' }
};

export const THEME_PACKS = {
    classic: {
        name: 'Classico', price: 0, icon: Grid3x3,
        grid: '#bbada0', empty: '#cdc1b4',
        colors: { 2: '#EEE4DA', 4: '#EDE0C8', 8: '#F2B179', 16: '#F59563', 32: '#F67C5F', 64: '#F65E3B', 128: '#EDCF72', 256: '#EDCC61', 512: '#EDC850', 1024: '#EDC53F', 2048: '#EDC22E' }
    },
    halloween: {
        name: 'Halloween', price: 1000, icon: Ghost,
        grid: '#2D1B0E', empty: '#1F1208',
        colors: { 2: '#E0E0E0', 4: '#FFCCBC', 8: '#FFAB91', 16: '#FF8A65', 32: '#FF7043', 64: '#D32F2F', 128: '#7B1FA2', 256: '#512DA8', 512: '#303F9F', 1024: '#0288D1', 2048: '#004D40' }
    },
    christmas: {
        name: 'Natale', price: 1500, icon: Snowflake,
        grid: '#1B5E20', empty: '#0D3810',
        colors: { 2: '#FFFFFF', 4: '#FFCDD2', 8: '#EF9A9A', 16: '#E57373', 32: '#F44336', 64: '#D32F2F', 128: '#C62828', 256: '#FFD54F', 512: '#FFC107', 1024: '#FFB300', 2048: '#FFA000' }
    },
    spring: {
        name: 'Primavera', price: 2000, icon: CloudRain,
        grid: '#A5D6A7', empty: '#81C784',
        colors: { 2: '#F8BBD0', 4: '#F48FB1', 8: '#F06292', 16: '#CE93D8', 32: '#BA68C8', 64: '#AB47BC', 128: '#9FA8DA', 256: '#7986CB', 512: '#5C6BC0', 1024: '#80CBC4', 2048: '#4DB6AC' }
    },
    summer: {
        name: 'Estate', price: 2500, icon: SunIcon,
        grid: '#FFF59D', empty: '#FFF176',
        colors: { 2: '#29B6F6', 4: '#03A9F4', 8: '#039BE5', 16: '#0288D1', 32: '#FFF176', 64: '#FFEE58', 128: '#FFEB3B', 256: '#FDD835', 512: '#FFB74D', 1024: '#FFA726', 2048: '#FF9800' }
    },
    autumn: {
        name: 'Autunno', price: 2000, icon: Wind,
        grid: '#D7CCC8', empty: '#BCAAA4',
        colors: { 2: '#FFCC80', 4: '#FFB74D', 8: '#FFA726', 16: '#FF9800', 32: '#FB8C00', 64: '#F57C00', 128: '#EF6C00', 256: '#E65100', 512: '#8D6E63', 1024: '#795548', 2048: '#6D4C41' }
    },
    winter: {
        name: 'Inverno', price: 1500, icon: Snowflake,
        grid: '#B3E5FC', empty: '#81D4FA',
        colors: { 2: '#E1F5FE', 4: '#B3E5FC', 8: '#81D4FA', 16: '#4FC3F7', 32: '#29B6F6', 64: '#03A9F4', 128: '#039BE5', 256: '#0288D1', 512: '#0277BD', 1024: '#01579B', 2048: '#1A237E' }
    }
};

export const SHOP_ITEMS = [
    { id: 'bomb', name: 'Bomba', icon: Trash2, price: 500, desc: 'Distruggi una tessera' },
    { id: 'shuffle', name: 'Shuffle', icon: RefreshCw, price: 250, desc: 'Mescola la griglia' },
    { id: 'boost', name: 'Boost', icon: ChevronsUp, price: 1000, desc: 'Raddoppia una tessera' }
];

export const ACHIEVEMENTS_LIST = [
    { id: 'novice', icon: Zap, title: 'Novizio', desc: 'Raggiungi la tessera 512', mode: 'Tutte', reward: 1, type: 'shuffle' },
    { id: 'pro', icon: Trophy, title: 'Pro', desc: 'Raggiungi la tessera 1024', mode: 'Tutte', reward: 1, type: 'bomb' },
    { id: 'veteran', icon: Crown, title: 'Veterano', desc: 'Raggiungi la tessera 2048', mode: 'Tutte', reward: 1, type: 'boost' },
    { id: 'king', icon: Crown, title: 'Il Re', desc: 'Raggiungi la tessera 4096', mode: 'Tutte', reward: 2, type: 'random' },
    { id: 'emperor', icon: Flame, title: 'Imperatore', desc: 'Raggiungi la tessera 8192', mode: 'Tutte', reward: 3, type: 'random' },
    { id: 'speedster', icon: Clock, title: 'Velocista', desc: '1000 punti in < 60s', mode: 'Time Attack', reward: 1, type: 'boost' },
    { id: 'survivor', icon: Flame, title: 'Sopravvissuto', desc: 'Fai 5000 punti', mode: 'Time Attack', reward: 2, type: 'shuffle' },
    { id: 'tiny', icon: Grid3x3, title: 'Micrometrico', desc: 'Vinci (2048) su griglia 3x3', mode: 'Tutte (3x3)', reward: 3, type: 'random' },
    { id: 'zen_master', icon: InfinityIcon, title: 'Zen Master', desc: 'Fai 500 mosse', mode: 'Zen', reward: 1, type: 'shuffle' }
];
