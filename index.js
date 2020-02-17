let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let count = 0;
let winner = 0;
let opponent = 'computer';
let playerTurn = true;

function setup() {
    createCanvas(450, 450).parent('canvas');
    document.getElementById("reset").onclick = function() {reset()};
    document.getElementById("human").onclick = function() {opponent = 'human'};
    document.getElementById("computer").onclick = function() {opponent = 'computer'};
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
            playerTurn = !playerTurn;
            board[x][y] = isCross ? 1 : 2;
            if (isCross) drawCross(x * 150, y * 150);
            else drawCircle(x * 150, y * 150);
        }
        checkWin()
    }
}

function computerMove() {
    playerTurn = !playerTurn;
    let isCross = count % 2 === 0;
    // const [x, y] = firstAvailableComputerMove();
    const [x, y] = minimaxComputerMove(board, 9 - count, true, isCross);
    board[x][y] = isCross ? 1 : 2;
    if (isCross) drawCross(x * 150, y * 150);
    else drawCircle(x * 150, y * 150);
    count = count + 1;
    checkWin();
}

function firstAvailableComputerMove() {
    let move;
    let playedTurn = false;
    for (let x = 0; x <=2; x++){
        for (let y = 0; y <=2; y++){
            if (board[x][y] === 0 && !playedTurn) {
                move = [x,y];
                playedTurn = true;
            }
        }
    }
    return move;
}

function minimaxComputerMove(currentBoard, depth, isMaximising, isCross) {
    const boardScore = evaluateBoard(currentBoard);
    if ((depth === 0) || (boardScore !== 0)) return boardScore;

    let bestMove;
    if (isMaximising) {
        let bestScore = -500;
        for (let x = 0; x <=2; x++) {
            for (let y = 0; y <= 2; y++) {
                if (currentBoard[x][y] === 0) {
                    const newBoard = currentBoard.map(function(row) {
                        return row.slice();
                    });
                    newBoard[x][y] = isCross ? 1 : 2;
                    const currentScore = minimaxComputerMove(newBoard, depth - 1, false, !isCross);
                    if (currentScore >= bestScore) {
                        bestScore = currentScore;
                        bestMove = [x, y];
                    }
                }
            }
        }
    } else {
        let bestScore = 500;
        for (let x = 0; x <=2; x++) {
            for (let y = 0; y <= 2; y++) {
                if (currentBoard[x][y] === 0) {
                    const newBoard = currentBoard.map(function(row) {
                        return row.slice();
                    });
                    newBoard[x][y] = isCross ? 1 : 2;
                    const currentScore = minimaxComputerMove(newBoard, depth - 1, true, !isCross);
                    if (currentScore <= bestScore) {
                        bestScore = currentScore;
                        bestMove = [x, y];
                    }
                }
            }
        }
    }
    return bestMove;
}

function evaluateBoard(board) {
    let result = 0
    for (let i = 1; i <=2; i++) {
        if (board[0][0] === i && board[0][1] === i &&  board[0][2] === i) result = i;
        else if (board[1][0] === i && board[1][1] === i &&  board[1][2] === i) result = i;
        else if (board[2][0] === i && board[2][1] === i &&  board[2][2] === i) result = i;
        else if (board[0][0] === i && board[1][0] === i &&  board[2][0] === i) result = i;
        else if (board[0][1] === i && board[1][1] === i &&  board[2][1] === i) result = i;
        else if (board[0][2] === i && board[1][2] === i &&  board[2][2] === i) result = i;
        else if (board[0][0] === i && board[1][1] === i &&  board[2][2] === i) result = i;
        else if (board[0][2] === i && board[1][1] === i &&  board[2][0] === i) result = i;
    }
    if (result === 1) return 1;
    if (result === 2) return -1;
    return 0
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
    if (count === 9 && winner === 0) winner = 3;
    if (winner === 1) document.getElementById("result").innerHTML = "Xs Wins";
    if (winner === 2) document.getElementById("result").innerHTML = "Os Wins";
    if (winner === 3) document.getElementById("result").innerHTML = "Drawn Game";
    if (winner === 0 && count < 9 && opponent === 'computer' && !playerTurn) computerMove()
}

function reset() {
    clear();
    winner = 0;
    document.getElementById("result").innerHTML = "";
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    count = 0;
    if (opponent === 'computer') {
        playerTurn = Math.random() >= 0.5;
        if (!playerTurn) computerMove()
    }
}
