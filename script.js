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
const closePhoneModalBtn = document.getElementById('close-phone-modal-btn');
const pollLifelineBtn = document.getElementById('lifeline-poll');
const fiftyLifelineBtn = document.getElementById('lifeline-5050');
const viewScoresBtn = document.getElementById('view-scores-btn');
const viewQuizIdInput = document.getElementById('view-quiz-id-input');
const scoreViewModal = document.getElementById('score-view-modal');
const scoreViewTitle = document.getElementById('score-view-title');
const scoreTableBody = document.getElementById('score-table-body');
const closeScoreViewBtn = document.getElementById('close-score-view-btn');
const exportExcelBtn = document.getElementById('export-excel-btn'); // <-- ELEMEN BARU

// --- Pengecekan URL (Dijalankan saat halaman dimuat) ---
window.addEventListener('DOMContentLoaded', checkURLHash);
async function checkURLHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        customGameId = hash;
        customGameInfo.classList.remove('hidden');
        faseSelectContainer.classList.add('hidden');
        hostControls.classList.add('hidden');
        document.getElementById('host-separator').classList.add('hidden');
        document.querySelector('.host-hr').classList.add('hidden');
        document.getElementById('view-scores-controls').classList.add('hidden');
        try {
            const docRef = doc(db, "custom_games", customGameId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const allQuestions = docSnap.data().questions;
                const sortedQuestions = sortQuestionsByDifficulty(allQuestions);
                if (sortedQuestions.length < 15) {
                    customGameStatus.textContent = `Error: Kuis kustom tidak lengkap. Butuh min. 5 soal per level.`;
                    startBtn.disabled = true; return;
                }
                customGameQuestions = sortedQuestions;
                customGameStatus.textContent = `Kuis Kustom Siap! (${customGameQuestions.length} soal ditemukan)`;
            } else {
                customGameStatus.textContent = "Error: Kuis kustom dengan ID ini tidak ditemukan!";
                startBtn.disabled = true;
            }
        } catch (error) {
            console.error("Error mengambil kuis kustom:", error);
            customGameStatus.textContent = "Error: Gagal memuat kuis.";
            startBtn.disabled = true;
        }
    }
}

// --- Event Listeners ---
startBtn.addEventListener('click', startGame);
confirmYesBtn.addEventListener('click', processAnswer);
confirmNoBtn.addEventListener('click', cancelAnswer);
optionsContainer.addEventListener('click', (e) => {
    const clickedOption = e.target.closest('.option'); 
    if (!clickedOption || clickedOption.classList.contains('disabled')) return;
    optionButtons.forEach(btn => btn.classList.remove('selected'));
    clickedOption.classList.add('selected');
    selectedOption = clickedOption;
    stopTimer();
    confirmModal.style.display = 'flex';
});
toggleHostBtn.addEventListener('click', () => hostPanel.classList.toggle('hidden'));
howToCsvLink.addEventListener('click', (e) => { e.preventDefault(); howToModal.style.display = 'flex'; });
closeModalBtn.addEventListener('click', () => howToModal.style.display = 'none');
generateLinkBtn.addEventListener('click', generateCustomGame);
closeShareModalBtn.addEventListener('click', () => shareLinkModal.style.display = 'none');
copyLinkBtn.addEventListener('click', () => {
    shareableLinkInput.select();
    document.execCommand('copy');
    copyLinkBtn.textContent = 'Disalin!';
    setTimeout(() => { copyLinkBtn.textContent = 'Salin Link'; }, 2000);
});
phoneLifelineBtn.addEventListener('click', usePhoneLifeline);
phoneContactGrid.addEventListener('click', (e) => {
    const contact = e.target.closest('.phone-contact');
    if (contact) generatePhoneAnswer(contact.dataset.contact);
});
closePhoneModalBtn.addEventListener('click', () => {
    phoneModal.style.display = 'none';
    startTimer(parseInt(timerDisplay.textContent));
});
fiftyLifelineBtn.addEventListener('click', useFiftyFifty);
viewScoresBtn.addEventListener('click', viewCustomScores);
closeScoreViewBtn.addEventListener('click', () => {
    scoreViewModal.style.display = 'none';
});
exportExcelBtn.addEventListener('click', exportScoresToExcel); // <-- EVENT LISTENER BARU

