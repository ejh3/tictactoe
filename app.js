game = document.getElementById("main-game");
heading = document.getElementById("game-heading");

const X = "X";
const O = "O";
let width = 60;
const gap = 1;
const n = 5;
const squares = []
const state = [];
const toWin = n;
let currentPlayer = X;


const initBoard = () => {
    game.style.gridTemplateColumns = "1fr ".repeat(n);
    game.style.gridTemplateRows = "1fr ".repeat(n);
    game.style.width = width + "vmin";
    game.style.height = width + "vmin";
    game.style.gap = gap + "vmin";

    // create n^2 divs and append them to the game
    for (let i = 0; i < n; i++) {
        squares[i] = [];
        state[i] = [];
        for (let j = 0; j < n; j++) {
            let div = document.createElement("div");
            div.style.borderRadius = "8%";
            div.style.lineHeight = (width - (n-1) * gap) / n + "vmin"; 
            div.style.fontSize = (width - (n-1) * gap) / n + "vmin";
            div.classList.add("square");
            div.addEventListener("click", () => {
                updateBoard(i, j);
            });
            div.addEventListener("mouseenter", () => {
                if (state[i][j] == "") {
                    div.style.transform = "scale(1.05)";
                }
            });
            div.addEventListener("mouseleave", () => {
                div.style.transform = "scale(1.0)";
            });
            // div.setAttribute("id", i + "," + j);
            game.appendChild(div);
            console.log("Created square", i+", " + j);

            squares[i][j] = div;
            state[i][j] = "";
            // squares[i][j].innerHTML = " ";
        }
    }
}

initBoard()


const updateBoard = (i, j) => {
    if (state[i][j] == "") {
        state[i][j] = currentPlayer;
        squares[i][j].textContent = state[i][j];
        currentPlayer = currentPlayer === X ? O : X;
        heading.textContent = currentPlayer + "'s turn";
    }
}



// const checkWin = (i, j) => {
//     let player = state[i][j];
//     const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]];
//     for (const dir of dirs) {
//         for (let i = 0; i < toWin; i++) {
//             let x = i * dir[0];
//             let y = i * dir[1];
//             if (state[x][y] !== player) {
//                 break;
//             }
//             if (i === toWin - 1) {
//                 return true;
//             }
//         }
        
//     }
// }


