// --- Impor Firebase ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA88-FpW6V0okBYUE9CqSUt5_YjEzbnEyY",
    authDomain: "milionare-3bf47.firebaseapp.com",
    projectId: "milionare-3bf47",
    storageBucket: "milionare-3bf47.firebasestorage.app",
    messagingSenderId: "259209976100",
    appId: "1:259209976100:web:df20a25b08a8fb5ded3bb1"
};

let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) { console.error("Firebase Init Error:", e); }

// *********************************************************
// ***** DATABASE IKLAN (DI-GENERATE OTOMATIS) *****
// *********************************************************

const adsListLeft = [
    {
        "title": "Cek Jamise | Jenna Abaya",
        "sub": "Abaya Basic Syari List (New Material)",
        "link": "https://s.shopee.co.id/6VGBPpxi9k?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Pembersih Kerak Membandel",
        "sub": "Cek Cairan Pink / Merah Zenic Cleaner 1 liter pembersih kerak membandel di lantai westafel toilet kamar mandi paling ampuh",
        "link": "https://s.shopee.co.id/AUmKBVWLgD?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #eace00, #ffd600)"
    },
    {
        "title": "Cek Fazira Dress Gamis Polos Casual Size S-M L-XL 3L-XX",
        "sub": "Pakaian Muslim Wanita Bahan Sabrina Anti UV dengan harga Rp136.050. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/6fZbcUjimu?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek T9 DRAGON",
        "sub": "Alat Cukur Rambut Dragon T9 Cukur Rambut Hair Clipper dengan harga Rp19.899. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/9AGwb80LQ1?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #f44336, #d32f2f)"
    },
    {
        "title": "Cek CELANA Sport DewasaTerbaru",
        "sub": "AM/Jumbo/Pria Dewasa /Futsal/Badminton/Voli/Lari/COD/Nyaman dipakai/Unisex/BanyakPilihanWarna dengan harga Rp13.500. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/8fKg0EWR57?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #ff7337, #ee4d2d)"
    },
    {
        "title": "Cek Reaim Jet Cleaner 130Bar",
        "sub": "Jet Cleaner Mesin Cuci Mobil Alat Cuci Motor Dan Mobil semprotan cuci motor dengan harga Rp94.999. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/2qMt3XIucE?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #eace00, #ffd600)"
    },
    {
        "title": "Cek HEADPHONE Bluetooth Gaming Headset Wireless Pro Bass P47 headset",
        "sub": " Bluetooth p47 headset bluetooth dengan harga Rp26.990. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/7fS8oRUDcW?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek 100% BESTSELLER!",
        "sub": "Sepatu Sport Anak Laki Laki Sneaker Anak Keren Sepatu Sekolah Anak Untuk Cowok Kualitas Bagus dengan harga Rp100.000. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/5q0Ud66D8Y?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #ff7337, #ee4d2d)"
    },
    {
        "title": "Cek HEADPHONE",
        "sub": "Bluetooth Gaming Headset Wireless Pro Bass P47 headset Bluetooth p47 headset bluetooth dengan harga Rp26.990. Dapatkan di Shopee sekarang! ",
        "link": "https://s.shopee.co.id/gIOTctvjz?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek Botol Minuman Portable Cup 600 & 800 ML",
        "sub": "High Quality dengan harga Rp6.999. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/6VGBQNFSCr?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #eace00, #ffd600)"
    },
    {
        "title": "Cek VECLA Semprotan Pengusir Tikus Alami Obat Anti Tikus Ampuh",
        "sub": "Mobil dan Rumah 250 ml dengan harga Rp19.997. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/2B7CGR4XQW?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #f44336, #d32f2f)"
    },
    {
        "title": "Cek Dispenser Beras Otomatis & Estetik - 5kg/10kg",
        "sub": "Wadah penyimpanan Beras Food Grade & Anti Kutu dengan harga Rp97.830. Dapatkan di Shopee sekarang! ",
        "link": "https://s.shopee.co.id/804zDAzJu3?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #eace00, #ffd600)"
    },
    {
        "title": "Cek M10 Headset Bluetooth Wireless",
        "sub": "TWS + Power Bank 3500mAh dengan harga Rp28.776. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/1LY5Gxstav?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek Jas Hujan Gamis, Mantel Hujan Wanita Muslimah Syar'i ",
        "sub": "Bahan Tebal Elastis Kuat Anti Rembes By HANS dengan harga Rp62.183. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/7plZ0xJvuq?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek LITTLE O Tumbler STARBUCKS Tumbler Stainley Tumbler",
        "sub": "Stainless Steel 472ml 16oz Starbucks Tumbler Stainless Steel Polished 473ml TUMBLER STARBUCKS dengan harga Rp71.250. Dapatkan di Shopee sekarang! ",
        "link": "https://s.shopee.co.id/30gJG6tXL5?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #eace00, #ffd600)"
    },
    {
        "title": "Cek BISA COD parfum pria Paket Bundling ( BUY 1 GET 4 ) ",
        "sub": "Parfum MR CRASH dengan harga Rp28.500. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/30gJG8X4f3?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #eace00, #ffd600)"
    },
    {
        "title": "Cek Colfi Payung Lipat Otomatis Jumbo Buka Tutup Anti UV",
        "sub": "Payung Lipat Otomatis 10 Rangka Premium Quality dengan harga Rp27.985. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/9pWdOkIQeR?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek 4 pcs 100 ribu kaos pria wanita terlaris/ kaos pria murah/ kaos usinex/ kaos oblong / kaos polos/ kaos harian dengan harga Rp100.000",
        "sub": "Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/10vEsXBmxp?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #ff7337, #ee4d2d)"
    },
    {
        "title": "Cek VOOVA",
        "sub": "Sandal Selop Wanita/ Sandal Indoor/Sandal Wanita Karet/Sandal Rumah/Sandal Luar Rumah dengan harga Rp27.097. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/9fDDCU9bN6?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek Basreng Kriuk Pedas Daun Jeruk 500gr",
        "sub": "Homemade dengan harga Rp19.750. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/8Khpc53ykw?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #f44336, #d32f2f)"
    },
    {
        "title": "Cek HCS Jas Hujan Pria dan Wanita Anti Rembes",
        "sub": "Jas Hujan Setelan Mocca dengan harga Rp52.800. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/8V1FoQtbli?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek Payung Lipat Otomatis Anti UV Buka Tutup 3 Lipat Automatic Umbrella",
        "sub": "Premium Bahan Vinyl 2 Lapis dengan harga Rp34.100. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/1gAvftWYSc?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #ff7337, #ee4d2d)"
    },
    {
        "title": "Cek JAS HUJAN GAMIS SYAR'I MUSLIMAH NYAMAN PREMIUM ANTI REMBES",
        "sub": "BY ALSTAR dengan harga Rp87.500. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/8zxWPOzZEW?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #ff7337, #ee4d2d)"
    },
    {
        "title": "Cek PASHLINC Tumbler Tahan Panas Dingin 24Jam",
        "sub": "Tumblr Premium Quality Stainless Botol Minum Aesthetic Thermos Tumbler Lucu Botol Minum 900ML and 600ML dengan harga Rp145.000. Dapatkan di Shopee sekarang!",
        "link": "https://s.shopee.co.id/7V8icfvKJI?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #9c27b0, #7b1fa2)"
    },
    {
        "title": "Cek Kipas Angin Genggam Portabel Turbo",
        "sub": "100 Level, Angin Kencang, Super Sunyi, Bisa Diisi Ulang Type-C, Kipas Mini Tangan untuk Rumah, Kantor, Perjalanan dengan harga Rp56.000. Dapatkan di Shopee sekarang! ",
        "link": "https://s.shopee.co.id/6pt1pUA38Q?share_channel_code=1",
        "icon": "🛍️",
        "color": "linear-gradient(to bottom, #ff7337, #ee4d2d)"
    }
];

