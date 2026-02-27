// Question Database
const questions = {
    geography: [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correct: 2
        },
        {
            question: "What is the capital of Japan?",
            options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"],
            correct: 2
        },
        {
            question: "What is the capital of Australia?",
            options: ["Sydney", "Melbourne", "Canberra", "Perth"],
            correct: 2
        },
        {
            question: "What is the longest river in the world?",
            options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
            correct: 1
        },
        {
            question: "Which country has the most natural lakes?",
            options: ["USA", "Russia", "Canada", "Brazil"],
            correct: 2
        },
        {
            question: "What is the smallest country in the world?",
            options: ["Monaco", "Vatican City", "San Marino", "Malta"],
            correct: 1
        },
        {
            question: "Which desert is the largest in the world?",
            options: ["Sahara", "Arabian", "Gobi", "Antarctic"],
            correct: 3
        }
    ],
    
    science: [
        {
            question: "What is the hardest part of the human body?",
            options: ["Bones", "Tooth enamel", "Nails", "Hair"],
            correct: 1
        },
        {
            question: "How many bones are in the adult human body?",
            options: ["206", "212", "198", "215"],
            correct: 0
        },
        {
            question: "What is the most abundant gas in Earth's atmosphere?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            correct: 2
        },
        {
            question: "Which planet has the most moons?",
            options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
            correct: 1
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2
        },
        {
            question: "What is the smallest prime number?",
            options: ["0", "1", "2", "3"],
            correct: 2
        }
    ],
    
    history: [
        {
            question: "In which year did World War II end?",
            options: ["1944", "1945", "1946", "1947"],
            correct: 1
        },
        {
            question: "Who was the first US President?",
            options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
            correct: 2
        },
        {
            question: "Who discovered penicillin?",
            options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Isaac Newton"],
            correct: 1
        },
        {
            question: "Which year did the Berlin Wall fall?",
            options: ["1987", "1989", "1991", "1985"],
            correct: 1
        },
        {
            question: "Who was the first man on the moon?",
            options: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"],
            correct: 1
        }
    ],
    
    entertainment: [
        {
            question: "Who played Iron Man in the Marvel movies?",
            options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
            correct: 2
        },
        {
            question: "Which band performed 'Bohemian Rhapsody'?",
            options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"],
            correct: 2
        },
        {
            question: "Who played Jack in 'Titanic'?",
            options: ["Brad Pitt", "Leonardo DiCaprio", "Johnny Depp", "Tom Cruise"],
            correct: 1
        },
        {
            question: "Which animated film features 'Let It Go'?",
            options: ["Moana", "Tangled", "Frozen", "Brave"],
            correct: 2
        }
    ],
    
    sports: [
        {
            question: "How many players are on a soccer team?",
            options: ["9", "10", "11", "12"],
            correct: 2
        },
        {
            question: "Which country has won the most World Cups?",
            options: ["Germany", "Brazil", "Italy", "Argentina"],
            correct: 1
        },
        {
            question: "How many rings are on the Olympic flag?",
            options: ["3", "4", "5", "6"],
            correct: 2
        },
        {
            question: "In which sport do you do a 'slam dunk'?",
            options: ["Volleyball", "Tennis", "Basketball", "Football"],
            correct: 2
        }
    ]
};

// Game variables
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let timer;
let timeLeft = 30;
let quizActive = false;

