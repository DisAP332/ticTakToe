// div elements and body
const body = document.getElementById("body") as HTMLBodyElement;
const player_2_name_div = document.getElementById(
  "player_2_name_div"
) as HTMLDivElement;
const player1_turn_indiciator = document.getElementById(
  "player1_turn_indiciator"
) as HTMLDivElement;
const player2_turn_indiciator = document.getElementById(
  "player2_turn_indiciator"
) as HTMLDivElement;

// select elements
const Playstyle = document.getElementById("mode") as HTMLSelectElement;

// input elements
const name_inputs = document.getElementById("name_inputs") as HTMLDivElement;
const player_1_name = document.getElementById("player1") as HTMLInputElement;
const player_2_name = document.getElementById("player2") as HTMLInputElement;

// h1 elements
const winnerBox = document.getElementById("winnerBox") as HTMLHeadingElement;
const p1score = document.getElementById("p1score") as HTMLHeadingElement;
const p2score = document.getElementById("p2score") as HTMLHeadingElement;

let playstyle = Playstyle.value;

Playstyle.addEventListener("change", () => {
  if (playstyle === "multi") {
    player_2_name_div.classList.remove("show_block");
    player_2_name_div.classList.add("hide");
  } else if (playstyle === "single") {
    player_2_name_div.classList.remove("hide");
    player_2_name_div.classList.add("show_block");
  }
});

Playstyle.addEventListener("change", () => {
  playstyle = Playstyle.value;
});

// add start screen

const start_screen = document.querySelector(".start_screen");
const start = document.getElementById("start");
const reset = document.getElementById("reset");

start.addEventListener("click", startNewGame);

function showResetButton() {
  reset.classList.remove("hide");
}

function hideResetButton() {
  reset.classList.add("hide");
}

function showStartScreen() {
  start_screen.classList.remove("hide");
  start_screen.classList.add("show");
}

function hideStartScreen() {
  start_screen.classList.remove("show");
  start_screen.classList.add("hide");
}

function showNameInputs() {
  name_inputs.classList.remove("hide");
}

function hideNameInputs() {
  name_inputs.classList.add("hide");
}

// add player logic -------------------------------

interface IPlayer {
  name: string;
  score: number;
  turn: boolean;
  positions: number[];
}

class Player implements IPlayer {
  name: string;
  score: number;
  turn: boolean;
  positions: number[];
  constructor(name: string, score: number, turn: boolean, positions: number[]) {
    this.name = name;
    this.score = score;
    this.turn = turn;
    this.positions = positions;
  }

  addPosition(position: number) {
    this.positions.push(position);
  }

  addScore() {
    this.score += 1;
  }

  resetPositions() {
    this.positions = [];
  }

  resetScore() {
    this.score = 0;
  }
}

// add game logic -------------------------------

const winConditions = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

class Game {
  won: boolean;
  turn: string;
  turns: number;
  player1: Player;
  player2: Player;
  constructor(
    won: boolean,
    turn: string,
    turns: number,
    player1: Player,
    player2: Player
  ) {
    this.won = won;
    this.turn = turn;
    this.turns = turns;
    this.player1 = player1;
    this.player2 = player2;
  }

  takeTurn(positionTaken: number, box: HTMLElement) {
    if (this.turn === "player1") {
      this.player1.addPosition(positionTaken);

      player2_turn_indiciator.classList.add("turn_indicator");
      player1_turn_indiciator.classList.remove("turn_indicator");
    } else if (this.turn === "player2") {
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
  }

  checkWin() {
    let player = this.turn === "player1" ? this.player1 : this.player2;
    winConditions.forEach((condition) => {
      // check if all positions are in the win condition
      if (
        player.positions.includes(condition[0]) &&
        player.positions.includes(condition[1]) &&
        player.positions.includes(condition[2])
      ) {
        // add score to player
        player.addScore();
        this.won = true;
        this.endGame(player.name);
        return;
      }
    });
    // if game is a draw
    if (this.turns >= 9 && this.won === false) {
      this.won = true;
      this.endGame("draw");
    }
  }

  endGame(winner: string) {
    let scores = [this.player1.score, this.player2.score];
    this.turns = 0;
    this.turn = "player1";

    // reset players positins
    this.player1.resetPositions();
    this.player2.resetPositions();

    sendToStartScreen(this, winner);
  }

  resetWin() {
    this.won = false;
  }
}

function computer(game: Game) {
  if (game.won === true || game.turn !== "player2") {
    return;
  }
  // computer picks number between 1 and 9
  let random = Math.floor(Math.random() * 9) + 1;
  let box = document.getElementById(`${random}`);
  // check if box is already taken
  if (
    box.textContent === "x" ||
    box.textContent === "o" ||
    box.textContent !== ""
  ) {
    return computer(game);
  }
  game.takeTurn(random, box);
  return;
}

// game initiliazation -------------------------------

function startNewGame() {
  hideStartScreen();
  let game = new Game(
    false,
    "player1",
    0,
    new Player(player_1_name.value, 0, true, []),
    playstyle === "multi"
      ? new Player(player_2_name.value, 0, false, [])
      : new Player("Computer", 0, false, [])
  );
  setBoxEvents(game);
  hideNameInputs();
  start.removeEventListener("click", startNewGame);
}

function setBoxEvents(game: Game) {
  for (let i = 1; i <= 9; i++) {
    let box = document.getElementById(`${i}`);
    box.addEventListener("click", () => {
      if (box.textContent !== "x" && box.textContent !== "o") {
        game.takeTurn(i, box);
      }
      // if playstyle is single and player1 has not won, execute computer logic
      if (playstyle === "single" && game.won === false) {
        // wait a second to make it look like computers thinking
        setTimeout(() => {
          computer(game);
        }, 300);
      }
    });
  }
}

// game reset -------------------------------

function clearBoard() {
  for (let i = 1; i <= 9; i++) {
    let box = document.getElementById(`${i}`);
    box.textContent = "";
  }
}

function displayScores(player1: Player, player2: Player) {
  p1score.textContent = player1.score.toString();
  p2score.textContent = player2.score.toString();
}

function sendToStartScreen(game: Game, winner: string) {
  showStartScreen();
  // add winner text
  if (winner === "draw") {
    winnerBox.textContent = "Draw!";
  } else {
    winnerBox.textContent = `${winner} wins!`;
  }

  // add scores
  displayScores(game.player1, game.player2);

  // reset game asyncronously so the call stack will clear
  // and the computer will not take a turn after the game has been reset
  setTimeout(() => {
    game.won = false;
  }, 100);

  // change start to rematch game
  start.addEventListener("click", () =>
    rematchGame(game.player1, game.player2)
  );
  start.textContent = "Rematch";
  showResetButton();
  reset.addEventListener("click", () => resetGame(game));
}

function rematchGame(player1: Player, player2: Player) {
  player1.name = player_1_name.value;
  player2.name = player_2_name.value;
  clearBoard();
  hideStartScreen();
}

function resetGame(game: Game) {
  game.player1.resetScore();
  game.player2.resetScore();
  displayScores(game.player1, game.player2);
  clearBoard();
  hideResetButton();
  showNameInputs();
  start.textContent = "Start";
}