const adsListRight = [
    {
        "title": "Tokopedia",
        "sub": "Coba cek ini, deh. Harganya",
        "link": "https://tk.tokopedia.com/ZSfFpmS5q/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #00bfa5, #00897b)"
    },
    {
        "title": "Coba cek ini, deh",
        "sub": "Harganya Rp700.000 aja!",
        "link": "https://tk.tokopedia.com/ZSfFpmS5q/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #2196f3, #1565c0)"
    },
    {
        "title": "🤩 Ada diskon 45% jadi Rp152.500, nih.",
        "sub": "Cek di Tokopedia sebelum diskonnya kehabisan!",
        "link": "https://tk.tokopedia.com/ZSfFsR9F9/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #00bfa5, #00897b)"
    },
    {
        "title": "🤩 Ada diskon 33% jadi Rp289.000, nih",
        "sub": "Buruan cek di Tokopedia sebelum diskonnya berakhir!",
        "link": "https://tk.tokopedia.com/ZSfFs1FLv/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #42b549, #35953d)"
    },
    {
        "title": "Coba cek ini, deh.",
        "sub": "Harganya Rp61.680 aja!",
        "link": "https://tk.tokopedia.com/ZSfFs2ka9/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #42b549, #35953d)"
    },
    {
        "title": "🤩 Ada diskon 5% jadi Rp1.999.000, nih.",
        "sub": "Cek di Tokopedia sebelum diskonnya kehabisan!",
        "link": "https://tk.tokopedia.com/ZSfFsxGW4/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #0f146d, #183590)"
    },
    {
        "title": "Coba cek ini, deh",
        "sub": "Harganya Rp999.000 aja!",
        "link": "https://tk.tokopedia.com/ZSfFspSym/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #00bfa5, #00897b)"
    },
    {
        "title": "🤩 Ada diskon 52% jadi Rp62.999, nih",
        "sub": " Cek di Tokopedia sebelum diskonnya kehabisan!",
        "link": "https://tk.tokopedia.com/ZSfFGd3Cn/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #2196f3, #1565c0)"
    },
    {
        "title": "🤩 Ada diskon 17% jadi Rp6.465.000, nih",
        "sub": "Buruan cek di Tokopedia sebelum diskonnya berakhir!",
        "link": "https://tk.tokopedia.com/ZSfFGGCqq/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #42b549, #35953d)"
    },
    {
        "title": "🤩 Ada diskon 24% jadi Rp79.500, nih",
        "sub": "Cek di Tokopedia sebelum diskonnya kehabisan!",
        "link": "https://tk.tokopedia.com/ZSfFGpkWH/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #0f146d, #183590)"
    },
    {
        "title": "🤩 Ada diskon 61% jadi Rp52.950, nih",
        "sub": "Buruan cek di Tokopedia sebelum diskonnya berakhir!",
        "link": "https://tk.tokopedia.com/ZSfFGKueu/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #2196f3, #1565c0)"
    },
    {
        "title": "Coba cek ini, deh",
        "sub": "Harganya Rp103.000 aja!",
        "link": "https://tk.tokopedia.com/ZSfFtApq7/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #42b549, #35953d)"
    },
    {
        "title": "Coba cek ini, deh.",
        "sub": "Harganya Rp29.999 aja!",
        "link": "https://tk.tokopedia.com/ZSfFtDsrk/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #0f146d, #183590)"
    },
    {
        "title": "🤩 Ada diskon 54% jadi Rp3.250, nih. ",
        "sub": "Cek di Tokopedia sebelum diskonnya kehabisan!",
        "link": "https://tk.tokopedia.com/ZSfFt7QGQ/",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #42b549, #35953d)"
    },
    {
        "title": "🤩 Ada diskon 77% jadi Rp20.000, nih. ",
        "sub": "Buruan cek di Tokopedia sebelum diskonnya berakhir! ",
        "link": "https://tk.tokopedia.com/ZSfFtGntq/ ",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #0f146d, #183590)"
    },
    {
        "title": "Coba cek ini, deh. ",
        "sub": "Harganya Rp700.000 aja! ",
        "link": "https://tk.tokopedia.com/ZSfFtbfrk/ ",
        "icon": "💚",
        "color": "linear-gradient(to bottom, #42b549, #35953d)"
    }
];

