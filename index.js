function setup() {
    createCanvas(450, 450).parent('canvas');
    document.getElementById("reset").onclick = function() {reset()};
}

function draw() {
    line(150, 0, 150, 450);
    line(300, 0, 300, 450);
    line(0, 150, 450, 150);
    line(0, 300, 450, 300);

}

function drawCross(x = 0, y = 0) {
    line(30 + x, 30 + y, 120 + x, 120 + y);
    line(120 + x, 30 + y, 30 + x, 120 + y);
}

function drawCircle(x = 0, y = 0) {
    circle(75 + x, 75 + y, 90);
}

let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let count = 0;
let winner = 0;

function mouseClicked(event) {
    if (winner === 0) {
        let isCross = count % 2 === 0;

        let x = -1;
        let y = -1;
        if (mouseX > 0 && mouseX <= 150) x = 0;
        if (mouseX > 150 && mouseX <= 300) x = 1;
        if (mouseX > 300 && mouseX <= 450) x = 2;
        if (mouseY > 0 && mouseY <= 150) y = 0;
        if (mouseY > 150 && mouseY <= 300) y = 1;
        if (mouseY > 300 && mouseY <= 450) y = 2;
        if (x >= 0 && y >= 0 && board[x][y] === 0) {
            count = count + 1;
            board[x][y] = isCross ? 1 : 2;
            if (isCross) drawCross(x * 150, y * 150);
            else drawCircle(x * 150, y * 150);
        }
        checkWin()
    }
}

function checkWin() {
    for (let i = 1; i <=2; i++) {
        if (board[0][0] === i && board[0][1] === i &&  board[0][2] === i) winner = i;
        else if (board[1][0] === i && board[1][1] === i &&  board[1][2] === i) winner = i;
        else if (board[2][0] === i && board[2][1] === i &&  board[2][2] === i) winner = i;
        else if (board[0][0] === i && board[1][0] === i &&  board[2][0] === i) winner = i;
        else if (board[0][1] === i && board[1][1] === i &&  board[2][1] === i) winner = i;
        else if (board[0][2] === i && board[1][2] === i &&  board[2][2] === i) winner = i;
        else if (board[0][0] === i && board[1][1] === i &&  board[2][2] === i) winner = i;
        else if (board[0][2] === i && board[1][1] === i &&  board[2][0] === i) winner = i;
    }
    if (count === 9) winner = 3;
    if (winner === 1) document.getElementById("result").innerHTML = "X Wins";
    if (winner === 2) document.getElementById("result").innerHTML = "O Wins";
    if (winner === 3) document.getElementById("result").innerHTML = "Drawn Game";
}

function reset() {
    clear();
    winner = 0;
    document.getElementById("result").innerHTML = "";
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    count = 0;
}
