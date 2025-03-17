let startTime, timerInterval;
let currentWord = '';
let correctCount = 0;
let totalCount = 0;
let timePerRound = [];
let wpmPerRound = [];

const wordDisplay = document.getElementById('word-display');
const inputField = document.getElementById('input-field');
const timer = document.getElementById('timer');
const wpm = document.getElementById('wpm');
const accuracy = document.getElementById('accuracy');
const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const roundsInput = document.getElementById('rounds');
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const remainingRounds = document.getElementById('remaining');
const totalRoundsDisplay = document.getElementById('total-rounds');
const avgWPM = document.getElementById('avg-wpm');
const avgAccuracy = document.getElementById('avg-accuracy');
const totalTime = document.getElementById('total-time');
const restartBtn = document.getElementById('restart-btn');

function initGame() {
    totalRounds = parseInt(roundsInput.value);
    if (totalRounds < 10 || totalRounds > 20) {
        alert('請輸入10到20之間的數字');
        return;
    }
    
    roundsCompleted = 0;
    totalAccuracy = 0;
    totalWPM = 0;
    showScreen('game-screen');
    remainingRounds.textContent = totalRounds;
    inputField.disabled = false;
    inputField.focus(); // 新增自動聚焦
    startNewRound();
}

function updateStats() {
    const currentTime = Math.floor((new Date() - startTime) / 1000);
    timer.textContent = currentTime;
    
    const minutes = currentTime / 60;
    const wordsPerMinute = Math.floor((correctCount / 5) / minutes) || 0;
    const accuracyRate = totalCount > 0 
        ? Math.floor((correctCount / (correctCount + (currentWord.length - inputField.value.length))) * 100)
        : 100;
        
    wpm.textContent = wordsPerMinute;
    accuracy.textContent = accuracyRate;
}

function checkInput() {
    const input = inputField.value.trim();
    wordDisplay.innerHTML = currentWord.split('').map((char, i) => {
        return `<span class="${input[i] ? (char === input[i] ? 'correct' : 'incorrect') : ''}">${char}</span>`;
    }).join('');

    if (input === currentWord) {
        const endTime = new Date();
        const roundTime = (endTime - startTime) / 1000;
        const currentWPM = Math.floor((input.length / 5) / (roundTime / 60));
        
        timePerRound.push(roundTime);
        wpmPerRound.push(currentWPM);
        
        totalCount++;
        correctCount += input.length;
        roundsCompleted++;
        updateStats();
        
        if (roundsCompleted >= totalRounds) {
            showFinalResults();
        } else {
            remainingRounds.textContent = totalRounds - roundsCompleted;
            startNewRound();
        }
    }
}

inputField.addEventListener('input', checkInput);
resetBtn.addEventListener('click', initGame);

function showScreen(screenId) {
    setupScreen.style.display = screenId === 'setup-screen' ? 'block' : 'none';
    gameScreen.style.display = screenId === 'game-screen' ? 'block' : 'none';
    resultScreen.style.display = screenId === 'result-screen' ? 'block' : 'none';
}

function getRandomWord() {
    return wordBank[Math.floor(Math.random() * wordBank.length)];
}

function showFinalResults() {
    const totalTimeSeconds = Math.floor((new Date() - startTime) / 1000);
    const averageWPM = Math.round(wpmPerRound.reduce((a,b) => a + b, 0) / wpmPerRound.length);
    const averageTime = Math.round(timePerRound.reduce((a,b) => a + b, 0) / timePerRound.length);
    const averageAccuracy = Math.round(totalAccuracy / totalRounds);
    
    totalRoundsDisplay.textContent = totalRounds;
    avgWPM.textContent = `${averageWPM} (${wpmPerRound.join(', ')})`;
    avgAccuracy.textContent = averageAccuracy;
    totalTime.textContent = `${totalTimeSeconds} (${timePerRound.map(t => t.toFixed(1)).join(', ')})`;
    
    showScreen('result-screen');
}

function startNewRound() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
    inputField.value = '';
    inputField.disabled = false;
    startTime = new Date();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateStats, 100);
    inputField.focus();
}

// 初始化事件监听
startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', () => showScreen('setup-screen'));
inputField.addEventListener('input', checkInput);

// 显示初始设置界面
showScreen('setup-screen');