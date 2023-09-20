game = document.getElementById("main-game");
heading = document.getElementById("game-heading");

document.getElementById("start-game").addEventListener("click", () => {
    console.log("Starting game");
    initBoard();
    heading.textContent = currentPlayer + "'s turn";
});

const X = "X";
const O = "O";
const width = 60;
const gap = 0.1; // as a percentage of square size
let n, toWin;
let squares, state, numPlayed;
let currentPlayer, gameOver;
game.style.width = width + "vmin";
game.style.height = width + "vmin";

console.log("n, toWin")
console.log(n, toWin)


const initBoard = () => {
    // clear board
    while (game.firstChild) {
        game.removeChild(game.firstChild);
    }
    squares = [];
    state = [];

    // initialize board variables
    numPlayed = 0;
    currentPlayer = X;
    gameOver = false;
    n = Number(document.getElementById("grid-size").value);
    toWin = Number(document.getElementById("num-to-win").value);
    let squareSize = (width - (n-1) * gap) / n;
    game.style.gridTemplateColumns = "1fr ".repeat(n);
    game.style.gridTemplateRows = "1fr ".repeat(n);
    game.style.gap = gap*squareSize + "vmin";

    // create n^2 divs and append them to the game
    for (let i = 0; i < n; i++) {
        squares[i] = [];
        state[i] = [];
        for (let j = 0; j < n; j++) {
            let div = document.createElement("div");
            div.style.borderRadius = "8%";
            div.style.lineHeight = (width - (n-1) * gap*squareSize) / n + "vmin"; 
            div.style.fontSize = (width - (n-1) * gap*squareSize) / n + "vmin";
            div.classList.add("square");
            div.addEventListener("click", () => {
                if (!gameOver) {
                    updateBoard(i, j);
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

initBoard()


const updateBoard = (i, j) => {
    if (state[i][j] == "") {
        numPlayed += 1;
        state[i][j] = currentPlayer;
        squares[i][j].textContent = state[i][j];
        squares[i][j].style.color = currentPlayer === X ? "red" : "blue";
        squares[i][j].style.boxShadow = "0 0 2vmin " + (currentPlayer === X ? "red" : "blue");
        squares[i][j].style.backgroundColor = "#ddd";
        if (checkWin(i, j)) {
            heading.textContent = currentPlayer + " wins!";
            gameOver = true;
        } else if (numPlayed === n*n) {
            heading.textContent = "It's a draw!";
            gameOver = true;
        }
        else {
            currentPlayer = currentPlayer === X ? O : X;
            heading.textContent = currentPlayer + "'s turn";
        }
    }
}



const checkWin = (i, j) => {
    let player = state[i][j];
    const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (const dir of dirs) {
        count = -1; // -1 to avoid double counting [i, j]
        for (let reverse = 1; reverse >= -1; reverse -= 2) {
            for (let k = 0; 
                0 <= (r = i + reverse * k * dir[0]) && r < n && 
                0 <= (c = j + reverse * k * dir[1]) && c < n; // next square to check in bounds 
                k++) {
                
                if (state[r][c] === player) {
                    //console.log(`state[${r}][${c}] === ${player}`)
                    count += 1;
                    // console.log(`count = ${count}, toWin = ${toWin} typeof count = ${typeof count} typeof toWin = ${typeof toWin}`)
                    if (count === toWin) {
                        console.log(`Player ${player} wins with ${count} in a row!`);
                        return true;
                    }
                } else {
                    break;
                }

                
            }
        }
        console.log(`Player ${player} has ${count} in a row at ${i}, ${j} toWin = ${toWin}!`)
    }
    return false;
}


