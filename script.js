document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    let firstCard, secondCard;
    let lockBoard = false;
    let matches = 0;
    let score = 0;
    let timer = 0;
    let interval;
    let gameStarted = false;
    let gamePaused = false;

    const namesArray = [
        'Alice', 'Alice', 'Bob', 'Bob',
        'Charlie', 'Charlie', 'Dave', 'Dave',
        'Eve', 'Eve', 'Frank', 'Frank',
        'Grace', 'Grace', 'Hank', 'Hank'
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        shuffle(namesArray);
        gameBoard.innerHTML = '';
        namesArray.forEach(name => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.name = name;
            card.textContent = name;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function startGame() {
        if (gameStarted && !gamePaused) return;
        if (gamePaused) {
            gamePaused = false;
            interval = setInterval(() => {
                timer++;
                timerDisplay.textContent = `Time: ${timer}s`;
            }, 1000);
            return;
        }
        gameStarted = true;
        score = 0;
        matches = 0;
        timer = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time: ${timer}s`;
        clearInterval(interval);
        interval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `Time: ${timer}s`;
        }, 1000);
        createBoard();
    }

    function pauseGame() {
        if (!gameStarted || gamePaused) return;
        gamePaused = true;
        clearInterval(interval);
    }

    function resetGame() {
        clearInterval(interval);
        gameStarted = false;
        gamePaused = false;
        score = 0;
        matches = 0;
        timer = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time: ${timer}s`;
        gameBoard.innerHTML = '';
    }

    function flipCard() {
        if (lockBoard) return;
        if (!gameStarted || gamePaused) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;

        if (isMatch) {
            disableCards();
            score++;
            matches++;
            scoreDisplay.textContent = `Score: ${score}`;
            if (matches === namesArray.length / 2) {
                clearInterval(interval);
                setTimeout(() => alert(`You won! Time taken: ${timer}s`), 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        firstCard.classList.add('hidden');
        secondCard.classList.add('hidden');

        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    resetBtn.addEventListener('click', resetGame);
});
