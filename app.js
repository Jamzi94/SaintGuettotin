// ==================== DATA ====================
let appData = {
    title: "Eh oh, c'est pour toi...",
    subtitle: "Oui toi, regarde en bas",
    fromName: "Ton J (le beau gosse)",
    toName: "RoroLasticot",
    passingScore: 4,
    photos: [],
    questions: [],
    programs: [],
    celebrationGifs: [],
    music: { enabled: false, url: "" }
};

// ==================== STATE ====================
let currentStep = 'photos';
let quizIndex = 0;
let score = 0;
let answeredQuestions = [];
let selectedProgram = null;
let isEditMode = false;
let currentEditingPhoto = null;
let currentEditingQuestion = null;
let currentEditingProgram = null;
let noAttempts = 0;
let selectedAnswerIndex = null;
let attempts = 0;

// Drag state
let draggedPhoto = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let photoStartX = 0;
let photoStartY = 0;

// ==================== CONSTANTS ====================
const EXPORT_REMINDER_MESSAGE = '⚠️ N\'oubliez pas d\'exporter le data.json pour sauvegarder de façon permanente.';

const funnyMessages = [
    "T'ES NULLE A L'HUILE 😂",
    "Tu fais exprès ou quoi ?!",
    "Même ma daronne ferait mieux",
    "PTDR T'AS RATÉ",
    "Réessaye, tu peux faire pire... ou pas",
    "C'est une blague là ?",
    "Le bouton Non est en vacances",
    "T'es sûre que c'est toi RoroLasticot ?"
];

const failMessages = [
    "Eh oh, t'ES qui toi en fait ? 🤨",
    "Imposteur(euse) ! T'ES PAS RoroLasticot !",
    "T'as tout raté, c'est même plus drôle",
    "Mon pet de goldfish a un meilleur score",
    "Réessaye ou je t'envoie une facture",
    "C'était pourtant pas compliqué hein...",
    "La honte éternelle t'attend",
    "Bon, on recommence et cette fois tu te concentres"
];

const successMessages = [
    "Bah enfin, c'est bien toi ! 💪",
    "Ok t'ES officiellement RoroLasticot",
    "Bien joué, t'as pas triché j'espère",
    "Trop fort(e), respect",
    "GG WP, tu peux passer",
    "C'était easy en vrai"
];

const effects = [
    { id: 'none', name: 'Aucun' },
    { id: 'pulse', name: 'Cœur qui bat' },
    { id: 'float', name: 'Lévitation' },
    { id: 'shine', name: 'Brillance' },
    { id: 'glow', name: 'Halo lumineux' },
    { id: 'shake', name: 'Tremblement' },
    { id: 'spin', name: 'Rotation' },
    { id: 'blur', name: 'Flou' },
    { id: 'sepia', name: 'Sépia' },
    { id: 'bw', name: 'Noir & Blanc' },
    { id: 'rainbow', name: 'Arc-en-ciel' },
    { id: 'zoom', name: 'Zoom' }
];

const stickers = [
    { id: 'none', name: 'Aucun', emoji: '' },
    { id: 'heart-red', name: 'Cœur Rouge', emoji: '❤️' },
    { id: 'heart-pink', name: 'Cœurs Roses', emoji: '💕' },
    { id: 'star', name: 'Étoile', emoji: '⭐' },
    { id: 'flower', name: 'Fleur', emoji: '🌸' },
    { id: 'fire', name: 'Feu', emoji: '🔥' },
    { id: 'sparkles', name: 'Étincelles', emoji: '✨' },
    { id: 'kiss', name: 'Bisou', emoji: '💋' },
    { id: 'cat-heart', name: 'Chat Cœur', emoji: '😻' },
    { id: 'rocket', name: 'Fusée', emoji: '🚀' },
    { id: 'crown', name: 'Couronne', emoji: '👑' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'sun', name: 'Soleil', emoji: '☀️' },
    { id: 'moon', name: 'Lune', emoji: '🌙' },
    { id: 'gift', name: 'Cadeau', emoji: '🎁' },
    { id: 'champagne', name: 'Fête', emoji: '🍾' }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeApp();
    setupGlobalDragHandlers();
});

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            const fileData = await response.json();
            appData = { ...appData, ...fileData };
            console.log('Data loaded from data.json file');
        }
    } catch (e) {
        console.log('Error loading data.json:', e);
    }
    
    const saved = localStorage.getItem('valentineData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appData = { ...appData, ...parsed };
            console.log('Data loaded from localStorage');
        } catch (e) {
            console.error('Error loading data from localStorage:', e);
        }
    }
}