let indexLeft = 0;
let indexRight = 0;

// *********************************************************

const prizeLadderValues_Full = [50000, 125000, 250000, 500000, 1000000, 2000000, 4000000, 8000000, 16000000, 32000000, 64000000, 125000000, 250000000, 500000000, 1000000000];
const prizeLadderValues_Mobile = [50, 125, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const pointSystem = [4, 8, 12, 16, 20, 27, 34, 41, 48, 55, 64, 73, 82, 91, 100];

let currentLadderValues = [];
let currentLadderDisplay = [];
let deviceType = "PC"; 
let rawLeaderboardData = []; 
let playerName = "", currentQuestions = [], currentQuestionIndex = 0, currentScore = 0;
let timerInterval, dialInterval, customGameId = null, selectedOption = null;

const getEl = (id) => document.getElementById(id);

window.addEventListener('DOMContentLoaded', () => {
    checkURLHash();
    setupEventListeners();
    startAdRotation(); 
});

function startAdRotation() {
    if(adsListLeft.length > 0) updateAdSide('left', 0);
    if(adsListRight.length > 0) updateAdSide('right', 0);

    setInterval(() => {
        if(adsListLeft.length > 0) {
            indexLeft = (indexLeft + 1) % adsListLeft.length;
            animateAdUpdate('left', indexLeft);
        }
        if(adsListRight.length > 0) {
            indexRight = (indexRight + 1) % adsListRight.length;
            animateAdUpdate('right', indexRight);
        }
    }, 10000); 
}

function animateAdUpdate(side, index) {
    const btn = getEl(`dynamic-ad-link-${side}`);
    if(!btn) return;
    btn.classList.add('fade-out');
    setTimeout(() => {
        updateAdSide(side, index);
        btn.classList.remove('fade-out');
    }, 500);
}

function updateAdSide(side, index) {
    const list = (side === 'left') ? adsListLeft : adsListRight;
    if(!list || list.length === 0) return;
    
    const ad = list[index];
    const btn = getEl(`dynamic-ad-link-${side}`);
    const title = getEl(`dynamic-ad-title-${side}`);
    const sub = getEl(`dynamic-ad-sub-${side}`);
    const icon = getEl(`dynamic-ad-icon-${side}`);

    if(btn && title && sub && icon && ad) {
        btn.href = ad.link;
        btn.style.background = ad.color; 
        title.textContent = ad.title;
        sub.textContent = ad.sub;
        icon.textContent = ad.icon;
    }
}

async function checkURLHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        customGameId = hash;
        ['fase-select-container', 'host-section-container', 'score-section-container', 'host-separator'].forEach(id => {
            if(getEl(id)) getEl(id).classList.add('hidden');
        });
        if(getEl('custom-game-info')) getEl('custom-game-info').classList.remove('hidden');

        try {
            const docRef = doc(db, "custom_games", customGameId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const allQ = docSnap.data().questions;
                currentQuestions = sortQuestionsByDifficulty(allQ);
                if (currentQuestions.length < 15) {
                    alert("Soal kustom rusak (kurang dari 15).");
                    getEl('start-game-btn').disabled = true;
                } else {
                    getEl('custom-game-status').textContent = "Soal Kustom Siap!";
                }
            } else { alert("Kuis tidak ditemukan!"); }
        } catch (e) { console.error(e); }
    }
}