// DOM Elements
const setupScreen = document.getElementById('setupScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

// Start Quiz
startBtn.addEventListener('click', () => {
    const category = document.getElementById('category').value;
    const count = parseInt(document.getElementById('questionCount').value);
    
    // Get questions
    if (category === 'mixed') {
        // Mix all categories
        currentQuestions = [];
        for (let cat in questions) {
            currentQuestions = currentQuestions.concat(questions[cat]);
        }
    } else {
        currentQuestions = [...questions[category]];
    }
    
    // Shuffle and limit
    currentQuestions = shuffleArray(currentQuestions).slice(0, count);
    
    // Reset game state
    currentIndex = 0;
    score = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);
    
    // Show quiz screen
    setupScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
    
    // Load first question
    loadQuestion();
});

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Load question
function loadQuestion() {
    if (currentIndex >= currentQuestions.length) {
        showResults();
        return;
    }
    
    const question = currentQuestions[currentIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionCountDisplay').textContent = 
        `${currentIndex + 1}/${currentQuestions.length}`;
    
    // Create options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });
    
    // Reset and start timer
    timeLeft = 30;
    updateTimer();
    startTimer();
    
    // Disable next button
    nextBtn.disabled = true;
    quizActive = true;
}

// Start timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            handleTimeout();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 10;
    timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 10) {
        timerDisplay.classList.add('warning');
    } else {
        timerDisplay.classList.remove('warning');
    }
}

// Handle timeout
function handleTimeout() {
    if (quizActive && userAnswers[currentIndex] === null) {
        clearInterval(timer);
        userAnswers[currentIndex] = -1; // Mark as skipped
        
        // Highlight correct answer
        const options = document.querySelectorAll('.option');
        const correctIndex = currentQuestions[currentIndex].correct;
        options[correctIndex].classList.add('correct');
        
        // Disable all options
        options.forEach(opt => opt.disabled = true);
        
        // Enable next button
        nextBtn.disabled = false;
        quizActive = false;
    }
}

// Select option
function selectOption(index) {
    if (!quizActive || userAnswers[currentIndex] !== null) return;
    
    clearInterval(timer);
    
    const question = currentQuestions[currentIndex];
    const isCorrect = index === question.correct;
    
    // Save answer
    userAnswers[currentIndex] = {
        selected: index,
        isCorrect: isCorrect
    };
    
    // Update score
    if (isCorrect) {
        score++;
        document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    }
    
    // Visual feedback
    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.disabled = true;
        if (i === question.correct) {
            opt.classList.add('correct');
        } else if (i === index && !isCorrect) {
            opt.classList.add('wrong');
        }
    });
    
    // Enable next button
    nextBtn.disabled = false;
    quizActive = false;
}

// Next button
nextBtn.addEventListener('click', () => {
    currentIndex++;
    
    if (currentIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Show results
function showResults() {
    clearInterval(timer);
    
    // Calculate stats
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    
    userAnswers.forEach(answer => {
        if (answer === -1) {
            skipped++;
        } else if (answer && answer.isCorrect) {
            correct++;
        } else if (answer && !answer.isCorrect) {
            wrong++;
        }
    });
    
    const percentage = Math.round((correct / currentQuestions.length) * 100);
    
    // Update UI
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = wrong;
    document.getElementById('skippedCount').textContent = skipped;
    document.getElementById('scoreCircle').textContent = percentage + '%';
    
    // Set feedback message
    const feedback = document.getElementById('feedbackMessage');
    if (percentage >= 80) {
        feedback.textContent = 'Excellent! You\'re a quiz master! 🎉';
        feedback.className = 'message success';
    } else if (percentage >= 60) {
        feedback.textContent = 'Good job! Keep learning! 👍';
        feedback.className = 'message success';
    } else if (percentage >= 40) {
        feedback.textContent = 'Nice try! Practice makes perfect! 💪';
        feedback.className = 'message';
    } else {
        feedback.textContent = 'Don\'t give up! Try again! 🌟';
        feedback.className = 'message error';
    }
    
    // Show results screen
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

// Restart quiz
restartBtn.addEventListener('click', () => {
    setupScreen.classList.remove('hidden');
    resultsScreen.classList.add('hidden');
    clearInterval(timer);
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!quizScreen.classList.contains('hidden') && quizActive) {
        const key = e.key;
        if (key >= '1' && key <= '4') {
            const index = parseInt(key) - 1;
            const options = document.querySelectorAll('.option');
            if (options[index] && !options[index].disabled) {
                selectOption(index);
            }
        }
    }
});