function saveData() {
    localStorage.setItem('valentineData', JSON.stringify(appData));
}

function initializeApp() {
    answeredQuestions = new Array(appData.questions.length).fill(null);
    renderPhotos();
    renderPrograms();
    renderGifs();
    updateNames();
    setupNoButton();
    renderSpotify();
    showSection('photos');
}

// ==================== NAVIGATION ====================
function showSection(step) {
    const sections = ['photos', 'quiz', 'quiz-result', 'proposal', 'celebration', 'programs', 'final'];
    sections.forEach(s => {
        const el = document.getElementById(`${s}-section`);
        if (el) {
            el.classList.toggle('hidden', s !== step);
        }
    });
    
    currentStep = step;
    updateStepIndicator();
    
    if (step === 'quiz') {
        renderQuestion();
    }
    
    if (step === 'quiz-result') {
        renderQuizResult();
    }
}

function goToStep(step) {
    showSection(step);
}

function updateStepIndicator() {
    const indicator = document.getElementById('step-indicator');
    if (!indicator) return;
    
    const messages = {
        'photos': '',
        'quiz': `Question ${quizIndex + 1}/${appData.questions.length}`,
        'quiz-result': 'Résultat...',
        'proposal': 'La grande question...',
        'celebration': '🎉',
        'programs': 'Choisis ton programme',
        'final': 'Parfait !'
    };
    indicator.textContent = messages[currentStep] || '';
}

// ==================== PHOTOS ====================
function renderPhotos() {
    const container = document.getElementById('photos-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Si aucune photo n'est présente, on en ajoute quelques-unes par défaut pour ne pas avoir une page vide
    if (appData.photos.length === 0) {
        appData.photos = [
            { id: 1, url: "https://picsum.photos/seed/love1/300/400", x: 5, y: 100, rotation: -5, effect: "none", sticker: "none" },
            { id: 2, url: "https://picsum.photos/seed/love2/300/300", x: 35, y: 50, rotation: 3, effect: "none", sticker: "heart-pink" },
            { id: 3, url: "https://picsum.photos/seed/love3/300/400", x: 65, y: 150, rotation: -2, effect: "pulse", sticker: "none" }
        ];
    }

    appData.photos.forEach(photo => {
        const card = document.createElement('div');
        card.className = `photo-card ${photo.effect !== 'none' ? 'effect-' + photo.effect : ''}`;
        card.style.left = `${photo.x}%`;
        card.style.top = `${photo.y}px`;
        card.style.transform = `rotate(${photo.rotation}deg)`;
        card.dataset.photoId = photo.id;
        
        const sticker = stickers.find(s => s.id === photo.sticker);
        
        card.innerHTML = `
            <img src="${photo.url}" alt="Souvenir" onerror="this.src='https://via.placeholder.com/200x240?text=Photo'" draggable="false">
            ${sticker && sticker.emoji ? `<span class="photo-sticker">${sticker.emoji}</span>` : ''}
            ${isEditMode ? `<span class="photo-delete" data-photo-id="${photo.id}">×</span>` : ''}
        `;
        
        card.addEventListener('dblclick', (e) => {
            if (!isEditMode) return;
            e.preventDefault();
            e.stopPropagation();
            openPhotoModal(photo.id);
        });
        
        if (isEditMode) {
            card.style.cursor = 'move';
            card.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('photo-delete')) return;
                e.preventDefault();
                startDrag(photo, e.clientX, e.clientY);
            });
        }
        
        container.appendChild(card);
    });
    
    if (isEditMode) {
        document.querySelectorAll('.photo-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.photoId);
                deletePhoto(id);
            });
        });
    }
}

