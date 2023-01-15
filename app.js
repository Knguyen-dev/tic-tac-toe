/*


*/

/*
- Create the game result modal with html and css
- Then the step after that would be just putting all of the dom elements in grid Info, renaming grid info as docElements or something
- Continue to try to fit stuff in objects and modules
*/

// Extra DOM Elements that aren't related to the grid itself
const playerXEl = document.getElementById("player-x");
const playerOEl = document.getElementById("player-o");
const scoreElements = document.querySelectorAll(".player-score-el");
const beginGameBtn = document.getElementById("begin-game-btn");
const resetGameBtn = document.getElementById("reset-game-btn");
const alertEl = document.querySelector(".alert-el");

// Object contains the main grid and the grid squares. The function also creates renders the grid squares and creates eventlisteners for them
/*
- Function creates and renders the tic-tac-toe squares, and adds event listeners for them
- Then returns an object with properties main grid, and the grid squares, which allows you
to access those dom elements by accessing the gridInfo objet.
*/
const gridInfo = (() => {
  let gridSquaresHTML = [];
  const playingGrid = document.querySelector(".playing-grid");
  for (let i = 0; i < 9; i++) {
    gridSquaresHTML.push(`<div class="grid-square square-disabled" data-position="${i}">
    <span class="square-content">${i}</span>
  </div>`);
  }
  playingGrid.innerHTML = gridSquaresHTML.join("");
  const gridSquares = document.querySelectorAll(".grid-square");
  gridSquares.forEach((sqr) => {
    sqr.addEventListener("click", markBoard);
  });
  return { playingGrid, gridSquares };
})();
// Player object factory that creates Player objects
const Player = (id) => {
  let score = 0;
  return { id, score };
};
/*
- board is an array that represents tictactoe board with positions or indices. A 0 value means no one has played that spot yet, hence the board always starts out with all zeroes
to indicate that all spaces are free to be played:
{
  0, 1, 2,
  3, 4, 5,
  6, 7, 8
}
- currentPlayer is the player who's turn it currently is
*/
let gameInfo = (() => {
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let playerX = Player("x");
  let playerO = Player("o");
  let currentPlayer = playerX;
  let gameResult = {
    finished: false,
    is_tie: true,
  };
  return { board, playerX, playerO, currentPlayer, gameResult };
})();
// Function toggles all of the grid squares, if parameter is true then we enable all of the squares, else disable all of them.
function toggleGridSquares(is_enabled) {
  if (is_enabled) {
    gridInfo.gridSquares.forEach((sqr) => {
      sqr.classList.remove("square-disabled");
    });
  } else {
    gridInfo.gridSquares.forEach((sqr) => {
      sqr.classList.add("square-disabled");
    });
  }
}
// Appears and disables the score elements, elements parameter are the score elements, is_visible will be a boolean that decides if we show the score elements
function toggleScoreElements(is_visible) {
  if (is_visible) {
    scoreElements.forEach((scoreEl) => {
      scoreEl.classList.remove("content-hidden");
    });
  } else {
    scoreElements.forEach((scoreEl) => {
      scoreEl.classList.add("content-hidden");
    });
  }
}
// Updates the text contained by the two score elements to reflect the scores of the players in the gameInfo object
function updateScoreElements() {
  scoreElements.forEach((scoreEl) => {
    if (scoreEl.dataset.id === "x") {
      scoreEl.textContent = gameInfo.playerX.score;
    } else {
      scoreEl.textContent = gameInfo.playerO.score;
    }
  });
}
// Function displays alerts, message parameter is the text that will be alerted to the player
function displayAlert(message) {
  alertEl.textContent = message;
  alertEl.classList.remove("content-hidden");
  setTimeout(() => {
    alertEl.classList.add("content-hidden");
  }, 3000);
}
// Function clears the HTML grid of all player marks
function clearGrid() {
  // First loop adds a class that makes it invisible while second loop clears the text in the grid item
  gridInfo.gridSquares.forEach((sqr) => {
    const squareContentEl = sqr.querySelector(".square-content");
    squareContentEl.classList.remove("show-square-content"); // remove class for a smooth disappearance
    squareContentEl.textContent = "";
  });
}
// Function checks the board array in the gameInfo object to see if someone has won the game
// Returns gameResult object in the gameInfo object
function checkGame() {
  let emptySpots;
  const board = gameInfo.board;

  // Checks the rows/horizontal
  for (let i = 0; i < 9; i += 3) {
    if (board[i] !== 0) {
      if (board[i] === board[i + 1] && board[i] === board[i + 2]) {
        gameInfo.gameResult.finished = true;
        gameInfo.gameResult.is_tie = false;
      }
    }
  }
  // Checks columns/vertical
  for (let i = 0; i < 3; i++) {
    if (board[i] !== 0) {
      if (board[i] === board[i + 3] && board[i] === board[i + 6]) {
        gameInfo.gameResult.finished = true;
        gameInfo.gameResult.is_tie = false;
      }
    }
  }
  // Checks diagonal from top left to bottom right
  if (board[0] !== 0) {
    if (board[0] === board[4] && board[4] === board[8]) {
      gameInfo.gameResult.finished = true;
      gameInfo.gameResult.is_tie = false;
    }
  }
  // Checks diagonal from top right to bottom left
  if (board[2] !== 0) {
    if (board[2] === board[4] && board[4] === board[6]) {
      gameInfo.gameResult.finished = true;
      gameInfo.gameResult.is_tie = false;
    }
  }
  // Gets all of the empty spots left. If there are no empty spots then the game is finished. This helps handles ties, as the above conditionals only activate on wins, but if no one wins
  // we can check that there are no spots left, and so we can say the game has finished. This leaves the tie boolean as true, hence a tie game.
  emptySpots = board.filter((sqr) => {
    return sqr === 0;
  });
  if (emptySpots.length === 0) {
    gameInfo.gameResult.finished = true;
  }
  return gameInfo.gameResult;
}
// Gets the index (position on the grid that player wants to hit).
// If the position on the grid has value 0, then that spot hasn't been marked yet, which makes it a valid play
// Else if the position doesn't have value 0, that means it has either value 'x' or 'o', which means it's already been played so it is invalid
function validateMove(index) {
  let is_valid = false;
  if (gameInfo.board[index] === 0) {
    is_valid = true;
  }
  return is_valid;
}
// This function changes the current player visually and in the logic; player parameter represents the player that just marked the board, so it will be the turn of the other player
function changePlayerTurn(player) {
  if (player.id === "x") {
    gameInfo.currentPlayer = gameInfo.playerO;
    playerXEl.classList.remove("highlight-element");
    playerOEl.classList.add("highlight-element");
  } else {
    gameInfo.currentPlayer = gameInfo.playerX;
    playerXEl.classList.add("highlight-element");
    playerOEl.classList.remove("highlight-element");
  }
}
// Function is responsible for marking the board when the players click on various sections of the grid, event is needed to get the part of the grid that was clicked
function markBoard(e) {
  const { currentPlayer } = gameInfo;
  const currentSquare = e.currentTarget;
  const squareContentEl = currentSquare.querySelector(".square-content");
  const squareIndex = currentSquare.dataset.position;

  // If the move is valid
  if (validateMove(squareIndex)) {
    squareContentEl.textContent = currentPlayer.id; // puts mark on the dom element
    gameInfo.board[squareIndex] = currentPlayer.id; // marks the board array
    squareContentEl.classList.add("show-square-content"); // shows the mark and disables square
    currentSquare.classList.add("square-disabled");

    const result = checkGame(); // Check the game state to see if anyone won yet or if the game has finished
    if (result.finished) {
      endGame(currentPlayer, result.is_tie);
    } else {
      changePlayerTurn(currentPlayer);
    }
  } else {
    // If the move that was played isn't valid, then display an alert
    displayAlert("Hey that move was invalid! Obviously that spot was already taken.");
  }
}
// Function is called to display end message
// Player is the player who won the game
function endGame(player, is_tie_game) {
  // If it's a tie then show the message that it's a tie, else do other logic
  if (is_tie_game) {
    console.log(`Tie game triggered, tie game boolean: ${is_tie_game}`);
  } else {
    // Increase the score of the winning player
    if (player.id === "x") {
      gameInfo.playerX.score += 1;
    } else {
      gameInfo.playerO.score += 1;
    }
  }

  // update the text for the scores
  updateScoreElements();

  // Partially reset the game so that the players can play another round
  // Disables the grid squares
  toggleGridSquares(false);

  // Reset the game info that affects the rounds
  setupNewRound();
}

