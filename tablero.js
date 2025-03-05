class BattleshipGame {
    constructor() {
        this.board = document.getElementById('board');
        this.messageElement = document.getElementById('message');
        this.turnInfoElement = document.getElementById('turn-info');
        this.startButton = document.getElementById('start-game');
        this.resetButton = document.getElementById('reset-game');
        this.bestScoreElement = document.getElementById('best-score-value');
        
        this.grid = Array(10).fill().map(() => Array(10).fill(0));
        this.ships = {
            2: { count: 3, remaining: 3 },
            3: { count: 2, remaining: 2 },
            4: { count: 1, remaining: 1 }
        };
        
        this.currentShipSize = 2;
        this.isPlacingShips = true;
        this.attempts = 0;
        this.shipsPlaced = 0;
        this.totalShips = 6;
        
        this.initializeBoard();
        this.setupEventListeners();
        this.loadBestScore();
    }

    initializeBoard() {
        this.board.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.board.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        this.board.addEventListener('click', (e) => this.handleCellClick(e));
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.startButton.addEventListener('click', () => this.startGame());
    }

    handleCellClick(e) {
        if (!e.target.classList.contains('cell')) return;
        
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        if (this.isPlacingShips) {
            this.placeShip(row, col);
        } else {
            this.makeGuess(row, col);
        }
    }

    placeShip(row, col) {
        if (this.canPlaceShip(row, col, this.currentShipSize)) {
            for (let i = 0; i < this.currentShipSize; i++) {
                this.grid[row][col + i] = 1;
                const cell = this.board.querySelector(`[data-row="${row}"][data-col="${col + i}"]`);
                cell.classList.add('ship');
            }

            this.ships[this.currentShipSize].remaining--;
            document.getElementById(`ships-${this.currentShipSize}`).textContent = 
                this.ships[this.currentShipSize].remaining;

            this.shipsPlaced++;
            this.updateShipSize();

            if (this.shipsPlaced === this.totalShips) {
                this.startButton.style.display = 'inline-block';
                this.messageElement.textContent = '¡Todos los barcos colocados! Pulsa "Comenzar Juego"';
            }
        } else {
            this.messageElement.textContent = 'No se puede colocar el barco aquí';
        }
    }

    canPlaceShip(row, col, size) {
        if (col + size > 10) return false;

        for (let i = 0; i < size; i++) {
            if (this.grid[row][col + i] === 1) return false;
        }
        return true;
    }

    updateShipSize() {
        if (this.ships[this.currentShipSize].remaining === 0) {
            if (this.currentShipSize < 4) {
                this.currentShipSize++;
            }
        }
    }

    startGame() {
        this.isPlacingShips = false;
        this.startButton.style.display = 'none';
        this.turnInfoElement.textContent = 'Turno: Jugador Amarillo - Encuentra los barcos';
        this.messageElement.textContent = '¡Comienza a buscar los barcos!';
        
        const cells = this.board.getElementsByClassName('cell');
        for (let cell of cells) {
            if (!cell.classList.contains('ship')) {
                cell.style.backgroundColor = '#fff';
            } else {
                cell.style.backgroundColor = '#fff';
                cell.classList.remove('ship');
            }
        }
    }

    makeGuess(row, col) {
        if (!this.isPlacingShips) {
            const cell = this.board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            
            if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
                return;
            }

            this.attempts++;

            if (this.grid[row][col] === 1) {
                cell.classList.add('hit');
                this.messageElement.textContent = '¡Tocado!';
                this.checkShipSunk(row, col);
            } else {
                cell.classList.add('miss');
                this.messageElement.textContent = 'Agua';
            }

            this.checkGameEnd();
        }
    }

    checkShipSunk(row, col) {
        // Implementación simple de verificación de hundimiento
        let shipCells = 0;
        let hitCells = 0;
        
        // Contar celdas horizontales del barco
        for (let i = 0; i < 10; i++) {
            if (this.grid[row][i] === 1) {
                shipCells++;
                const cell = this.board.querySelector(`[data-row="${row}"][data-col="${i}"]`);
                if (cell.classList.contains('hit')) {
                    hitCells++;
                }
            }
        }

        if (shipCells === hitCells) {
            this.messageElement.textContent = '¡Hundido!';
        }
    }

    checkGameEnd() {
        const cells = this.board.getElementsByClassName('cell');
        let hitCount = 0;
        for (let cell of cells) {
            if (cell.classList.contains('hit')) {
                hitCount++;
            }
        }

        if (hitCount === this.getTotalShipCells()) {
            this.messageElement.textContent = `¡Juego terminado! Intentos necesarios: ${this.attempts}`;
            this.updateBestScore();
        }
    }

    getTotalShipCells() {
        return (this.ships[2].count * 2) + (this.ships[3].count * 3) + (this.ships[4].count * 4);
    }

    updateBestScore() {
        const currentBestScore = this.getBestScore();
        if (!currentBestScore || this.attempts < currentBestScore) {
            this.setBestScore(this.attempts);
            this.bestScoreElement.textContent = this.attempts;
        }
    }

    getBestScore() {
        return parseInt(localStorage.getItem('battleshipBestScore')) || null;
    }

    setBestScore(score) {
        localStorage.setItem('battleshipBestScore', score.toString());
    }

    loadBestScore() {
        const bestScore = this.getBestScore();
        this.bestScoreElement.textContent = bestScore || '-';
    }

    resetGame() {
        this.grid = Array(10).fill().map(() => Array(10).fill(0));
        this.ships = {
            2: { count: 3, remaining: 3 },
            3: { count: 2, remaining: 2 },
            4: { count: 1, remaining: 1 }
        };
        this.currentShipSize = 2;
        this.isPlacingShips = true;
        this.attempts = 0;
        this.shipsPlaced = 0;
        
        this.initializeBoard();
        this.turnInfoElement.textContent = 'Turno: Jugador Rojo - Coloca tus barcos';
        this.messageElement.textContent = '';
        this.startButton.style.display = 'none';
        
        // Actualizar contador de barcos en la UI
        for (let size in this.ships) {
            document.getElementById(`ships-${size}`).textContent = this.ships[size].remaining;
        }
    }
}

// Iniciar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new BattleshipGame();
});