// ==================== QUIZ ====================
function renderQuestion() {
    const container = document.getElementById('question-card');
    if (!container) return;
    
    const question = appData.questions[quizIndex];
    if (!question) return;
    
    const scoreEl = document.getElementById('score');
    const totalEl = document.getElementById('total-questions');
    if (scoreEl) scoreEl.textContent = quizIndex + 1;
    if (totalEl) totalEl.textContent = appData.questions.length;
    
    const answered = answeredQuestions[quizIndex];
    
    const answersHtml = question.answers.map((answer, index) => {
        let classes = 'answer-btn';
        if (answered !== null) {
            if (index === question.correctAnswer) {
                classes += ' correct';
            } else if (index === selectedAnswerIndex && !answered) {
                classes += ' incorrect';
            }
        }
        return `<button class="${classes}" data-answer="${index}" ${answered !== null ? 'disabled' : ''}>${answer}</button>`;
    }).join('');
    
    let feedback = '';
    if (answered !== null) {
        const isCorrect = answered;
        const feedbackText = isCorrect ? '✅ Bonne réponse, t\'ES pas si nul(le)' : '❌ Raté... la honte';
        const feedbackImg = isCorrect ? (question.correctImage || '') : (question.incorrectImage || '');
        
        feedback = `
            <div class="answer-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <p>${feedbackText}</p>
                ${feedbackImg ? `<img src="${feedbackImg}" class="feedback-media" alt="Feedback">` : ''}
            </div>
        `;
        
        // Play sound if available
        const soundUrl = isCorrect ? question.correctSound : question.incorrectSound;
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    container.innerHTML = `
        <h3>${question.question}</h3>
        <div class="answers-container">${answersHtml}</div>
        ${feedback}
    `;
    
    if (answered === null) {
        container.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.answer);
                selectAnswer(index);
            });
        });
    }
    
    // Add dblclick to the container itself for editing
    container.addEventListener('dblclick', (e) => {
        if (isEditMode) {
            e.preventDefault();
            e.stopPropagation();
            openQuestionModal(question.id);
        }
    });
}

function selectAnswer(index) {
    if (answeredQuestions[quizIndex] !== null) return;
    selectedAnswerIndex = index;
    
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
    
    setTimeout(() => validateAnswer(index), 500);
}

function validateAnswer(selectedIndex) {
    const question = appData.questions[quizIndex];
    if (!question) return;
    
    const isCorrect = selectedIndex === question.correctAnswer;
    if (isCorrect) score++;
    answeredQuestions[quizIndex] = isCorrect;
    
    renderQuestion();
    
    setTimeout(() => {
        if (quizIndex < appData.questions.length - 1) {
            quizIndex++;
            selectedAnswerIndex = null;
            renderQuestion();
        } else {
            goToStep('quiz-result');
        }
    }, 2500); // Increased time to see feedback
}

// ==================== QUIZ RESULT ====================
function renderQuizResult() {
    const container = document.getElementById('quiz-result-content');
    if (!container) return;
    
    const passingScore = appData.passingScore || 4;
    const totalQuestions = appData.questions.length;
    const hasPassed = score >= passingScore;
    attempts++;
    
    let message, subMessage, buttonHtml;
    
    if (hasPassed) {
        message = successMessages[Math.floor(Math.random() * successMessages.length)];
        subMessage = `T'as eu ${score}/${totalQuestions}, c'est valide`;
        buttonHtml = `<button class="btn btn-primary btn-success" onclick="goToStep('proposal')">Passer à la suite (t'AS mérité) ➡️</button>`;
    } else {
        message = failMessages[Math.min(attempts - 1, failMessages.length - 1)];
        subMessage = `Score: ${score}/${totalQuestions} - Faut ${passingScore} minimum, déso`;
        buttonHtml = `<button class="btn btn-primary btn-retry" onclick="retryQuiz()">🔄 Réessayer (allez, t'ES cap)</button>`;
    }
    
    container.innerHTML = `
        <div class="result-icon ${hasPassed ? 'success' : 'fail'}">${hasPassed ? '🏆' : '💀'}</div>
        <h2 class="result-title">${message}</h2>
        <p class="result-subtitle">${subMessage}</p>
        ${buttonHtml}
    `;
}

function retryQuiz() {
    quizIndex = 0;
    score = 0;
    selectedAnswerIndex = null;
    answeredQuestions = new Array(appData.questions.length).fill(null);
    goToStep('quiz');
}