// --- Fungsi Lihat Hasil Kuis (v6) ---
async function viewCustomScores() {
    const quizId = viewQuizIdInput.value.split('#').pop().trim();
    if (!quizId) {
        alert("Harap masukkan ID Kuis Kustom Anda.");
        return;
    }
    viewScoresBtn.disabled = true;
    viewScoresBtn.textContent = "Mencari...";
    scoreTableBody.innerHTML = "";
    scoreViewTitle.textContent = `Leaderboard untuk Kuis ID: ${quizId}`;
    try {
        const leaderboardCollection = `leaderboard_${quizId}`;
        const q = query(collection(db, leaderboardCollection), orderBy("skor", "desc"), limit(100));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            scoreTableBody.innerHTML = '<tr><td colspan="4">Belum ada data skor untuk kuis ini.</td></tr>';
            exportExcelBtn.disabled = true; // Nonaktifkan tombol export jika tidak ada data
        } else {
            let rank = 1, html = "";
            snapshot.forEach((doc) => {
                const data = doc.data();
                const scoreString = new Intl.NumberFormat('id-ID', { 
                    style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
                }).format(data.skor);
                const date = data.tanggal ? data.tanggal.toDate().toLocaleString('id-ID') : 'N/A';
                html += `<tr><td>${rank}</td><td>${data.nama}</td><td>${scoreString}</td><td>${date}</td></tr>`;
                rank++;
            });
            scoreTableBody.innerHTML = html;
            exportExcelBtn.disabled = false; // Aktifkan tombol export
        }
        scoreViewModal.style.display = 'flex';
    } catch (error) {
        console.error("Gagal mengambil skor:", error);
        alert("Gagal mengambil data skor. Pastikan ID Kuis benar.");
    } finally {
        viewScoresBtn.disabled = false;
        viewScoresBtn.textContent = "Tampilkan Skor";
    }
}

// --- FUNGSI BARU (v8) UNTUK EXPORT EXCEL ---
function exportScoresToExcel() {
    // Ambil tabel dari modal
    const table = document.getElementById('score-table');
    
    // Gunakan library SheetJS (XLSX) untuk mengkonversi tabel HTML ke "workbook"
    // 'XLSX' adalah objek global dari script CDN yang kita tambahkan
    const wb = XLSX.utils.table_to_book(table, {sheet: "Leaderboard"});

    // Buat nama file yang dinamis berdasarkan ID Kuis
    const quizId = viewQuizIdInput.value.split('#').pop().trim() || "leaderboard";
    const filename = `Skor_${quizId}.xlsx`;

    // Minta SheetJS untuk membuat & men-download file
    XLSX.writeFile(wb, filename);
}

