let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let count = 0;
let callCount = 0;
let winner = 0;
let opponent = 'computer';
let playerTurn = true;

function setup() {
    createCanvas(450, 450).parent('canvas');
    strokeWeight(4);
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
    stroke('red');
    textSize(100);
    text('1', 45 + x, 110 + y);
    stroke('black');
}

function drawCircle(x = 0, y = 0) {
    stroke('blue');
    textSize(100);
    text('2', 48 + x, 110 + y);
    stroke('black');
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
    const [x, y] = minimaxComputerMove(board, 9 - count, isCross, isCross, true, -500, 500);
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

function minimaxComputerMove(currentBoard, depth, isMaximising, isCross, firstCall, alpha, beta) {
    // console.log(callCount++)
    // without alpha beta pruning 549945
    // with alpha beta pruning 157866
    // 28.7% the amount of iterations as the non optimised one
    // 3.48 times faster
    let bestScore;
    const boardScore = evaluateBoard(currentBoard);
    if ((depth === 0) || (boardScore !== 0)) return boardScore;
    let bestMove;
    if (isMaximising) {
        bestScore = -500;
        for (let x = 0; x <=2; x++) {
            for (let y = 0; y <= 2; y++) {
                if (currentBoard[x][y] === 0) {
                    const newBoard = currentBoard.map(function(row) {
                        return row.slice();
                    });
                    newBoard[x][y] = isCross ? 1 : 2;
                    const currentScore = minimaxComputerMove(newBoard, depth - 1, false, !isCross, false, alpha, beta);
                    if (currentScore > bestScore) {
                        bestScore = currentScore;
                        alpha = alpha > bestScore ? alpha : bestScore;
                        if (beta <= alpha) break;
                        bestMove = [x, y];
                    } else if (currentScore === bestScore && Math.random() >= 0.5) {
                        bestScore = currentScore;
                        bestMove = [x, y];
                    }
                }
            }
        }
    } else {
        bestScore = 500;
        for (let x = 0; x <=2; x++) {
            for (let y = 0; y <= 2; y++) {
                if (currentBoard[x][y] === 0) {
                    const newBoard = currentBoard.map(function(row) {
                        return row.slice();
                    });
                    newBoard[x][y] = isCross ? 1 : 2;
                    const currentScore = minimaxComputerMove(newBoard, depth - 1, true, !isCross, false, alpha, beta);
                    if (currentScore < bestScore) {
                        bestScore = currentScore;
                        beta = beta < bestScore ? beta : bestScore;
                        if (beta <= alpha) break;
                        bestMove = [x, y];
                    } else if (currentScore === bestScore && Math.random() >= 0.5) {
                        bestScore = currentScore;
                        bestMove = [x, y];
                    }
                }
            }
        }
    }
    return firstCall ? bestMove : bestScore;
}

function evaluateBoard(board) {
    let result = 0;
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
        if (board[0][0] === i && board[0][1] === i &&  board[0][2] === i) {
            winner = i;
            line(75, 0, 75, 450);
        }
        else if (board[1][0] === i && board[1][1] === i &&  board[1][2] === i) {
            winner = i;
            line(225, 0, 225, 450);
        }
        else if (board[2][0] === i && board[2][1] === i &&  board[2][2] === i) {
            winner = i;
            line(375, 0, 375, 450);
        }
        else if (board[0][0] === i && board[1][0] === i &&  board[2][0] === i) {
            winner = i;
            line(0, 75, 450, 75);
        }
        else if (board[0][1] === i && board[1][1] === i &&  board[2][1] === i) {
            winner = i;
            line(0, 225, 450, 225);
        }
        else if (board[0][2] === i && board[1][2] === i &&  board[2][2] === i) {
            winner = i;
            line(0, 375, 450, 375);
        }
        else if (board[0][0] === i && board[1][1] === i &&  board[2][2] === i) {
            strokeWeight(2);
            winner = i;
            line(0, 0, 450, 450);
        }
        else if (board[0][2] === i && board[1][1] === i &&  board[2][0] === i) {
            strokeWeight(2);
            winner = i;
            line(0, 450, 450, 0);
        }
    }
    strokeWeight(4);
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