// ==================== EDIT MODALS ====================
function openQuestionModal(questionId) {
    if (!isEditMode) return;
    currentEditingQuestion = appData.questions.find(q => q.id === questionId);
    if (!currentEditingQuestion) return;
    
    document.getElementById('question-text').value = currentEditingQuestion.question;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = currentEditingQuestion.answers.map((answer, i) => `
        <div class="edit-answer-row">
            <input type="text" value="${answer}" placeholder="Réponse ${i + 1}" id="answer-${i}">
        </div>
    `).join('');
    
    const correctSelect = document.getElementById('correct-answer-select');
    correctSelect.innerHTML = currentEditingQuestion.answers.map((_, i) => `
        <option value="${i}" ${currentEditingQuestion.correctAnswer === i ? 'selected' : ''}>Réponse ${i + 1} est la bonne</option>
    `).join('');
    
    // Feedback inputs
    const feedbackHtml = `
        <div class="modal-section">
            <p>Feedback Bonne Réponse:</p>
            <input type="text" id="correct-image" placeholder="URL Image/GIF" value="${currentEditingQuestion.correctImage || ''}">
            <input type="text" id="correct-sound" placeholder="URL Son" value="${currentEditingQuestion.correctSound || ''}">
        </div>
        <div class="modal-section">
            <p>Feedback Mauvaise Réponse:</p>
            <input type="text" id="incorrect-image" placeholder="URL Image/GIF" value="${currentEditingQuestion.incorrectImage || ''}">
            <input type="text" id="incorrect-sound" placeholder="URL Son" value="${currentEditingQuestion.incorrectSound || ''}">
        </div>
    `;
    
    // Append feedback inputs if not already there
    let existingFeedback = document.getElementById('feedback-edit-section');
    if (!existingFeedback) {
        existingFeedback = document.createElement('div');
        existingFeedback.id = 'feedback-edit-section';
        answersContainer.after(existingFeedback);
    }
    existingFeedback.innerHTML = feedbackHtml;
    
    document.getElementById('question-modal').classList.remove('hidden');
}

function saveQuestionChanges() {
    if (!currentEditingQuestion) return;
    
    currentEditingQuestion.question = document.getElementById('question-text').value;
    currentEditingQuestion.answers = currentEditingQuestion.answers.map((_, i) => document.getElementById(`answer-${i}`).value);
    currentEditingQuestion.correctAnswer = parseInt(document.getElementById('correct-answer-select').value);
    
    currentEditingQuestion.correctImage = document.getElementById('correct-image').value;
    currentEditingQuestion.correctSound = document.getElementById('correct-sound').value;
    currentEditingQuestion.incorrectImage = document.getElementById('incorrect-image').value;
    currentEditingQuestion.incorrectSound = document.getElementById('incorrect-sound').value;
    
    saveData();
    closeQuestionModal();
    if (currentStep === 'quiz') renderQuestion();
}

function closeQuestionModal() {
    document.getElementById('question-modal').classList.add('hidden');
    currentEditingQuestion = null;
}

// ==================== UTILS & OTHER RENDERERS ====================
function updateNames() {
    const elements = {
        'header-to-name': appData.toName,
        'proposal-to-name': appData.toName,
        'final-to-name': appData.toName,
        'proposal-from-name': appData.fromName,
        'final-from-name': appData.fromName
    };
    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.textContent = elements[id];
    }
}

function setupNoButton() {
    const btnNo = document.getElementById('btn-no');
    if (!btnNo) return;
    btnNo.style.position = 'absolute';
    btnNo.addEventListener('mouseenter', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); }, { passive: false });
}

function moveNoButton() {
    const container = document.getElementById('buttons-container');
    const btnNo = document.getElementById('btn-no');
    if (!container || !btnNo) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const maxX = Math.max(0, containerRect.width - btnRect.width - 20);
    const maxY = Math.max(0, containerRect.height - btnRect.height - 20);
    btnNo.style.left = `${Math.random() * maxX}px`;
    btnNo.style.top = `${Math.random() * maxY}px`;
    noAttempts++;
    const message = document.getElementById('funny-message');
    if (message) {
        message.textContent = funnyMessages[Math.min(noAttempts - 1, funnyMessages.length - 1)];
        message.classList.remove('hidden');
    }
}