// --- Fungsi Game ---
async function startGame() {
    playerName = nameInput.value;
    if (playerName.trim() === "") {
        alert("Harap masukkan nama Anda!");
        return;
    }
    currentQuestions = [];
    currentQuestionIndex = 0;
    currentScore = "Rp 0";
    currentScoreValue = 0;
    document.querySelectorAll('.lifeline').forEach(btn => btn.classList.remove('used'));
    startBtn.disabled = true;
    startBtn.textContent = "Memuat...";
    try {
        let allQuestions = [];
        if (customGameId && customGameQuestions.length > 0) {
            console.log("Memuat kuis kustom...");
            currentQuestions = customGameQuestions;
        } else if (!customGameId) {
            console.log("Memuat kuis default (Lokal CSV)...");
            const selectedFase = faseSelect.value;
            const fileName = `Fase${selectedFase}.csv`;
            const response = await fetch(fileName);
            if (!response.ok) throw new Error(`File soal ${fileName} tidak ditemukan. Pastikan file ada di folder yang sama dengan index.html dan Anda menggunakan Live Server.`);
            const csvData = await response.text();
            allQuestions = parseCSV(csvData);
            const sortedQuestions = sortQuestionsByDifficulty(allQuestions);
            if (sortedQuestions.length < 15) {
                throw new Error(`Soal di ${fileName} tidak lengkap. Butuh minimal 5 soal untuk level Mudah, 5 Sedang, dan 5 Sulit.`);
            }
            currentQuestions = sortedQuestions;
        } else {
             throw new Error("Soal kustom tidak dapat dimuat.");
        }
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        openingAudio.play();
        openingAudio.onended = () => { bgAudio.play(); };
        buildPrizeLadder();
        showQuestion();
    } catch (error) {
        console.error("Gagal memulai game: ", error);
        alert(`Error: ${error.message}`);
    } finally {
        startBtn.disabled = false;
        startBtn.textContent = "Mulai Bermain";
    }
}
function sortQuestionsByDifficulty(allQuestions) {
    const easyPool = [], mediumPool = [], hardPool = [];
    allQuestions.forEach(q => {
        if (q.difficulty === 1) easyPool.push(q);
        else if (q.difficulty === 2) mediumPool.push(q);
        else if (q.difficulty === 3) hardPool.push(q);
    });
    shuffleArray(easyPool);
    shuffleArray(mediumPool);
    shuffleArray(hardPool);
    if (easyPool.length < 5 || mediumPool.length < 5 || hardPool.length < 5) {
        console.error(`Soal tidak cukup! Mudah: ${easyPool.length}, Sedang: ${mediumPool.length}, Sulit: ${hardPool.length}. (Butuh 5 dari masing-masing)`);
        return [];
    }
    return [ ...easyPool.slice(0, 5), ...mediumPool.slice(0, 5), ...hardPool.slice(0, 5) ];
}

// --- Fungsi Bantuan (Lifelines) ---
function usePhoneLifeline() {
    if (phoneLifelineBtn.classList.contains('used')) return;
    stopTimer();
    phoneLifelineBtn.classList.add('used');
    phoneTitle.textContent = "Pilih Bantuan";
    phoneContactGrid.classList.remove('hidden');
    phoneResponseArea.classList.add('hidden');
    phoneResponseText.innerHTML = "";
    phoneModal.style.display = 'flex';
}
function generatePhoneAnswer(contactType) {
    const correctAnswer = currentQuestions[currentQuestionIndex].a;
    const visibleOptions = [];
    optionButtons.forEach(btn => { if (!btn.classList.contains('disabled')) visibleOptions.push(btn.dataset.answer); });
    const wrongOptions = visibleOptions.filter(opt => opt !== correctAnswer);
    let finalAnswer, reliability = 0.6, name = "Teman";
    if (contactType === 'expert') { reliability = 0.9; name = "Ahli"; }
    if (Math.random() < reliability) finalAnswer = correctAnswer;
    else finalAnswer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    phoneTitle.textContent = `Panggilan ke ${name}...`;
    phoneContactGrid.classList.add('hidden');
    phoneResponseArea.classList.remove('hidden');
    phoneResponseText.innerHTML = `Halo? Hmm, pertanyaan yang sulit... <br>Saya tidak 100% yakin, tapi saya rasa jawabannya adalah <strong>${finalAnswer}</strong>.`;
}
function useFiftyFifty() {
    if (fiftyLifelineBtn.classList.contains('used')) return;
    fiftyLifelineBtn.classList.add('used');
    const correctAnswer = currentQuestions[currentQuestionIndex].a;
    const wrongOptions = [];
    optionButtons.forEach(btn => { if (btn.dataset.answer !== correctAnswer) wrongOptions.push(btn); });
    shuffleArray(wrongOptions);
    wrongOptions[0].classList.add('disabled');
    wrongOptions[1].classList.add('disabled');
}

