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

// --- LOGIKA HADIAH & DEVICE ---
const prizeLadderValues_Full = [50000, 125000, 250000, 500000, 1000000, 2000000, 4000000, 8000000, 16000000, 32000000, 64000000, 125000000, 250000000, 500000000, 1000000000];
const prizeLadderDisplay_Full = prizeLadderValues_Full.map(v => "Rp " + v.toLocaleString('id-ID'));

const prizeLadderValues_Mobile = [50, 125, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const prizeLadderDisplay_Mobile = prizeLadderValues_Mobile.map(v => "Rp " + v.toLocaleString('id-ID'));

let currentLadderValues = [];
let currentLadderDisplay = [];
let deviceType = "PC"; // Default

let playerName = "", currentQuestions = [], currentQuestionIndex = 0, currentScore = 0;
let timerInterval, dialInterval, customGameId = null, selectedOption = null;

const getEl = (id) => document.getElementById(id);

// --- MAIN INIT ---
window.addEventListener('DOMContentLoaded', () => {
    checkURLHash();
    setupEventListeners();
});

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

    // --- DEVICE DETECTION ---
    if (window.innerWidth <= 768) {
        deviceType = "HP";
        currentLadderValues = prizeLadderValues_Mobile;
        currentLadderDisplay = prizeLadderDisplay_Mobile;
    } else {
        deviceType = "PC";
        currentLadderValues = prizeLadderValues_Full;
        currentLadderDisplay = prizeLadderDisplay_Full;
    }
    
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
    saveScore(playerName, currentScore);
    setTimeout(resetGame, 2000);
}

function loseGame() {
    let finalScore = 0;
    if(currentQuestionIndex >= 10) finalScore = currentLadderValues[9];
    else if(currentQuestionIndex >= 5) finalScore = currentLadderValues[4];
    
    alert(`Game Over! Anda membawa pulang: Rp ${finalScore.toLocaleString('id-ID')}`);
    saveScore(playerName, finalScore);
    setTimeout(resetGame, 2000);
}

// --- PERBAIKAN v22: Auto Refresh ---
function resetGame() {
    window.location.reload();
}

// --- LIFELINES ---
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
    try {
        const q = query(collection(db, `leaderboard_${id}`), orderBy('skor', 'desc'), limit(50));
        const snap = await getDocs(q);
        tbody.innerHTML = "";
        snap.forEach((d, i) => {
            const data = d.data();
            const date = data.tanggal ? data.tanggal.toDate().toLocaleDateString('id-ID') : '-';
            // Tampilkan kolom Device
            tbody.innerHTML += `<tr>
                <td>${i+1}</td>
                <td>${data.nama}</td>
                <td>${data.skor.toLocaleString()}</td>
                <td>${data.device || '-'}</td>
                <td>${date}</td>
            </tr>`;
        });
        getEl('score-view-modal').style.display = 'flex';
    } catch(e) { alert("Gagal ambil skor."); }
}

// --- PERBAIKAN v23: Akses window.XLSX ---
function exportScoresToExcel() {
    if (!window.XLSX) return alert("Library Excel belum siap. Refresh halaman.");
    
    const table = document.getElementById('score-table');
    const wb = window.XLSX.utils.table_to_book(table, {sheet: "Leaderboard"});
    const quizId = getEl('view-quiz-id-input').value.split('#').pop().trim() || "leaderboard";
    window.XLSX.writeFile(wb, `Skor_${quizId}.xlsx`);
}

async function saveScore(name, scoreValue) {
    console.log(`Menyimpan skor: ${name} - ${scoreValue} - ${deviceType}`);
    try {
        const leaderboardCollection = customGameId ? `leaderboard_${customGameId}` : "leaderboard";
        await addDoc(collection(db, leaderboardCollection), {
            nama: name,
            skor: scoreValue,
            device: deviceType, // Simpan Device
            tanggal: serverTimestamp()
        });
    } catch (error) {
        console.error("Gagal menyimpan skor: ", error);
    }
}