function handleYes() {
    goToStep('celebration');
    createConfetti();
}

function renderGifs() {
    const container = document.getElementById('gifs-container');
    if (!container) return;
    container.innerHTML = appData.celebrationGifs.map((gif, i) => {
        return `<img src="${gif}" alt="Celebration ${i + 1}" onerror="this.src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJmZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKDkDbIDJieKbVm/giphy.gif'">`;
    }).join('');
}

function renderSpotify() {
    const container = document.getElementById('spotify-container');
    if (!container) return;
    
    if (appData.music && appData.music.enabled && appData.music.url) {
        let embedUrl = appData.music.url;
        // Convertir l'URL standard en URL d'intégration si nécessaire
        if (embedUrl.includes('spotify.com') && !embedUrl.includes('/embed')) {
            // Remove intl-{country}/ part if present (e.g., intl-fr/, intl-de/, intl-en-gb/)
            embedUrl = embedUrl.replace(/\/intl-[a-z]{2}(-[a-z]{2})?\//i, '/');
            // Add /embed/ after spotify.com/
            embedUrl = embedUrl.replace('spotify.com/', 'spotify.com/embed/');
        }
        
        container.innerHTML = `
            <iframe style="border-radius:12px" src="${embedUrl}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        `;
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

function createConfetti() {
    const colors = ['#FF6B9D', '#87CEEB', '#FFD700', '#FF69B4', '#FFB6C1', '#E6E6FA'];
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

function renderPrograms() {
    const container = document.getElementById('programs-grid');
    if (!container) return;
    container.innerHTML = '';
    
    appData.programs.forEach(program => {
        const card = document.createElement('div');
        card.className = `program-card ${selectedProgram && selectedProgram.id === program.id ? 'selected' : ''}`;
        
        card.innerHTML = `
            ${isEditMode ? `<span class="program-delete" data-program-id="${program.id}">×</span>` : ''}
            <div class="program-emoji">${program.emoji}</div>
            <h3>${program.title}</h3>
            <p>${program.description}</p>
            <ul class="program-activities">${program.activities.map(a => `<li>✨ ${a}</li>`).join('')}</ul>
            ${selectedProgram && selectedProgram.id === program.id ? '<div class="program-selected-badge">❤️</div>' : ''}
        `;
        
        card.addEventListener('click', () => {
            if (!isEditMode) selectProgram(program.id);
        });
        
        card.addEventListener('dblclick', (e) => {
            if (isEditMode) {
                e.preventDefault();
                e.stopPropagation();
                openProgramModal(program.id);
            }
        });
        
        container.appendChild(card);
    });
    
    if (isEditMode) {
        document.querySelectorAll('.program-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.programId);
                deleteProgram(id);
            });
        });
    }
}

function selectProgram(id) {
    selectedProgram = appData.programs.find(p => p.id === id);
    renderPrograms();
    setTimeout(() => {
        const finalProgram = document.getElementById('selected-program');
        if (finalProgram) finalProgram.textContent = selectedProgram.title;
        goToStep('final');
    }, 600);
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    document.getElementById('edit-panel').classList.toggle('hidden', !isEditMode);
    document.getElementById('edit-indicator').classList.toggle('hidden', !isEditMode);
    
    if (isEditMode) {
        // Load Spotify settings
        document.getElementById('spotify-url-input').value = appData.music.url || '';
        document.getElementById('spotify-enabled-input').checked = appData.music.enabled || false;
        
        // Load general settings
        document.getElementById('edit-title').value = appData.title || '';
        document.getElementById('edit-subtitle').value = appData.subtitle || '';
        document.getElementById('edit-to-name').value = appData.toName || '';
        document.getElementById('edit-from-name').value = appData.fromName || '';
        document.getElementById('edit-passing-score').value = appData.passingScore || 4;
    }
    
    renderPhotos();
    renderPrograms();
    renderQuestion();
}

function updateGeneralSettings() {
    appData.title = document.getElementById('edit-title').value;
    appData.subtitle = document.getElementById('edit-subtitle').value;
    appData.toName = document.getElementById('edit-to-name').value;
    appData.fromName = document.getElementById('edit-from-name').value;
    appData.passingScore = parseInt(document.getElementById('edit-passing-score').value) || 4;
    
    saveData();
    updateNames();
    
    // Update page title
    document.title = `💕 ${appData.title} - ${appData.toName}`;
    
    alert(`✅ Paramètres généraux mis à jour!\n\n${EXPORT_REMINDER_MESSAGE}`);
}

function updateSpotify() {
    const url = document.getElementById('spotify-url-input').value;
    const enabled = document.getElementById('spotify-enabled-input').checked;
    
    appData.music = {
        enabled: enabled,
        url: url
    };
    
    saveData();
    renderSpotify();
}

// Drag & Drop logic (simplified)
function startDrag(photo, x, y) {
    draggedPhoto = photo;
    isDragging = true;
    dragStartX = x;
    dragStartY = y;
    const el = document.querySelector(`[data-photo-id="${photo.id}"]`);
    photoStartX = parseFloat(el.style.left);
    photoStartY = parseFloat(el.style.top);
}

function setupGlobalDragHandlers() {
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !draggedPhoto) return;
        const dx = ((e.clientX - dragStartX) / window.innerWidth) * 100;
        const dy = e.clientY - dragStartY;
        const el = document.querySelector(`[data-photo-id="${draggedPhoto.id}"]`);
        el.style.left = `${photoStartX + dx}%`;
        el.style.top = `${photoStartY + dy}px`;
    });
    document.addEventListener('mouseup', () => {
        if (isDragging && draggedPhoto) {
            const el = document.querySelector(`[data-photo-id="${draggedPhoto.id}"]`);
            draggedPhoto.x = parseFloat(el.style.left);
            draggedPhoto.y = parseFloat(el.style.top);
            saveData();
        }
        isDragging = false;
        draggedPhoto = null;
    });
}

