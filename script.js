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
// ***** DATABASE IKLAN (KIRI & KANAN) - 16 KATEGORI *****
// *********************************************************

// 1. DAFTAR IKLAN KIRI (Shopee Style - Nuansa Hangat)
const adsListLeft = [
    // 1. Rumah Tangga
    { title: "Rumah Tangga", sub: "Dekorasi Estetik", icon: "🏠", color: "linear-gradient(to bottom, #ff5722, #e64a19)", 
      link: "https://shopee.co.id/rumah-tangga" }, // <--- GANTI LINK
    
    // 2. Audio, Kamera & Elektronik
    { title: "Elektronik", sub: "Kamera & Audio", icon: "📷", color: "linear-gradient(to bottom, #ff9800, #f57c00)", 
      link: "https://shopee.co.id/elektronik" }, // <--- GANTI LINK
    
    // 3. Dapur
    { title: "Alat Dapur", sub: "Masak Jadi Mudah", icon: "🍳", color: "linear-gradient(to bottom, #ffc107, #ffb300)", 
      link: "https://shopee.co.id/dapur" }, // <--- GANTI LINK
    
    // 4. Fashion Anak & Bayi
    { title: "Fashion Anak", sub: "Baju Lucu Murah", icon: "👶", color: "linear-gradient(to bottom, #ff7043, #f4511e)", 
      link: "https://shopee.co.id/fashion-anak" }, // <--- GANTI LINK
    
    // 5. Fashion Muslim
    { title: "Busana Muslim", sub: "Tren Hijab Kekinian", icon: "🧕", color: "linear-gradient(to bottom, #d84315, #bf360c)", 
      link: "https://shopee.co.id/fashion-muslim" }, // <--- GANTI LINK
    
    // 6. Fashion Pria
    { title: "Fashion Pria", sub: "Kemeja & Kaos", icon: "👕", color: "linear-gradient(to bottom, #f44336, #d32f2f)", 
      link: "https://shopee.co.id/fashion-pria" }, // <--- GANTI LINK
    
    // 7. Fashion Wanita
    { title: "Fashion Wanita", sub: "OOTD Hits", icon: "👗", color: "linear-gradient(to bottom, #e91e63, #c2185b)", 
      link: "https://shopee.co.id/fashion-wanita" }, // <--- GANTI LINK
    
    // 8. Film dan Musik
    { title: "Film & Musik", sub: "Album Original", icon: "🎵", color: "linear-gradient(to bottom, #9c27b0, #7b1fa2)", 
      link: "https://shopee.co.id/film-musik" }, // <--- GANTI LINK
    
    // 9. Gaming
    { title: "Gaming Zone", sub: "Konsol & Aksesoris", icon: "🎮", color: "linear-gradient(to bottom, #673ab7, #512da8)", 
      link: "https://shopee.co.id/gaming" }, // <--- GANTI LINK
    
    // 10. Handphone dan Tablet
    { title: "HP & Tablet", sub: "Gadget Terbaru", icon: "📱", color: "linear-gradient(to bottom, #3f51b5, #303f9f)", 
      link: "https://shopee.co.id/handphone" }, // <--- GANTI LINK
    
    // 11. Ibu dan Bayi
    { title: "Ibu & Bayi", sub: "Susu & Popok", icon: "🍼", color: "linear-gradient(to bottom, #2196f3, #1976d2)", 
      link: "https://shopee.co.id/ibu-bayi" }, // <--- GANTI LINK
    
    // 12. Kecantikan
    { title: "Kecantikan", sub: "Skincare Glowing", icon: "💄", color: "linear-gradient(to bottom, #e040fb, #d500f9)", 
      link: "https://shopee.co.id/kecantikan" }, // <--- GANTI LINK
    
    // 13. Kesehatan
    { title: "Kesehatan", sub: "Vitamin & Suplemen", icon: "💊", color: "linear-gradient(to bottom, #009688, #00796b)", 
      link: "https://shopee.co.id/kesehatan" }, // <--- GANTI LINK
    
    // 14. Komputer dan Laptop
    { title: "Komputer", sub: "Laptop Kerja/Gaming", icon: "💻", color: "linear-gradient(to bottom, #4caf50, #388e3c)", 
      link: "https://shopee.co.id/komputer" }, // <--- GANTI LINK
    
    // 15. Mainan dan Hobi
    { title: "Mainan & Hobi", sub: "Koleksi Action Figure", icon: "🤖", color: "linear-gradient(to bottom, #8bc34a, #689f38)", 
      link: "https://shopee.co.id/mainan" }, // <--- GANTI LINK
    
    // 16. Dan Lain-lain
    { title: "Serba Serbi", sub: "Produk Unik", icon: "🎁", color: "linear-gradient(to bottom, #cddc39, #afb42b)", 
      link: "https://shopee.co.id/serba-serbi" }  // <--- GANTI LINK
];