function setupEventListeners() {
    getEl('start-game-btn')?.addEventListener('click', startGame);
    getEl('confirm-yes')?.addEventListener('click', processAnswer);
    getEl('confirm-no')?.addEventListener('click', () => getEl('confirm-modal').style.display = 'none');
    getEl('toggle-host-btn')?.addEventListener('click', () => getEl('host-panel').classList.toggle('hidden'));
    getEl('generate-link-btn')?.addEventListener('click', generateCustomGame);
    getEl('view-scores-btn')?.addEventListener('click', viewCustomScores);
    getEl('lifeline-phone')?.addEventListener('click', usePhoneLifeline);
    getEl('lifeline-poll')?.addEventListener('click', usePollLifeline);
    getEl('lifeline-5050')?.addEventListener('click', useFiftyFifty);
    
    getEl('close-phone-modal-btn')?.addEventListener('click', () => {
        getEl('phone-modal').style.display = 'none';
        clearInterval(dialInterval);
        if(getEl('game-screen').classList.contains('active')) startTimer(parseInt(getEl('timer').textContent));
    });
    getEl('close-poll-modal-btn')?.addEventListener('click', () => {
        getEl('poll-modal').style.display = 'none';
        if(getEl('game-screen').classList.contains('active')) startTimer(parseInt(getEl('timer').textContent));
    });
    getEl('close-score-view-btn')?.addEventListener('click', () => getEl('score-view-modal').style.display = 'none');
    getEl('close-share-modal-btn')?.addEventListener('click', () => getEl('share-link-modal').style.display = 'none');
    getEl('close-modal-btn')?.addEventListener('click', () => getEl('how-to-modal').style.display = 'none');
    getEl('how-to-csv-link')?.addEventListener('click', () => getEl('how-to-modal').style.display = 'flex');
    getEl('copy-link-btn')?.addEventListener('click', () => {
        getEl('shareable-link-input').select();
        document.execCommand('copy');
    });
    getEl('export-excel-btn')?.addEventListener('click', exportScoresToExcel);
    
    getEl('options-container')?.addEventListener('click', (e) => {
        const opt = e.target.closest('.option');
        if(opt && !opt.classList.contains('disabled')) {
            document.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
            opt.classList.add('selected');
            selectedOption = opt;
            stopTimer();
            getEl('confirm-modal').style.display = 'flex';
        }
    });
    
    document.querySelectorAll('.phone-contact').forEach(c => {
        c.addEventListener('click', () => generatePhoneAnswer(c.dataset.contact));
    });
}