// Placeholder functions for other edit actions
function addPhoto() {
    const url = document.getElementById('photo-url-input').value || 'https://picsum.photos/300/400';
    const newPhoto = { id: Date.now(), url, x: 10, y: 100, rotation: 0, effect: 'none', sticker: 'none' };
    appData.photos.push(newPhoto);
    saveData();
    renderPhotos();
}

function deletePhoto(id) {
    appData.photos = appData.photos.filter(p => p.id !== id);
    saveData();
    renderPhotos();
}

function addQuestion() {
    const newQ = { id: Date.now(), question: "Nouvelle question ?", answers: ["A", "B", "C", "D"], correctAnswer: 0 };
    appData.questions.push(newQ);
    answeredQuestions.push(null);
    saveData();
    renderQuestion();
}

function deleteProgram(id) {
    appData.programs = appData.programs.filter(p => p.id !== id);
    saveData();
    renderPrograms();
}

function addGif() {
    const url = document.getElementById('gif-url-input').value;
    if (url) { appData.celebrationGifs.push(url); saveData(); renderGifs(); }
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    // Show instructions
    setTimeout(() => {
        alert(`✅ Fichier data.json téléchargé!\n\n📝 IMPORTANT - Pour sauvegarder vos modifications:\n\n1. Remplacez le fichier data.json dans votre dépôt GitHub\n2. Committez et poussez les changements\n3. Les modifications seront visibles sur votre site après le déploiement\n\nℹ️ Note: Les modifications dans la page web sont temporaires (localStorage). Utilisez toujours "Exporter" puis committez le fichier pour les rendre permanentes.`);
    }, 100);
}

function deleteCurrentQuestion() {
    if (!currentEditingQuestion) return;
    if (confirm('Supprimer cette question ?')) {
        appData.questions = appData.questions.filter(q => q.id !== currentEditingQuestion.id);
        answeredQuestions = new Array(appData.questions.length).fill(null);
        saveData();
        closeQuestionModal();
        if (currentStep === 'quiz') renderQuestion();
    }
}

