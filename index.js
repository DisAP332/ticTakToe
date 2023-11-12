// div elements and body
var body = document.getElementById("body");
var player_2_name_div = document.getElementById("player_2_name_div");
var player1_turn_indiciator = document.getElementById("player1_turn_indiciator");
var player2_turn_indiciator = document.getElementById("player2_turn_indiciator");
// select elements
var Playstyle = document.getElementById("mode");
// input elements
var player_1_name = document.getElementById("player1");
var player_2_name = document.getElementById("player2");
// h1 elements
var winnerBox = document.getElementById("winnerBox");
var p1score = document.getElementById("p1score");
var p2score = document.getElementById("p2score");
var playstyle = Playstyle.value;
Playstyle.addEventListener("change", function () {
    if (playstyle === "multi") {
        player_2_name_div.classList.remove("show_block");
        player_2_name_div.classList.add("hide");
    }
    else if (playstyle === "single") {
        player_2_name_div.classList.remove("hide");
        player_2_name_div.classList.add("show_block");
    }
});
Playstyle.addEventListener("change", function () {
    playstyle = Playstyle.value;
});
// add start screen
var start_screen = document.querySelector(".start_screen");
var start = document.getElementById("start");
var reset = document.getElementById("reset");
var rematch = document.getElementById("rematch");
start.addEventListener("click", startNewGame);
function showStartScreen() {
    start_screen.classList.remove("hide");
    start_screen.classList.add("show");
}
function hideStartScreen() {
    start_screen.classList.remove("show");
    start_screen.classList.add("hide");
}
var Player = /** @class */ (function () {
    function Player(name, score, turn, positions) {
        this.name = name;
        this.score = score;
        this.turn = turn;
        this.positions = positions;
    }
    Player.prototype.addPosition = function (position) {
        this.positions.push(position);
    };
    Player.prototype.addScore = function () {
        this.score += 1;
    };
    Player.prototype.resetPositions = function () {
        this.positions = [];
    };
    Player.prototype.resetScore = function () {
        this.score = 0;
    };
    return Player;
}());
// add game logic -------------------------------
var winConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];
var Game = /** @class */ (function () {
    function Game(won, turn, turns, player1, player2) {
        this.won = won;
        this.turn = turn;
        this.turns = turns;
        this.player1 = player1;
        this.player2 = player2;
    }
    Game.prototype.takeTurn = function (positionTaken, box) {
        if (this.turn === "player1") {
            this.player1.addPosition(positionTaken);
            player2_turn_indiciator.classList.add("turn_indicator");
            player1_turn_indiciator.classList.remove("turn_indicator");
        }
        else if (this.turn === "player2") {
            this.player2.addPosition(positionTaken);
            player1_turn_indiciator.classList.add("turn_indicator");
            player2_turn_indiciator.classList.remove("turn_indicator");
        }
        this.turns++;
        box.textContent = this.turn === "player1" ? "x" : "o";
        this.checkWin();
        if (this.won === true) {
            return;
        }
        this.turn = this.turn === "player1" ? "player2" : "player1";
        return;
    };
    Game.prototype.checkWin = function () {
        var _this = this;
        var player = this.turn === "player1" ? this.player1 : this.player2;
        winConditions.forEach(function (condition) {
            // check if all positions are in the win condition
            if (player.positions.includes(condition[0]) &&
                player.positions.includes(condition[1]) &&
                player.positions.includes(condition[2])) {
                // add score to player
                player.addScore();
                _this.won = true;
                _this.endGame(player.name);
                return;
            }
        });
        // if game is a draw
        if (this.turns >= 9 && this.won === false) {
            this.won = true;
            this.endGame("draw");
        }
    };
    Game.prototype.endGame = function (player) {
        var scores = [this.player1.score, this.player2.score];
        this.turns = 0;
        this.turn = "player1";
        // reset players positins
        this.player1.resetPositions();
        this.player2.resetPositions();
        sendToStartScreen(player, this.resetWin.bind(this), scores);
    };
    Game.prototype.resetWin = function () {
        this.won = false;
    };
    return Game;
}());
function computer(game) {
    if (game.won === true || game.turn !== "player2") {
        return;
    }
    // computer picks number between 1 and 9
    var random = Math.floor(Math.random() * 9) + 1;
    var box = document.getElementById("".concat(random));
    // check if box is already taken
    if (box.textContent === "x" ||
        box.textContent === "o" ||
        box.textContent !== "") {
        return computer(game);
    }
    game.takeTurn(random, box);
    return;
}
// game initiliazation -------------------------------
function startNewGame() {
    hideStartScreen();
    var game = new Game(false, "player1", 0, new Player(player_1_name.value, 0, true, []), playstyle === "multi"
        ? new Player(player_2_name.value, 0, false, [])
        : new Player("Computer", 0, false, []));
    clearBoard();
    setBoxEvents(game);
}
function setBoxEvents(game) {
    var _loop_1 = function (i) {
        var box = document.getElementById("".concat(i));
        box.addEventListener("click", function () {
            game.takeTurn(i, box);
            // if playstyle is single and player1 has not won, execute computer logic
            if (playstyle === "single" && game.won === false) {
                // wait a second to make it look like computers thinking
                setTimeout(function () {
                    computer(game);
                }, 300);
            }
        });
    };
    for (var i = 1; i <= 9; i++) {
        _loop_1(i);
    }
}
// game reset -------------------------------
function clearBoard() {
    for (var i = 1; i <= 9; i++) {
        var box = document.getElementById("".concat(i));
        box.textContent = "";
    }
}
function sendToStartScreen(player, resetWin, scores) {
    showStartScreen();
    // add winner text
    if (player === "draw") {
        winnerBox.textContent = "Draw!";
    }
    else {
        winnerBox.textContent = "".concat(player, " wins!");
    }
    // add scores
    p1score.textContent = scores ? scores[0].toString() : "0";
    p2score.textContent = scores ? scores[1].toString() : "0";
    // clear start screen begin new game
    start.removeEventListener("click", startNewGame);
    start.addEventListener("click", function () {
        hideStartScreen();
        clearBoard();
        resetWin();
    });
}