async function startGame() {
    playerName = getEl('player-name-input').value.trim();
    if (!playerName) return alert("Nama wajib diisi!");
    getEl('start-game-btn').disabled = true;
    getEl('start-game-btn').textContent = "Memuat...";

    if (window.innerWidth <= 768) {
        deviceType = "HP";
        currentLadderValues = prizeLadderValues_Mobile;
    } else {
        deviceType = "PC";
        currentLadderValues = prizeLadderValues_Full;
    }
    currentLadderDisplay = currentLadderValues.map(v => "Rp " + v.toLocaleString('id-ID'));
    
    if (!customGameId) {
        const fase = getEl('fase-select').value;
        try {
            const res = await fetch(`Fase${fase}.csv`);
            if (!res.ok) throw new Error("Gagal load CSV lokal");
            const txt = await res.text();
            const allQ = parseCSV(txt);
            currentQuestions = sortQuestionsByDifficulty(allQ);
            if (currentQuestions.length < 15) throw new Error("Soal CSV kurang dari 15");
        } catch (e) {
            alert("Error: " + e.message);
            getEl('start-game-btn').disabled = false;
            getEl('start-game-btn').textContent = "Mulai Bermain";
            return;
        }
    }
    
    currentQuestionIndex = 0;
    currentScore = 0;
    document.querySelectorAll('.lifeline').forEach(l => l.classList.remove('used'));
    getEl('start-screen').classList.remove('active');
    getEl('game-screen').classList.add('active');
    getEl('opening-audio').play();
    setTimeout(() => getEl('bg-audio').play(), 3000);
    buildLadder(); 
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    getEl('question-text').textContent = q.q;
    const container = getEl('options-container');
    container.innerHTML = "";
    let opts = q.o.split('\\');
    opts = shuffleArray(opts);
    opts.forEach((txt, idx) => {
        const char = String.fromCharCode(65 + idx);
        const div = document.createElement('div');
        div.className = 'option';
        div.dataset.answer = txt;
        div.innerHTML = `<span>${char}:</span> <p>${txt}</p>`;
        container.appendChild(div);
    });
    updateLadder(); 
    startTimer();
}

function processAnswer() {
    getEl('confirm-modal').style.display = 'none';
    if(!selectedOption) return;
    const ans = selectedOption.dataset.answer;
    const correct = currentQuestions[currentQuestionIndex].a;
    document.querySelectorAll('.option').forEach(o => o.classList.add('disabled'));
    if(ans === correct) {
        selectedOption.classList.add('correct');
        getEl('correct-audio').play();
        currentScore = currentLadderValues[currentQuestionIndex]; 
        currentQuestionIndex++;
        if(currentQuestionIndex >= 15) winGame();
        else setTimeout(showQuestion, 2000);
    } else {
        selectedOption.classList.add('wrong');
        document.querySelectorAll('.option').forEach(o => {
            if(o.dataset.answer === correct) o.classList.add('correct');
        });
        getEl('wrong-audio').play();
        setTimeout(loseGame, 2000);
    }
}

function winGame() {
    alert(`SELAMAT! Anda menang ${currentLadderDisplay[14]}`); 
    saveScore(playerName, currentScore, 100); 
    setTimeout(resetGame, 2000);
}

function loseGame() {
    let finalMoney = 0;
    if(currentQuestionIndex >= 10) finalMoney = currentLadderValues[9];
    else if(currentQuestionIndex >= 5) finalMoney = currentLadderValues[4];
    let finalPoints = 0;
    if (currentQuestionIndex > 0) {
        finalPoints = pointSystem[currentQuestionIndex - 1];
    }
    alert(`Game Over! Anda membawa pulang: Rp ${finalMoney.toLocaleString('id-ID')}`);
    saveScore(playerName, finalMoney, finalPoints);
    setTimeout(resetGame, 2000);
}

