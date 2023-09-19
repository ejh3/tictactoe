game = document.getElementById("main-game");

let width = 60;
const gap = 1;
const n = 5;

game.style.gridTemplateColumns = "1fr ".repeat(n);
game.style.width = width + "vmin";
game.style.height = width + "vmin";
game.style.gap = gap + "vmin";

let squares = []
// create n^2 divs and append them to the game
for (let i = 0; i < n; i++) {
    squares[i] = [];
    for (let j = 0; j < n; j++) {
        let div = document.createElement("div");
        div.style.borderRadius = "5%";
        squares[i][j] = div;
        div.classList.add("square");
        // div.setAttribute("id", i + "," + j);
        game.appendChild(div);
        console.log("Created square", i+", " + j);
        squares[i][j].innerHTML = "X";
    }
}

squares[1][1].innerHTML = "X";



