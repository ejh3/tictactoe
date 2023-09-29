// Constants
const GAP = 0.1; // as a percentage of square size
const MAX_WIDTH = 20; // in board squares
const MIN_WIDTH = 1; // in board squares
const STYLE = getComputedStyle(document.documentElement);
const WIDTH = Number(STYLE.getPropertyValue('--board-width').slice(0, -4)); // vmin sliced off
const P1 = STYLE.getPropertyValue('--p1');
const P2 = STYLE.getPropertyValue('--p2');
const P1_COLOR = STYLE.getPropertyValue('--p1-color');
const P2_COLOR = STYLE.getPropertyValue('--p2-color');

// Global variables
let gridSize, toWin;
let squares, numPlayed;
let currentPlayer, gameOver;

// DOM elements
const body = document.getElementsByClassName("body")[0];
const game = document.getElementById("main-game");
const heading = document.getElementById("game-heading");
const gridSizeInput = document.getElementById("grid-size");
const toWinInput = document.getElementById("num-to-win");


// add max attribute to input fields
gridSizeInput.max = MAX_WIDTH;
toWinInput.max = MAX_WIDTH;

// enforce limits on input fields and ensure toWin <= gridSize
gridSizeInput.addEventListener('input', (event) => {
  let newGridSize = event.target.valueAsNumber;
  if (newGridSize > MAX_WIDTH) {
    gridSizeInput.value = MAX_WIDTH;
  } else if (newGridSize < MIN_WIDTH) {
    gridSizeInput.value = MIN_WIDTH;
  } else {
    gridSizeInput.value = newGridSize;
  }

  if (gridSizeInput.value < toWin) {
    toWinInput.value = gridSizeInput.value;
  }
  initBoard(); // will update gridSize and toWin
  console.log(`n changed to: ${newValue}`);
});

toWinInput.addEventListener('input', (event) => {
  let newToWin = event.target.valueAsNumber;
  if (newToWin > MAX_WIDTH) {
    toWinInput.value = MAX_WIDTH;
  } else if (newToWin < MIN_WIDTH) {
    toWinInput.value = MIN_WIDTH;
  } else {
    toWinInput.value = newToWin;
  }

  if (toWinInput.value > gridSize) {
    gridSizeInput.value = toWinInput.value;
  } 
  initBoard(); // will update gridSize and toWin
  console.log(`toWin changed to: ${toWin}`);
});


// buttons for board presets
document.getElementById("tictactoe").addEventListener("click", () => {
  toWinInput.value = 3;
  gridSizeInput.value = 3;
  initBoard();
});

document.getElementById("fiveinarow").addEventListener("click", () => {
  toWinInput.value = 5;
  gridSizeInput.value = 15;
  initBoard();
});


// Initialize board without user input
initBoard();



/********************** FUNCTIONS **********************/

function initBoard() {
  // clear board
  while (game.firstChild) {
    game.removeChild(game.firstChild);
  }
  squares = [];
  // initialize board variables
  numPlayed = 0; // for sensing a draw
  currentPlayer = 1;
  gameOver = false;

  // get board size and number in a row to win from input
  gridSize = gridSizeInput.valueAsNumber;
  toWin = toWinInput.valueAsNumber;
  console.log(`Creating board with n=${gridSize}, toWin=${toWin}`);

  // set grid template columns and rows
  let squareSize = (WIDTH - (gridSize - 1) * GAP) / gridSize;
  game.style.gridTemplateColumns = "1fr ".repeat(gridSize);
  game.style.gridTemplateRows = "1fr ".repeat(gridSize);
  game.style.gap = GAP * squareSize + "vmin";

  // create n^2 divs and append them to the game div
  for (let i = 0; i < gridSize; i++) {
    squares[i] = [];
    for (let j = 0; j < gridSize; j++) {
      let div = document.createElement("div");
      div.style.lineHeight = (WIDTH - (gridSize - 1) * GAP * squareSize) / gridSize + "vmin";
      div.style.fontSize = (WIDTH - (gridSize - 1) * GAP * squareSize) / gridSize + "vmin";
      div.classList.add("square");
      div.addEventListener("click", () => {
        handleSquareClick(i, j);
      });
      div.addEventListener("mouseenter", (event) => {
        if (event.target.getAttribute("player") == "" && !gameOver) {
          div.style.transform = "scale(1.05)";
          div.style.boxShadow = `0 0 calc(0.1em + 2px) ${(currentPlayer === 1 ? P1_COLOR : P2_COLOR)}`;
        }
      });
      div.addEventListener("mouseleave", (event) => {
        div.style.transform = "scale(1.0)";
        if (event.target.getAttribute("player") == "") {
          div.style.boxShadow = "none"
        }
      });
      div.setAttribute("player", "");
      game.appendChild(div);

      squares[i][j] = div;
    }
  }

  heading.textContent = (currentPlayer == 1 ? P1 : P2) + "'s turn";
}

// Handles a click on the square at (i, j), updating the internal state and the UI appropriately
function handleSquareClick(i, j) {
  const sq = squares[i][j];
  // ignore clicks if the game is over or if the square is already played
  if (gameOver || sq.getAttribute("player") != "") {
    return;
  }
  numPlayed += 1;
  sq.setAttribute("player", currentPlayer);
  sq.textContent = (currentPlayer == 1 ? P1 : P2);
  sq.style.zIndex = numPlayed * 10;
  if (hasWonAt(i, j)) {
    heading.textContent = (currentPlayer == 1 ? P1 : P2) + " wins!";
    gameOver = true;
  } else if (numPlayed === gridSize * gridSize) {
    heading.textContent = "It's a draw!";
    gameOver = true;
  }
  else {
    currentPlayer = (currentPlayer) % 2 + 1; // switch to the next player
    // document.body.style.backgroundColor = (currentPlayer === 1 ? P1_COLOR : P2_COLOR);
    document.body.style.boxShadow = 
      `inset -100px 0px 8vmin -115px ${currentPlayer === 1 ? P1_COLOR : P2_COLOR},
      inset 100px 0px 8vmin -115px ${currentPlayer === 1 ? P1_COLOR : P2_COLOR}`;

    // document.body.style.backgroundImage = `linear-gradient(to top, ${currentPlayer === 1 ? P1_COLOR : P2_COLOR} 10%, white 60%)`;
    heading.textContent = (currentPlayer == 1 ? P1 : P2) + "'s turn";
  }
}

// Checks for a win (toWin of either P1 or P2 in a contiguous line) at the given square
function hasWonAt(i, j) {
  let player = squares[i][j].getAttribute("player");
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

  // Checks forwards and backwards in all four directions from (i,j)
  for (const dir of directions) {
    count = -1; // -1 to avoid double counting [i, j]
    for (let reverse = 1; reverse >= -1; reverse -= 2) {
      // iterate in the current direction, staying within bounds and reversing direction
      // if out of bounds or if the square is not the current player's
      for (let k = 0;
        0 <= (row = i + reverse * k * dir[0]) && row < gridSize &&
        0 <= (col = j + reverse * k * dir[1]) && col < gridSize;
        k++) {

        if (squares[row][col].getAttribute("player") === player) {
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


