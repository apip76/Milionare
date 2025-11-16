// --- Impor Firebase v9+ (ES Module) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, 
    query, where, orderBy, limit, serverTimestamp, 
    doc, getDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --- Konfigurasi Firebase Anda ---
const firebaseConfig = {
    apiKey: "AIzaSyA88-FpW6V0okBYUE9CqSUt5_YjEzbnEyY",
    authDomain: "milionare-3bf47.firebaseapp.com",
    projectId: "milionare-3bf47",
    storageBucket: "milionare-3bf47.firebasestorage.app",
    messagingSenderId: "259209976100",
    appId: "1:259209976100:web:df20a25b08a8fb5ded3bb1"
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Tangga Hadiah ---
const prizeLadderDisplay = [
    "Rp 50.000", "Rp 125.000", "Rp 250.000", "Rp 500.000", "Rp 1.000.000",
    "Rp 2.000.000", "Rp 4.000.000", "Rp 8.000.000", "Rp 16.000.000", "Rp 32.000.000",
    "Rp 64.000.000", "Rp 125.000.000", "Rp 250.000.000", "Rp 500.000.000", "Rp 1 MILYAR"
];
const prizeLadderValues = [
    50000, 125000, 250000, 500000, 1000000,
    2000000, 4000000, 8000000, 16000000, 32000000,
    64000000, 125000000, 250000000, 500000000, 1000000000
];

// --- Variabel Global Game ---
let playerName = "";
let currentQuestions = [];
let customGameQuestions = []; 
let customGameId = null; 
let currentQuestionIndex = 0;
let currentScore = "Rp 0";
let currentScoreValue = 0;
let timer;
let timerInterval;
let selectedOption = null;

// --- Elemen DOM ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-game-btn');
const nameInput = document.getElementById('player-name-input');
const faseSelect = document.getElementById('fase-select');
const faseSelectContainer = document.getElementById('fase-select-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const optionButtons = document.querySelectorAll('.option');
const timerDisplay = document.getElementById('timer');
const prizeLadderList = document.getElementById('prize-ladder');
const confirmModal = document.getElementById('confirm-modal');
const confirmYesBtn = document.getElementById('confirm-yes');
const confirmNoBtn = document.getElementById('confirm-no');
const openingAudio = document.getElementById('opening-audio');
const bgAudio = document.getElementById('bg-audio');
const correctAudio = document.getElementById('correct-audio');
const wrongAudio = document.getElementById('wrong-audio');
const customGameInfo = document.getElementById('custom-game-info');
const customGameStatus = document.getElementById('custom-game-status');
const hostControls = document.getElementById('host-controls');
const toggleHostBtn = document.getElementById('toggle-host-btn');
const hostPanel = document.getElementById('host-panel');
const gSheetInput = document.getElementById('google-sheet-input');
const generateLinkBtn = document.getElementById('generate-link-btn');
const howToModal = document.getElementById('how-to-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const howToCsvLink = document.getElementById('how-to-csv-link');
const shareLinkModal = document.getElementById('share-link-modal');
const shareableLinkInput = document.getElementById('shareable-link-input');
const copyLinkBtn = document.getElementById('copy-link-btn');
const closeShareModalBtn = document.getElementById('close-share-modal-btn');
const phoneLifelineBtn = document.getElementById('lifeline-phone');
const phoneModal = document.getElementById('phone-modal');
const phoneTitle = document.getElementById('phone-title');
const phoneContactGrid = document.getElementById('phone-contact-grid');
const phoneResponseArea = document.getElementById('phone-response-area');
const phoneResponseText = document.getElementById('phone-response-text');
const closePhoneModalBtn = document.