// Photo Modal Functions
function openPhotoModal(id) {
    currentEditingPhoto = appData.photos.find(p => p.id === id);
    if (!currentEditingPhoto) return;
    document.getElementById('photo-url-edit').value = currentEditingPhoto.url;
    const effectsGrid = document.getElementById('effects-grid');
    effectsGrid.innerHTML = effects.map(e => `<button class="${currentEditingPhoto.effect === e.id ? 'active' : ''}" onclick="setPhotoEffect('${e.id}')">${e.name}</button>`).join('');
    const stickersGrid = document.getElementById('stickers-grid');
    stickersGrid.innerHTML = stickers.map(s => `<button class="${currentEditingPhoto.sticker === s.id ? 'active' : ''}" onclick="setPhotoSticker('${s.id}')">${s.emoji || 'Aucun'}</button>`).join('');
    document.getElementById('photo-modal').classList.remove('hidden');
}

function setPhotoEffect(effectId) {
    if (currentEditingPhoto) { currentEditingPhoto.effect = effectId; openPhotoModal(currentEditingPhoto.id); }
}

function setPhotoSticker(stickerId) {
    if (currentEditingPhoto) { currentEditingPhoto.sticker = stickerId; openPhotoModal(currentEditingPhoto.id); }
}

function savePhotoChanges() {
    if (currentEditingPhoto) { currentEditingPhoto.url = document.getElementById('photo-url-edit').value; saveData(); renderPhotos(); closePhotoModal(); }
}

function closePhotoModal() {
    document.getElementById('photo-modal').classList.add('hidden');
    currentEditingPhoto = null;
}

function deleteCurrentPhoto() {
    if (currentEditingPhoto) { deletePhoto(currentEditingPhoto.id); closePhotoModal(); }
}

// Program Modal Functions
function openProgramModal(id) {
    currentEditingProgram = appData.programs.find(p => p.id === id);
    if (!currentEditingProgram) return;
    document.getElementById('program-title').value = currentEditingProgram.title;
    document.getElementById('program-description').value = currentEditingProgram.description;
    document.getElementById('program-emoji').value = currentEditingProgram.emoji;
    document.getElementById('program-activities').value = currentEditingProgram.activities.join('\n');
    document.getElementById('program-modal').classList.remove('hidden');
}

function saveProgramChanges() {
    if (currentEditingProgram) {
        currentEditingProgram.title = document.getElementById('program-title').value;
        currentEditingProgram.description = document.getElementById('program-description').value;
        currentEditingProgram.emoji = document.getElementById('program-emoji').value;
        currentEditingProgram.activities = document.getElementById('program-activities').value.split('\n').filter(a => a.trim() !== '');
        saveData();
        renderPrograms();
        closeProgramModal();
    }
}

function closeProgramModal() {
    document.getElementById('program-modal').classList.add('hidden');
    currentEditingProgram = null;
}

function deleteCurrentProgram() {
    if (currentEditingProgram) { deleteProgram(currentEditingProgram.id); closeProgramModal(); }
}

function addProgram() {
    const newP = { id: Date.now(), title: "Nouveau Programme", description: "Description ici", emoji: "💝", activities: ["Activité 1"] };
    appData.programs.push(newP);
    saveData();
    renderPrograms();
}

// ==================== UNIVERSAL TEXT EDITING (TRIPLE CLICK) ====================
document.addEventListener('click', (e) => {
    if (!isEditMode) return;
    
    // Check for triple click
    if (e.detail === 3) {
        const target = e.target;
        
        // Don't trigger on inputs, buttons (that have specific logic), or containers
        if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) return;
        
        // Only edit elements with direct text content or specific classes
        const originalText = target.innerText.trim();
        if (!originalText) return;

        const newText = prompt("✏️ Modifier le texte :", originalText);
        
        if (newText !== null && newText !== originalText) {
            target.innerText = newText;
            
            // Try to sync with appData if it's a known field
            syncTextWithData(target, newText);
            saveData();
            
            alert(`✅ Texte modifié!\n\n${EXPORT_REMINDER_MESSAGE}`);
        }
    }
});

function syncTextWithData(el, text) {
    const id = el.id;
    if (id === 'header-to-name' || id === 'proposal-to-name' || id === 'final-to-name') {
        appData.toName = text;
        updateNames();
    } else if (id === 'proposal-from-name' || id === 'final-from-name') {
        appData.fromName = text;
        updateNames();
    }
    // Note: Section titles and other texts are modified visually but not saved to appData
    // Use the "Paramètres Généraux" section in edit mode for persistent changes
}
