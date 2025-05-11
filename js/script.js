// script.js

// Fungsi untuk mengecek halaman saat ini
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('soal.html')) return 'soal';
    if (path.includes('skor.html')) return 'skor';
    if (path.includes('quiz-selection.html')) return 'quiz-selection';
    if (path.includes('materi/')) return 'materi';
    return 'unknown';
}

// Fungsi untuk mendapatkan nama file JSON yang sesuai
function getJsonFileName(subject) {
    const fileMap = {
        'agama': 'soal-agama.json',
        'matematika': 'soal-matematika.json',
        'ipa': 'soal-ipa.json',
        'b.indonesia': 'soal-indo.json',
        'b.inggris': 'soal-inggris.json',
        'ips': 'soal-ips.json'
    };
    return fileMap[subject] || null;
}

// Fungsi untuk memuat soal dari file JSON
async function loadQuestions(subject) {
    try {
        // Menggunakan path yang benar ke file JSON soal
        const fileName = getJsonFileName(subject);
        if (!fileName) {
            throw new Error(`Mata pelajaran tidak valid: ${subject}`);
        }

        // Menggunakan path absolut dari root website
        const response = await fetch(`/data/${fileName}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response bukan JSON yang valid');
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data soal tidak valid atau kosong');
        }

        console.log('Loaded questions:', data); // Debug log
        return data;
    } catch (error) {
        console.error('Error loading questions:', error);
        alert(`Gagal memuat soal: ${error.message}`);
        return null;
    }
}

// Fungsi untuk menampilkan soal
function displayQuestions(questions) {
    const questionContainer = document.getElementById('question-container');
    if (!questionContainer) {
        console.error('Question container not found!');
        return;
    }

    questionContainer.innerHTML = '';
    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <div class="question-header">
                <span class="question-number">Soal ${index + 1}</span>
            </div>
            <div class="question-text">${q.question}</div>
            <div class="answer-options">
                ${q.options.map((option, i) => `
                    <div class="answer-option">
                        <input type="radio" name="q${index}" value="${i}" id="q${index}o${i}">
                        <label for="q${index}o${i}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        questionContainer.appendChild(questionElement);
    });
}

// Fungsi untuk menghitung skor
function calculateScore(questions, answers) {
    let score = 0;
    questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
            score++;
        }
    });
    return score;
}

// Fungsi untuk menampilkan skor
function displayScore(score, total) {
    const scoreElement = document.getElementById('score');
    if (!scoreElement) return;

    scoreElement.textContent = `Skor Anda: ${score} dari ${total}`;
}

// Event listener untuk halaman soal
if (getCurrentPage() === 'soal') {
    window.onload = async () => {
        try {
            const subject = new URLSearchParams(window.location.search).get('subject');
            console.log('Current subject:', subject); // Debug log
            
            if (!subject) {
                throw new Error('Mata pelajaran tidak ditemukan!');
            }

            const questions = await loadQuestions(subject);
            if (!questions) {
                throw new Error('Gagal memuat soal!');
            }

            displayQuestions(questions);

            const submitButton = document.getElementById('submit');
            if (submitButton) {
                submitButton.addEventListener('click', () => {
                    const answers = [];
                    questions.forEach((_, index) => {
                        const selected = document.querySelector(`input[name="q${index}"]:checked`);
                        answers.push(selected ? parseInt(selected.value) : -1);
                    });

                    const score = calculateScore(questions, answers);
                    localStorage.setItem('quizScore', score);
                    localStorage.setItem('totalQuestions', questions.length);
                    window.location.href = `skor.html?subject=${subject}`;
                });
            }
        } catch (error) {
            console.error('Error in soal page:', error);
            alert(error.message);
        }
    };
}

// Event listener untuk halaman skor
if (getCurrentPage() === 'skor') {
    window.onload = () => {
        const score = localStorage.getItem('quizScore');
        const total = localStorage.getItem('totalQuestions');
        if (score !== null && total !== null) {
            displayScore(parseInt(score), parseInt(total));
        } else {
            alert('No score found!');
        }
    };
}

// Event listener untuk halaman quiz selection
if (getCurrentPage() === 'quiz-selection') {
    const quizButtons = document.querySelectorAll('.quiz-option');
    quizButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subject = button.getAttribute('data-subject');
            window.location.href = `materi/${subject}/index.html`;
        });
    });
}

// Event listener untuk halaman materi
if (getCurrentPage() === 'materi') {
    const startQuizButtons = document.querySelectorAll('.start-quiz');
    startQuizButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subject = button.getAttribute('data-subject');
            window.location.href = `soal.html?subject=${subject}`;
        });
    });
}