function resetGame() { window.location.reload(); }

function usePollLifeline() {
    const btn = getEl('lifeline-poll');
    if(btn.classList.contains('used')) return;
    btn.classList.add('used');
    stopTimer();
    getEl('poll-modal').style.display = 'flex';
    const q = currentQuestions[currentQuestionIndex];
    const opts = document.querySelectorAll('.option:not(.disabled)');
    let correctOpt;
    opts.forEach(o => { if(o.dataset.answer === q.a) correctOpt = o; });
    const total = 100;
    const correctPercent = Math.floor(Math.random() * 30) + 40; 
    let remain = total - correctPercent;
    const container = getEl('poll-chart-container');
    container.innerHTML = "";
    let results = [];
    opts.forEach(o => {
        let p = 0;
        if(o === correctOpt) { p = correctPercent; } else {
            const chunk = Math.floor(Math.random() * remain);
            p = chunk;
            remain -= chunk;
        }
        const prefix = o.querySelector('span').textContent.replace(':', '');
        results.push({ prefix: prefix, percent: p });
    });
    results.forEach(res => {
        const wrapper = document.createElement('div');
        wrapper.className = 'poll-bar-wrapper';
        wrapper.innerHTML = `<div class="poll-bar" style="height: 0%;" data-percent="${res.percent}"></div><div class="poll-label">${res.prefix}<br><small>${res.percent}%</small></div>`;
        container.appendChild(wrapper);
    });
    setTimeout(() => {
        container.querySelectorAll('.poll-bar').forEach(bar => { bar.style.height = bar.dataset.percent + "%"; });
    }, 100); 
}

function usePhoneLifeline() {
    const btn = getEl('lifeline-phone');
    if(btn.classList.contains('used')) return;
    btn.classList.add('used');
    stopTimer();
    getEl('phone-contact-grid').classList.remove('hidden');
    getEl('phone-dialing-screen').classList.add('hidden');
    getEl('phone-response-area').classList.add('hidden');
    getEl('phone-modal').style.display = 'flex';
}

function generatePhoneAnswer(type) {
    getEl('phone-contact-grid').classList.add('hidden');
    getEl('phone-dialing-screen').classList.remove('hidden');
    let time = 10;
    const timerSpan = getEl('dialing-timer');
    timerSpan.textContent = time;
    clearInterval(dialInterval);
    dialInterval = setInterval(() => {
        time--;
        timerSpan.textContent = time;
        if(time <= 0) {
            clearInterval(dialInterval);
            showPhoneResult(type);
        }
    }, 1000);
}

function showPhoneResult(type) {
    getEl('phone-dialing-screen').classList.add('hidden');
    getEl('phone-response-area').classList.remove('hidden');
    const q = currentQuestions[currentQuestionIndex];
    const correct = q.a;
    const isCorrect = Math.random() < (type === 'expert' ? 0.9 : 0.6);
    let ans = correct;
    if(!isCorrect) {
        const wrongOpts = Array.from(document.querySelectorAll('.option')).map(o => o.dataset.answer).filter(a => a !== correct);
        ans = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
    }
    let prefix = "?";
    document.querySelectorAll('.option').forEach(o => {
        if(o.dataset.answer === ans) prefix = o.querySelector('span').textContent;
    });
    getEl('phone-response-text').innerHTML = `Jawabannya mungkin <strong>${prefix} ${ans}</strong>`;
}

function useFiftyFifty() {
    const btn = getEl('lifeline-5050');
    if(btn.classList.contains('used')) return;
    btn.classList.add('used');
    const q = currentQuestions[currentQuestionIndex];
    const wrongOpts = Array.from(document.querySelectorAll('.option')).filter(o => o.dataset.answer !== q.a);
    for(let i=0; i<Math.min(2, wrongOpts.length); i++) { wrongOpts[i].classList.add('disabled'); }
}

