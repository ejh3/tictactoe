const P1 = "X";
const P2 = "O";
const GAP = 0.1; // as a percentage of square size
const WIDTH = Number(getComputedStyle(document.documentElement).getPropertyValue('--board-width').slice(0, -4));
console.log(WIDTH)
const P1_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--p1-color');
const P2_COLOR = getComputedStyle(document.documentElement).getPropertyValue('--p2-color');
let n, toWin;
let squares, state, numPlayed;
let currentPlayer, gameOver;

game = document.getElementById("main-game");
heading = document.getElementById("game-heading");


document.getElementById("start-game").addEventListener("click", () => {
    console.log("Starting game");
    initBoard();
    heading.textContent = currentPlayer + "'s turn";
});

initBoard();


function initBoard() {
    // clear board
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
    squares = [];
    state = [];

    // initialize board variables
    numPlayed = 0; // for sensing a draw
    currentPlayer = P1;
    gameOver = false;

    // get board size and number in a row to win from input
    n = document.getElementById("grid-size").valueAsNumber;
    toWin = document.getElementById("num-to-win").valueAsNumber;
    console.log(`Creating board with n=${n}, toWin=${toWin}`);

    // set grid template columns and rows
    let squareSize = (WIDTH - (n - 1) * GAP) / n;
    game.style.gridTemplateColumns = "1fr ".repeat(n);
    game.style.gridTemplateRows = "1fr ".repeat(n);
    game.style.gap = GAP * squareSize + "vmin";

    // create n^2 divs and append them to the game div
    for (let i = 0; i < n; i++) {
        squares[i] = [];
        state[i] = [];
        for (let j = 0; j < n; j++) {
            let div = document.createElement("div");
            div.style.lineHeight = (WIDTH - (n - 1) * GAP * squareSize) / n + "vmin";
            div.style.fontSize = (WIDTH - (n - 1) * GAP * squareSize) / n + "vmin";
            div.classList.add("square");
            div.addEventListener("click", () => {
                if (!gameOver) {
                    handleSquareClick(i, j);
                }
            });
            div.addEventListener("mouseenter", () => {
                if (state[i][j] == "" && !gameOver) {
                    div.style.transform = "scale(1.05)";
                }
            });
            div.addEventListener("mouseleave", () => {
                div.style.transform = "scale(1.0)";
            });
            game.appendChild(div);

            squares[i][j] = div;
            state[i][j] = "";
        }
    }
}

// Handles a click on the square at (i, j), updating the internal state and the UI appropriately
function handleSquareClick(i, j) {
    if (state[i][j] == "") { // ignore attempts to play on a square that's already been played
        numPlayed += 1;
        state[i][j] = currentPlayer;
        squares[i][j].textContent = currentPlayer;
        squares[i][j].style.color = currentPlayer === P1 ? P1_COLOR : P2_COLOR;
        squares[i][j].style.boxShadow = `0 0 calc(0.15em + 2px) ` + (currentPlayer === P1 ? P1_COLOR : P2_COLOR);
        //game.style.boxShadow = `0 0 5vmin ` + (currentPlayer === P1 ? "r" : "blue");
        squares[i][j].style.backgroundColor = "#ddd";
        squares[i][j].style.zIndex = numPlayed*10;
        if (hasWonAt(i, j)) {
            heading.textContent = currentPlayer + " wins!";
            gameOver = true;
        } else if (numPlayed === n * n) {
            heading.textContent = "It's a draw!";
            gameOver = true;
        }
        else {
            currentPlayer = currentPlayer === P1 ? P2 : P1; // switch to the next player
            heading.textContent = currentPlayer + "'s turn";
        }
    }
}

// Checks for a win (toWin of either P1 or P2 in a contiguous line) at the given square
function hasWonAt(i, j) {
    let player = state[i][j];
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

    // Checks forwards and backwards in all four directions from (i,j)
    for (const dir of directions) {
        count = -1; // -1 to avoid double counting [i, j]
        for (let reverse = 1; reverse >= -1; reverse -= 2) {
            // iterate in the current direction, staying within bounds and reversing direction
            // if out of bounds or if the square is not the current player's
            for (let k = 0;
                0 <= (row = i + reverse * k * dir[0]) && row < n && 
                0 <= (col = j + reverse * k * dir[1]) && col < n;
                k++) {

                if (state[row][col] === player) {
                    count += 1;
                    if (count === toWin) {
                        console.log(`Player ${player} wins with ${count} in a row!`);
                        return true;
                    }
                } else {
                    break;
                }


            }
        }
        console.log(`Player ${player} has ${count}/${toWin} in a row at ${i}, ${j}`)
    }
    return false;
}


