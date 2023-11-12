let playStyle = null;
let turn = null;
var modal = document.getElementById('myModal');
const alone = document.getElementById('alone');
const notAlone = document.getElementById('notAlone');

//modal opens

alone.addEventListener('click', () => {
    playStyle = 1;
    start()
})
notAlone.addEventListener('click', () => {
    playStyle = 0;
    start()
    console.log(playStyle)
})

//initialize buttons and variables 
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]


const initializeVars = (data) => {
    data.currentPlayer = 'X';
    data.turn = 0;
    data.player1 = 'X';
    data.player1Choices = [];
    data.player2Choices = [];
    data.player2 = 'O';
    data.board = [0,1,2,3,4,5,6,7,8];
    data.gameOver = false;
    data.round = 0;
    data.winConditions = [159, 123, 147, 359, 258, 345, 369, 456, 789];
    console.log(data)
}

const EventListnerInit = (data) => {
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', (event => {
            playMove(event.target,data) //move to line 55
        }))
    })
}

//close modal and start the game

const start = (() => {
    modal.style.display = 'none'
    turn = 0;
    const data = {

    }
    game(data);
})

const game = ((data) => {
    initializeVars(data);

    EventListnerInit(data);
})

//player 1 is X and player 2 is O
const playMove = (box, data) => {
    //check if box has a letter in it
    const obox = document.getElementById('obox');
    const xbox = document.getElementById('xbox');
    if(data.round === 9) {
        data.board = [0,1,2,3,4,5,6,7,8];
        data.round = 0;
    }
    if(data.board[box.id] === "X" || data.board[box.id] === 'O'){
        return
    } else if(data.turn < 1) {
        data.player1Choices += data.board[box.id];
        data.board[box.id] = data.player1;
        data.turn++
        data.round++
        data.currentPlayer = 'X'
        xbox.textContent = data.currentPlayer;
        obox.textContent = '';
        checkWin(data)
    } else {
        data.player2Choices += data.board[box.id];
        data.board[box.id] = data.player2;
        data.turn = 0
        data.round++
        data.currentPlayer = 'O'
        obox.textContent = data.currentPlayer;
        xbox.textContent = '';
        checkWin(data)
    }
    box.textContent = data.currentPlayer;
}

const checkWin = (data) => {
    console.log(data.player1Choices)
    winConditions.forEach((condition) => {
            if (data.board[condition[0]] === data.board[condition[1]] &&
                data.board[condition[1]] === data.board[condition[2]]){
            declareWin(data)
        }
    })
}

const declareWin = (data) => {
    const winBox = document.getElementById('winBox');
    if (data.turn === 1) {
        winBox.textContent = "Player X Won!"
    } else {
        winBox.textContent = 'Player O Won!'
    }
}