// 2. DAFTAR IKLAN KANAN (Tokopedia Style - Nuansa Hijau/Biru/Cool)
const adsListRight = [
    // 1. Rumah Tangga
    { title: "Home Living", sub: "Nyaman di Rumah", icon: "🛌", color: "linear-gradient(to bottom, #42b549, #2e7d32)", 
      link: "https://tokopedia.com/home-living" }, // <--- GANTI LINK
    
    // 2. Audio, Kamera & Elektronik
    { title: "Audio & Cam", sub: "Jernih & Tajam", icon: "🎧", color: "linear-gradient(to bottom, #00aa5b, #007a41)", 
      link: "https://tokopedia.com/audio" }, // <--- GANTI LINK
    
    // 3. Dapur
    { title: "Chef Dapur", sub: "Peralatan Premium", icon: "🔪", color: "linear-gradient(to bottom, #0097a7, #006064)", 
      link: "https://tokopedia.com/dapur" }, // <--- GANTI LINK
    
    // 4. Fashion Anak & Bayi
    { title: "Kids Style", sub: "Fashion Si Kecil", icon: "🧸", color: "linear-gradient(to bottom, #039be5, #01579b)", 
      link: "https://tokopedia.com/fashion-anak" }, // <--- GANTI LINK
    
    // 5. Fashion Muslim
    { title: "Moslem Wear", sub: "Elegan & Syari", icon: "🕌", color: "linear-gradient(to bottom, #1e88e5, #0d47a1)", 
      link: "https://tokopedia.com/fashion-muslim" }, // <--- GANTI LINK
    
    // 6. Fashion Pria
    { title: "Men's Look", sub: "Maskulin & Trendy", icon: "👞", color: "linear-gradient(to bottom, #3949ab, #1a237e)", 
      link: "https://tokopedia.com/fashion-pria" }, // <--- GANTI LINK
    
    // 7. Fashion Wanita
    { title: "Women's Chic", sub: "Cantik Tiap Hari", icon: "👠", color: "linear-gradient(to bottom, #5e35b1, #311b92)", 
      link: "https://tokopedia.com/fashion-wanita" }, // <--- GANTI LINK
    
    // 8. Film dan Musik
    { title: "Entertainment", sub: "Voucher Streaming", icon: "🎬", color: "linear-gradient(to bottom, #8e24aa, #4a148c)", 
      link: "https://tokopedia.com/entertainment" }, // <--- GANTI LINK
    
    // 9. Gaming
    { title: "Pro Gamers", sub: "Top Up & Voucher", icon: "🕹️", color: "linear-gradient(to bottom, #d81b60, #880e4f)", 
      link: "https://tokopedia.com/gaming" }, // <--- GANTI LINK
    
    // 10. Handphone dan Tablet
    { title: "Smartphone", sub: "Android & iOS", icon: "📲", color: "linear-gradient(to bottom, #e53935, #b71c1c)", 
      link: "https://tokopedia.com/handphone" }, // <--- GANTI LINK
    
    // 11. Ibu dan Bayi
    { title: "Mom & Baby", sub: "Perlengkapan Bayi", icon: "🤰", color: "linear-gradient(to bottom, #fb8c00, #e65100)", 
      link: "https://tokopedia.com/ibu-bayi" }, // <--- GANTI LINK
    
    // 12. Kecantikan
    { title: "Beauty Bar", sub: "Makeup Original", icon: "💅", color: "linear-gradient(to bottom, #fdd835, #fbc02d)", 
      link: "https://tokopedia.com/kecantikan" }, // <--- GANTI LINK
    
    // 13. Kesehatan
    { title: "Zona Sehat", sub: "Obat & Alkes", icon: "🩺", color: "linear-gradient(to bottom, #7cb342, #33691e)", 
      link: "https://tokopedia.com/kesehatan" }, // <--- GANTI LINK
    
    // 14. Komputer dan Laptop
    { title: "PC & Laptop", sub: "Rakitan & Aksesoris", icon: "🖱️", color: "linear-gradient(to bottom, #00897b, #004d40)", 
      link: "https://tokopedia.com/komputer" }, // <--- GANTI LINK
    
    // 15. Mainan dan Hobi
    { title: "Hobbies", sub: "Diecast & Gundam", icon: "🎨", color: "linear-gradient(to bottom, #039be5, #01579b)", 
      link: "https://tokopedia.com/hobi" }, // <--- GANTI LINK
    
    // 16. Dan Lain-lain
    { title: "Everything Else", sub: "Produk Lainnya", icon: "🔍", color: "linear-gradient(to bottom, #546e7a, #263238)", 
      link: "https://tokopedia.com/lain-lain" }  // <--- GANTI LINK
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

// --- FUNGSI ROTASI IKLAN ---
function startAdRotation() {
    updateAdSide('left', 0);
    updateAdSide('right', 0);

    // Ganti iklan tiap 10 detik
    setInterval(() => {
        indexLeft = (indexLeft + 1) % adsListLeft.length;
        indexRight = (indexRight + 1) % adsListRight.length;
        animateAdUpdate('left', indexLeft);
        animateAdUpdate('right', indexRight);
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
        if(o === correctOpt) {
            p = correctPercent;
        } else {
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
        wrapper.innerHTML = `
            <div class="poll-bar" style="height: 0%;" data-percent="${res.percent}"></div>
            <div class="poll-label">${res.prefix}<br><small>${res.percent}%</small></div>
        `;
        container.appendChild(wrapper);
    });

    setTimeout(() => {
        container.querySelectorAll('.poll-bar').forEach(bar => {
            bar.style.height = bar.dataset.percent + "%";
        });
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
        const wrongOpts = Array.from(document.querySelectorAll('.option'))
            .map(o => o.dataset.answer)
            .filter(a => a !== correct);
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
    const wrongOpts = Array.from(document.querySelectorAll('.option'))
        .filter(o => o.dataset.answer !== q.a);
    
    for(let i=0; i<Math.min(2, wrongOpts.length); i++) {
        wrongOpts[i].classList.add('disabled');
    }
}

// --- Utils & Host ---
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