// --- Fungsi Host (Kustom) ---
async function generateCustomGame() {
    const csvUrl = gSheetInput.value;
    if (!csvUrl || !csvUrl.includes('pub?output=csv')) {
        alert("URL tidak valid. Pastikan itu adalah link Google Sheet yang dipublikasikan sebagai CSV.");
        return;
    }
    generateLinkBtn.disabled = true;
    generateLinkBtn.textContent = "Memproses CSV...";
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("Gagal mengambil data dari link CSV.");
        const csvData = await response.text();
        const questions = parseCSV(csvData);
        if (questions.length === 0) throw new Error("Tidak ada soal yang ditemukan di CSV. Pastikan formatnya benar (q,o,a,difficulty).");
        const easy = questions.filter(q => q.difficulty === 1).length;
        const medium = questions.filter(q => q.difficulty === 2).length;
        const hard = questions.filter(q => q.difficulty === 3).length;
        if (easy < 5 || medium < 5 || hard < 5) {
            throw new Error(`Soal tidak lengkap! Butuh min. 5 per level. Ditemukan: Mudah(${easy}), Sedang(${medium}), Sulit(${hard})`);
        }
        const docRef = await addDoc(collection(db, "custom_games"), {
            questions: questions,
            createdAt: serverTimestamp()
        });
        const shareLink = `${window.location.origin}${window.location.pathname}#${docRef.id}`;
        shareableLinkInput.value = shareLink;
        shareLinkModal.style.display = 'flex';
        gSheetInput.value = "";
    } catch (error) {
        console.error("Gagal membuat game kustom:", error);
        alert(`Error: ${error.message}`);
    } finally {
        generateLinkBtn.disabled = false;
        generateLinkBtn.textContent = "Buat Link Game";
    }
}