function startTimer(val = 60) {
    clearInterval(timerInterval);
    let t = (val && val > 0) ? val : 60;
    getEl('timer').textContent = t;
    timerInterval = setInterval(() => {
        t--;
        getEl('timer').textContent = t;
        if(t <= 0) {
            clearInterval(timerInterval);
            loseGame();
        }
    }, 1000);
}
function stopTimer() { clearInterval(timerInterval); }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sortQuestionsByDifficulty(allQ) {
    const easy = allQ.filter(x => x.difficulty == 1);
    const med = allQ.filter(x => x.difficulty == 2);
    const hard = allQ.filter(x => x.difficulty == 3);
    const shuffledEasy = shuffleArray([...easy]);
    const shuffledMed = shuffleArray([...med]);
    const shuffledHard = shuffleArray([...hard]);
    if(shuffledEasy.length < 5 || shuffledMed.length < 5 || shuffledHard.length < 5) return [];
    return [...shuffledEasy.slice(0,5), ...shuffledMed.slice(0,5), ...shuffledHard.slice(0,5)];
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/).slice(1);
    return lines.map(l => {
        const parts = l.split(',');
        if(parts.length < 4) return null;
        return {
            q: parts[0].replace(/"/g, ''),
            o: parts[1].replace(/"/g, ''),
            a: parts[2].replace(/"/g, ''),
            difficulty: parseInt(parts[3])
        };
    }).filter(x => x);
}

function buildLadder() {
    const ul = getEl('prize-ladder');
    ul.innerHTML = "";
    const safePoints = [4, 9, 14]; 
    currentLadderDisplay.forEach((p, i) => {
        const li = document.createElement('li');
        li.textContent = `${i+1}. ${p}`;
        li.dataset.level = i;
        if(safePoints.includes(i)) li.classList.add('safe');
        ul.appendChild(li);
    });
}

function updateLadder() {
    document.querySelectorAll('#prize-ladder li').forEach((li, i) => {
        if(i === currentQuestionIndex) li.classList.add('current');
        else li.classList.remove('current');
    });
}

async function generateCustomGame() {
    const url = getEl('google-sheet-input').value;
    if(!url.includes('output=csv')) return alert("Link harus CSV!");
    try {
        const res = await fetch(url);
        const txt = await res.text();
        const qs = parseCSV(txt);
        if(qs.length < 15) return alert("Soal kurang!");
        const ref = await addDoc(collection(db, "custom_games"), { questions: qs, createdAt: serverTimestamp() });
        getEl('shareable-link-input').value = window.location.origin + window.location.pathname + "#" + ref.id;
        getEl('share-link-modal').style.display = 'flex';
    } catch(e) { alert("Gagal: " + e.message); }
}

async function viewCustomScores() {
    const id = getEl('view-quiz-id-input').value;
    if(!id) return;
    const tbody = getEl('score-table-body');
    tbody.innerHTML = "Loading...";
    rawLeaderboardData = []; 
    try {
        const q = query(collection(db, `leaderboard_${id}`), orderBy('skor', 'desc'), limit(50));
        const snap = await getDocs(q);
        tbody.innerHTML = "";
        snap.forEach((d, i) => {
            const data = d.data();
            const date = data.tanggal ? data.tanggal.toDate().toLocaleDateString('id-ID') : '-';
            rawLeaderboardData.push({ Peringkat: i + 1, Nama: data.nama, Uang: data.skor, Nilai: data.poin || 0, Perangkat: data.device || 'PC', Tanggal: date });
            tbody.innerHTML += `<tr><td>${i+1}</td><td>${data.nama}</td><td>Rp ${data.skor.toLocaleString('id-ID')}</td><td>${data.poin || 0}</td><td>${data.device || '-'}</td><td>${date}</td></tr>`;
        });
        getEl('score-view-modal').style.display = 'flex';
    } catch(e) { alert("Gagal ambil skor."); }
}

function exportScoresToExcel() {
    if (!window.XLSX) return alert("Library Excel belum siap. Refresh halaman.");
    if (rawLeaderboardData.length === 0) return alert("Belum ada data.");
    const ws = window.XLSX.utils.json_to_sheet(rawLeaderboardData);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Leaderboard");
    const quizId = getEl('view-quiz-id-input').value.split('#').pop().trim() || "leaderboard";
    window.XLSX.writeFile(wb, `Skor_${quizId}.xlsx`);
}

async function saveScore(name, moneyValue, pointsValue) {
    console.log(`Simpan: ${name} | Rp ${moneyValue} | Poin ${pointsValue}`);
    try {
        const leaderboardCollection = customGameId ? `leaderboard_${customGameId}` : "leaderboard";
        await addDoc(collection(db, leaderboardCollection), {
            nama: name,
            skor: moneyValue,  
            poin: pointsValue, 
            device: deviceType,
            tanggal: serverTimestamp()
        });
    } catch (error) {
        console.error("Gagal menyimpan skor: ", error);
    }
}
