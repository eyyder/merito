// Elementos do DOM
const introScreen = document.getElementById('intro-screen');
const questionScreen = document.getElementById('question-screen');
const feedbackScreen = document.getElementById('feedback-screen');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');

const startBtn = document.getElementById('start-btn');
const confirmBtn = document.getElementById('confirm-btn');
const nextBtn = document.getElementById('next-btn');
const reviewBtn = document.getElementById('review-btn');
const restartBtn = document.getElementById('restart-btn');
const backToResultsBtn = document.getElementById('back-to-results-btn');

const progressFill = document.getElementById('progress-fill');
const questionNumber = document.getElementById('question-number');
const timer = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

const feedbackHeader = document.getElementById('feedback-header');
const feedbackContent = document.getElementById('feedback-content');
const feedbackExplanation = document.getElementById('feedback-explanation');

const scorePercentage = document.getElementById('score-percentage');
const correctAnswers = document.getElementById('correct-answers');
const totalQuestions = document.getElementById('total-questions');
const performanceContent = document.getElementById('performance-content');
const reviewList = document.getElementById('review-list');

// Estado do simulado
let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let userAnswers = [];
let startTime = null;
let timerInterval = null;

// Inicialização
startBtn.addEventListener('click', startSimulado);
confirmBtn.addEventListener('click', confirmAnswer);
nextBtn.addEventListener('click', showNextQuestion);
reviewBtn.addEventListener('click', showReviewScreen);
restartBtn.addEventListener('click', restartSimulado);
backToResultsBtn.addEventListener('click', showResultsScreen);

// Desabilitar o botão de confirmar inicialmente
confirmBtn.disabled = true;

// Funções principais
function startSimulado() {
    // Resetar estado
    currentQuestionIndex = 0;
    selectedOptionIndex = null;
    userAnswers = [];
    
    // Iniciar timer
    startTime = new Date();
    startTimer();
    
    // Mostrar primeira questão
    showScreen(questionScreen);
    loadQuestion(currentQuestionIndex);
}