// --- Fungsi Helper (Utility) ---
function parseCSV(csvData) {
    const questions = [];
    const lines = csvData.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const parts = line.split(','); 
        if (parts.length >= 4) {
            const q = parts[0].trim().replace(/"/g, '');
            const o = parts[1].trim().replace(/"/g, ''); 
            const a = parts[2].trim().replace(/"/g, '');
            const difficulty = parseInt(parts[3].trim().replace(/"/g, ''), 10);
            if (q && o && a && difficulty) {
                questions.push({ q, o, a, difficulty });
            }
        }
    }
    return questions;
}
function showQuestion() {
    resetState();
    const questionData = currentQuestions[currentQuestionIndex];
    questionText.textContent = questionData.q;
    let options = parseOptions(questionData.o);
    options = shuffleArray(options);
    optionButtons.forEach((btn, index) => {
        btn.querySelector('p').textContent = options[index];
        btn.dataset.answer = options[index]; 
    });
    updatePrizeLadder();
    startTimer(60);
}
function parseOptions(optionsString) {
    return optionsString.split('\\'); 
}
function processAnswer() {
    confirmModal.style.display = 'none';
    if (!selectedOption) return;
    const selectedAnswer = selectedOption.dataset.answer; 
    const correctAnswer = currentQuestions[currentQuestionIndex].a;
    optionButtons.forEach(btn => btn.classList.add('disabled'));
    if (selectedAnswer === correctAnswer) {
        selectedOption.classList.add('correct');
        correctAudio.play();
        currentQuestionIndex++;
        if (currentQuestionIndex === prizeLadderDisplay.length) {
            currentScore = prizeLadderDisplay[currentQuestionIndex - 1];
            currentScoreValue = prizeLadderValues[currentQuestionIndex - 1];
            setTimeout(gameWin, 2000);
        } else {
            currentScore = prizeLadderDisplay[currentQuestionIndex - 1];
            currentScoreValue = prizeLadderValues[currentQuestionIndex - 1];
            setTimeout(showQuestion, 2000);
        }
    } else {
        selectedOption.classList.add('wrong');
        wrongAudio.play();
        optionButtons.forEach(btn => { if (btn.dataset.answer === correctAnswer) btn.classList.add('correct'); });
        currentScoreValue = 0;
        if (currentQuestionIndex > 9) currentScoreValue = prizeLadderValues[9];
        else if (currentQuestionIndex > 4) currentScoreValue = prizeLadderValues[4];
        if (currentScoreValue === 0) currentScore = "Rp 0";
        else currentScore = prizeLadderDisplay[prizeLadderValues.indexOf(currentScoreValue)];
        setTimeout(gameOver, 2000);
    }
}
function cancelAnswer() {
    confirmModal.style.display = 'none';
    optionButtons.forEach(btn => btn.classList.remove('selected'));
    selectedOption = null;
    startTimer(parseInt(timerDisplay.textContent));
}
function gameOver() {
    bgAudio.pause();
    bgAudio.currentTime = 0;
    alert(`Permainan Selesai, ${playerName}!\nSkor Anda: ${currentScore}`);
    saveScore(playerName, currentScoreValue);
    gameScreen.classList.remove('active');
    startScreen.classList.add('active');
}
function gameWin() {
    bgAudio.pause();
    alert(`SELAMAT, ${playerName}!\nAnda telah memenangkan ${currentScore}!`);
    saveScore(playerName, currentScoreValue);
    gameScreen.classList.remove('active');
    startScreen.classList.add('active');
}
function startTimer(duration) {
    timer = duration;
    timerDisplay.textContent = timer;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            wrongAudio.play();
            currentScoreValue = 0;
            if (currentQuestionIndex > 9) currentScoreValue = prizeLadderValues[9];
            else if (currentQuestionIndex > 4) currentScoreValue = prizeLadderValues[4];
            currentScore = (currentScoreValue === 0) ? "Rp 0" : prizeLadderDisplay[prizeLadderValues.indexOf(currentScoreValue)];
            gameOver();
        }
    }, 1000);
}
function stopTimer() { clearInterval(timerInterval); }
function resetState() {
    optionButtons.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'wrong', 'disabled');
    });
    selectedOption = null;
    confirmModal.style.display = 'none';
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function buildPrizeLadder() {
    prizeLadderList.innerHTML = "";
    const safePoints = [4, 9, 14];
    prizeLadderDisplay.forEach((prize, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${prize}`;
        li.dataset.level = index;
        if (safePoints.includes(index)) li.classList.add('safe');
        prizeLadderList.appendChild(li);
    });
}
function updatePrizeLadder() {
    const allLevels = prizeLadderList.querySelectorAll('li');
    allLevels.forEach(li => {
        if (parseInt(li.dataset.level) === currentQuestionIndex) li.classList.add('current');
        else li.classList.remove('current');
    });
}
async function saveScore(name, scoreValue) {
    console.log(`Menyimpan skor ke Firebase: ${name} - ${scoreValue}`);
    try {
        const leaderboardCollection = customGameId ? `leaderboard_${customGameId}` : "leaderboard";
        await addDoc(collection(db, leaderboardCollection), {
            nama: name,
            skor: scoreValue,
            tanggal: serverTimestamp()
        });
        await showLeaderboard(leaderbandCollection);
    } catch (error) {
        console.error("Error Gagal menyimpan skor: ", error);
        alert("Gagal menyimpan skor Anda ke leaderboard.");
    }
}
async function showLeaderboard(leaderboardCollection) {
    console.log(`Mengambil leaderboard dari ${leaderboardCollection}...`);
    let leaderboardText = `--- TOP 10 LEADERBOARD (${customGameId ? 'Kuis Kustom' : 'Default'}) ---\n`;
    try {
        const q = query(collection(db, leaderboardCollection), orderBy("skor", "desc"), limit(10));
        const snapshot = await getDocs(q);
        let rank = 1;
        if (snapshot.empty) leaderboardText += "\n(Belum ada data skor)";
        snapshot.forEach((doc) => {
            const data = doc.data();
            let scoreString = new Intl.NumberFormat('id-ID', { 
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0 
            }).format(data.skor);
            leaderboardText += `${rank}. ${data.nama} - ${scoreString}\n`;
            rank++;
        });
        alert(leaderboardText);
    } catch (error) {
        console.error("Error mengambil leaderboard: ", error);
    }
}
