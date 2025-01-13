const welcomeContainer = document.getElementById('welcome');
const quizContainer = document.getElementById('quiz');
const nextButton = document.getElementById('next');
const resultsContainer = document.getElementById('results');
const startButton = document.getElementById('start');

let currentQuestion = 0;
let score = 0;
let answered = false;
let quizData = [];

// Funkcja do losowego mieszania tablicy
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Ładowanie danych quizu
function loadQuizData() {
    fetch('quizData.json')
        .then(response => response.json())
        .then(data => {
            const shuffledData = shuffleArray([...data]); // Wymieszaj pytania przed pokazaniem
            quizData = shuffledData.slice(0, 10); // Wybierz pierwsze 10 pytań
            showQuestion(currentQuestion);
        })
        .catch(error => {
            console.error('Error loading quiz data:', error);
            resultsContainer.innerHTML = '<h2>Wystąpił problem z ładowaniem danych quizu.</h2>';
        });
}

// Załaduj dane quizu i zaktualizuj tekst na stronie tytułowej
fetch('quizData.json')
    .then(response => response.json())
    .then(data => {
        const welcomeText = document.querySelector('#welcome p');
        welcomeText.textContent = `Baza tatrzańskiego quizu zawiera obecnie ${data.length} pytań. Test składa się z 10 losowo wybranych pytań. Sprawdź swoją wiedzę o Tatrach!`;
    });

function showQuestion(questionIndex) {
    const questionData = quizData[questionIndex];
    
    // Przygotuj tablicę odpowiedzi do wymieszania
    const answers = [
        { key: 'a', text: questionData.a },
        { key: 'b', text: questionData.b },
        { key: 'c', text: questionData.c },
        { key: 'd', text: questionData.d }
    ];
    
    // Wymieszaj odpowiedzi
    const shuffledAnswers = shuffleArray([...answers]);

    quizContainer.innerHTML = `
        <div class="question">${questionData.question}</div>
        ${questionData.image ? `<img src="${questionData.image}" alt="Quiz image">` : ''}
        <div class="answers">
            ${shuffledAnswers.map(answer => `
                <label>
                    <input type="radio" name="answer" value="${answer.key}">
                    ${answer.text}
                </label><br>
            `).join('')}
        </div>
    `;
    answered = false;
    nextButton.style.display = 'none'; // Ukrywa przycisk "Następne pytanie" do momentu udzielenia odpowiedzi
}

function showNextQuestion() {
    if (answered) {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            showQuestion(currentQuestion);
        } else {
            showResults();
        }
    }
}

function checkAnswer() {
    if (answered) return;

    const answerContainer = quizContainer.querySelector('.answers');
    const userAnswer = (answerContainer.querySelector('input[name=answer]:checked') || {}).value;

    if (!userAnswer) return;  // Jeśli użytkownik nie wybrał odpowiedzi, nie rób nic

    const correctAnswer = quizData[currentQuestion].correct;

    answerContainer.querySelectorAll('label').forEach(label => {
        const input = label.querySelector('input');
        if (input.value === correctAnswer) {
            label.style.color = 'green';
        } else if (input.checked && input.value !== correctAnswer) {
            label.style.color = 'red';
        }
    });

    if (userAnswer === correctAnswer) {
        score++;
    }

    answered = true;
    nextButton.style.display = 'block';  // Pokazuje przycisk "Następne pytanie" po udzieleniu odpowiedzi
}

function showResults() {
    quizContainer.style.display = 'none';
    nextButton.style.display = 'none'; // Ukrywa przycisk "Następne pytanie" po zakończeniu quizu
    resultsContainer.innerHTML = `
        <h2>Twój wynik: ${score} / ${quizData.length}</h2>
        <button id="retry">Wykonaj quiz ponownie</button>
    `;

    document.getElementById('retry').addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        showQuestion(currentQuestion);
        quizContainer.style.display = 'block';
        nextButton.style.display = 'block';
        resultsContainer.innerHTML = '';
    });
}

startButton.addEventListener('click', () => {
    welcomeContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    loadQuizData(); // Załaduj dane quizu po kliknięciu przycisku "Rozpocznij quiz"
});

nextButton.addEventListener('click', showNextQuestion);
quizContainer.addEventListener('change', checkAnswer);