function loadQuestion(index) {
    // Atualizar progresso
    const progress = ((index + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    questionNumber.textContent = `Questão ${index + 1}/${questions.length}`;
    
    // Carregar questão
    const question = questions[index];
    questionText.textContent = question.text;
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Adicionar opções
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <span class="option-letter">${String.fromCharCode(97 + i)})</span>
            <span class="option-text">${option}</span>
        `;
        
        // Adicionar evento de clique
        optionElement.addEventListener('click', () => selectOption(optionElement, i));
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Resetar seleção
    selectedOptionIndex = null;
    confirmBtn.disabled = true;
}

function selectOption(optionElement, index) {
    // Remover seleção anterior
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Adicionar nova seleção
    optionElement.classList.add('selected');
    selectedOptionIndex = index;
    
    // Habilitar botão de confirmar
    confirmBtn.disabled = false;
}

function confirmAnswer() {
    if (selectedOptionIndex === null) return;
    
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === question.correctAnswer;
    
    // Salvar resposta
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedOption: selectedOptionIndex,
        isCorrect: isCorrect
    });
    
    // Mostrar feedback
    showFeedback(isCorrect, question);
}

function showFeedback(isCorrect, question) {
    // Configurar cabeçalho do feedback
    if (isCorrect) {
        feedbackHeader.textContent = 'Resposta Correta!';
        feedbackHeader.className = 'correct';
    } else {
        feedbackHeader.textContent = 'Resposta Incorreta';
        feedbackHeader.className = 'incorrect';
    }
    
    // Configurar conteúdo do feedback
    const selectedOption = question.options[selectedOptionIndex];
    const correctOption = question.options[question.correctAnswer];
    
    if (isCorrect) {
        feedbackContent.innerHTML = `
            <p>Você selecionou a alternativa correta:</p>
            <p><strong>${String.fromCharCode(97 + selectedOptionIndex)}) ${selectedOption}</strong></p>
        `;
    } else {
        feedbackContent.innerHTML = `
            <p>Você selecionou:</p>
            <p><strong>${String.fromCharCode(97 + selectedOptionIndex)}) ${selectedOption}</strong></p>
            <p>A alternativa correta é:</p>
            <p><strong>${String.fromCharCode(97 + question.correctAnswer)}) ${correctOption}</strong></p>
        `;
    }
    
    // Adicionar explicação
    feedbackExplanation.innerHTML = `<p><strong>Explicação:</strong> ${question.explanation}</p>`;
    
    // Mostrar tela de feedback
    showScreen(feedbackScreen);
    
    // Configurar botão de próxima questão
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Ver Resultados';
    } else {
        nextBtn.textContent = 'Próxima Questão';
    }
}

function showNextQuestion() {
    if (currentQuestionIndex === questions.length - 1) {
        // Última questão, mostrar resultados
        showResults();
    } else {
        // Avançar para próxima questão
        currentQuestionIndex++;
        showScreen(questionScreen);
        loadQuestion(currentQuestionIndex);
    }
}

function showResults() {
    // Parar o timer
    clearInterval(timerInterval);
    
    // Calcular pontuação
    const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    // Atualizar elementos
    scorePercentage.textContent = `${percentage}%`;
    correctAnswers.textContent = correctCount;
    totalQuestions.textContent = questions.length;
    
    // Colorir círculo de pontuação baseado no desempenho
    const scoreCircle = document.getElementById('score-circle');
    if (percentage >= 70) {
        scoreCircle.style.borderColor = '#27ae60'; // Verde
    } else if (percentage >= 50) {
        scoreCircle.style.borderColor = '#f39c12'; // Amarelo
    } else {
        scoreCircle.style.borderColor = '#e74c3c'; // Vermelho
    }
    
    // Gerar análise de desempenho
    generatePerformanceAnalysis();
    
    // Mostrar tela de resultados
    showScreen(resultsScreen);
}

function generatePerformanceAnalysis() {
    // Categorias para análise
    const categories = [
        { name: 'Legislação Educacional', questions: [9, 10, 13, 14, 15, 16] },
        { name: 'Fundamentos Teóricos', questions: [0, 2, 18] },
        { name: 'Inclusão e Diversidade', questions: [1, 12, 16] },
        { name: 'Metodologias e Avaliação', questions: [3, 4, 18, 19] },
        { name: 'Gestão e Relações Interpessoais', questions: [5, 6, 7] }
    ];
    
    // Limpar conteúdo anterior
    performanceContent.innerHTML = '';
    
    // Analisar cada categoria
    categories.forEach(category => {
        const relevantAnswers = userAnswers.filter(answer => 
            category.questions.includes(answer.questionIndex)
        );
        
        const correctCount = relevantAnswers.filter(answer => answer.isCorrect).length;
        const totalCount = relevantAnswers.length;
        const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        
        // Criar elemento de categoria
        const categoryElement = document.createElement('div');
        categoryElement.className = 'performance-category';
        
        // Determinar feedback baseado no desempenho
        let feedback;
        if (percentage >= 70) {
            feedback = 'Bom domínio. Continue revisando para aperfeiçoar.';
        } else if (percentage >= 50) {
            feedback = 'Conhecimento intermediário. Reforce este tema.';
        } else {
            feedback = 'Atenção especial necessária. Priorize este tema em seus estudos.';
        }
        
        // Adicionar conteúdo
        categoryElement.innerHTML = `
            <h4>${category.name}</h4>
            <p>${correctCount} de ${totalCount} questões corretas (${percentage}%)</p>
            <p><em>${feedback}</em></p>
        `;
        
        performanceContent.appendChild(categoryElement);
    });
}

function showReviewScreen() {
    // Limpar lista de revisão
    reviewList.innerHTML = '';
    
    // Adicionar cada questão à lista de revisão
    userAnswers.forEach(answer => {
        const question = questions[answer.questionIndex];
        const selectedOption = question.options[answer.selectedOption];
        const correctOption = question.options[question.correctAnswer];
        
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <div class="review-question-number">
                <span>Questão ${answer.questionIndex + 1}</span>
                <span class="review-answer ${answer.isCorrect ? 'correct' : 'incorrect'}">
                    ${answer.isCorrect ? 'Correta' : 'Incorreta'}
                </span>
            </div>
            <div class="review-question-text">${question.text}</div>
            <div>Sua resposta: ${String.fromCharCode(97 + answer.selectedOption)}) ${selectedOption}</div>
            ${!answer.isCorrect ? `<div>Resposta correta: ${String.fromCharCode(97 + question.correctAnswer)}) ${correctOption}</div>` : ''}
        `;
        
        reviewList.appendChild(reviewItem);
    });
    
    // Mostrar tela de revisão
    showScreen(reviewScreen);
}

function restartSimulado() {
    // Reiniciar o simulado
    startSimulado();
}

function showScreen(screen) {
    // Esconder todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    
    // Mostrar a tela especificada
    screen.classList.add('active');
}

function startTimer() {
    // Resetar timer
    let seconds = 0;
    updateTimerDisplay(seconds);
    
    // Iniciar intervalo
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay(seconds);
    }, 1000);
}

function updateTimerDisplay(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Função para mostrar resultados
function showResultsScreen() {
    showScreen(resultsScreen);
}