function setupNewRound() {
  // Clears round data from the past
  gameInfo.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  gameInfo.currentPlayer = gameInfo.playerX;
  gameInfo.gameResult.finished = false;
  gameInfo.gameResult.is_tie = true;

  // Sets up the button for a new round visually and makes it interactive
  beginGameBtn.classList.remove("highlight-element");
  beginGameBtn.textContent = "Start Game";
  beginGameBtn.disabled = false;
}

/*
- function should know who the current player is by accessing the currentPlayer property
*/
function startGame() {
  // Indicates the begin game element has been clicked
  beginGameBtn.classList.add("highlight-element");
  beginGameBtn.textContent = "Game Ongoing";
  playerXEl.classList.add("highlight-element"); //Starts with player X being indicated as the one who's starting the game
  playerOEl.classList.remove("highlight-element");

  // Shows the scores:
  toggleScoreElements(true);
  //Visually clear the board so that information from the last game doesn't persist
  clearGrid();
  // Enable the grid squares
  toggleGridSquares(true);
  // At the end we disable the button
  beginGameBtn.disabled = true;
}

beginGameBtn.addEventListener("click", startGame);

// Let's say the resetGameBtn can be clicked at anytime, not just at the end of a round
/*
- Unindicates the players
- Deletes round data and sets up a new round
- Hides player scores and resets them
- Makes the grid squares not interactive
- Clears the grid of past marks
*/
resetGameBtn.addEventListener("click", () => {
  playerXEl.classList.remove("highlight-element");
  playerOEl.classList.remove("highlight-element");
  setupNewRound();
  toggleScoreElements(false);
  gameInfo.playerX.score = 0;
  gameInfo.playerO.score = 0;
  updateScoreElements();
  toggleGridSquares(false);
  clearGrid();
});
