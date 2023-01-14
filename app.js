/*
- Store gameboard as an array inside Gameboard object. Players are also going to be stored
in objects, and have an object to control hte flow of the game itself.

- Have a little global code as possible. If you only need one of something such as 
a gameboard, or displayController, then use a module. If you need multiple of something,
such as players, create them with factories

- Write a function that renders the contents of the gameboard array, filling the 
arrays with things such as x's and o's
- Writes functions that let players add marks to specific spots on the board, then link
it to the DOM, letting the players click on spots on the boards. Don't forget to check
if a spot on the board was already used.

- Write function or logic that checks when the game is over. Checks for when it's a 3 in a row (win) or 
a tie
- have a button to already start/restart the game
- Add a display element that congratulates the winning player 

- Optional Challenge: Create an AI so that hte player can play against computer
1. Start with having it make simple moves
2. Work on making it smart, you can create an AI using minimix algorithm. You should google 
this one.
*/

// Extra DOM Elements
const playerXEl = document.getElementById("player-x");
const playerOEl = document.getElementById("player-o");
const scoreElements = document.querySelectorAll(".player-score-el");
const beginGameBtn = document.getElementById("begin-game-btn");
const alertEl = document.querySelector(".alert-el");

/*
- Function creates and renders the tic-tac-toe squaresk, and adds event listeners for them
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

// Player object factory
const Player = (id) => {
  let score = 0;
  return { id, score };
};

let gameInfo = (() => {
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let playerX = Player("x");
  let playerO = Player("o");
  let currentPlayer = playerX;
  const checkGame = () => {
    let gameResult = {
      finished: false,
      is_tie: true,
    };
    let remainingSpots;

    // Horizontal row check to see if a player has won
    // board[i] !== 0, makes sure we are only checking when rows (or columns) have been marked by players
    for (let i = 0; i < 9; i += 3) {
      if (board[i] !== 0) {
        if (board[i] === board[i + 1] && board[i] === board[i + 2]) {
          gameResult.finished = true;
          gameResult.is_tie = false;
        }
      }
    }

    // Vertical/column check to see if a player has won
    for (let i = 0; i < 3; i++) {
      if (board[i] !== 0) {
        if (board[i] === board[i + 3] && board[i] === board[i + 6]) {
          gameResult.finished = true;
          gameResult.is_tie = false;
        }
      }
    }

    // Checking the diagonals to see if a player has won
    // From top left to bottom right
    if (board[0] !== 0) {
      if (board[0] === board[4] && board[4] === board[8]) {
        gameResult.finished = true;
        gameResult.is_tie = false;
      }
    } else if (board[2] !== 0) {
      if (board[2] === board[4] && board[4] === board[6]) {
        gameResult.finished = true;
        gameResult.is_tie = false;
      }
    }

    // Checks the remaining spots, if there are 0 unused spots left, that means the game
    // is finished and over, BUT the game is a tie, hence gameResult.is_tie is not changed to false
    remainingSpots = board.filter((sqr) => {
      return sqr === 0;
    });

    // If there are no remaining spots left, then the game is finished, but it isn't a tie
    // This is in contrast to the above conditionals that test for a win
    if (remainingSpots.length === 0) {
      gameResult.finished = true;
    }

    return gameResult;
  };

  return { board, playerX, playerO, currentPlayer, checkGame };
})();

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

// This function changes the current player visually and in the logic
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

function markBoard(e) {
  const { currentPlayer } = gameInfo;
  const currentSquare = e.currentTarget;
  const squareContentEl = currentSquare.querySelector(".square-content");
  const squareIndex = currentSquare.dataset.position;

  // If the move is valid then mark hte board then switch turns
  if (validateMove(squareIndex)) {
    // Mark the board, then add the class so that the mark appears
    // Then disable the clicked square on the grid because it's already been marked
    squareContentEl.textContent = currentPlayer.id;
    squareContentEl.classList.add("show-square-content");
    currentSquare.classList.add("square-disabled");

    // Put player mark on the corresponding position in the array
    gameInfo.board[squareIndex] = currentPlayer.id;

    // Check the game state to see if anyone won yet or if the game has finished
    const result = gameInfo.checkGame();

    if (result.finished) {
      endGame(currentPlayer, result.is_tie);
    } else {
      // If the game isnt finished then
      // Call a function to make it so the it's the other player's turn
      console.log("Changed player triggered");
      changePlayerTurn(currentPlayer);
    }
  } else {
    displayAlert("Hey that move was invalid! Obviously that spot was already taken.");
  }
}

// Function displays alerts
function displayAlert(message) {
  alertEl.textContent = message;
  alertEl.classList.remove("content-hidden");
  setTimeout(() => {
    alertEl.classList.add("content-hidden");
  }, 3000);
}

// Function is called to display end message
function endGame(player, is_tie_game) {
  let message = "";
  if (is_tie_game) {
    console.log(`Tie game triggered, tie game boolean: ${is_tie_game}`);
  } else {
    console.log(`Player ${player.id} won the game!`);
  }

  // Reset the board array since the game is over, in preparation for the next game
  // Make current player x so that x has the first turn on the first one
  gameInfo.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  gameInfo.currentPlayer = gameInfo.playerX;

  // Have a window that shows a winning message, obviously need to be able to exit out of the
  // that window
  // At the end we want to reset the start button, reset the text and

  beginGameBtn.classList.remove("highlight-element");
  beginGameBtn.textContent = "Start Game";
}

/*
- function should know who the current player is by accessing the currentPlayer property
*/
function startGame() {
  beginGameBtn.classList.add("highlight-element");
  beginGameBtn.textContent = "Game Ongoing";
  playerXEl.classList.add("highlight-element");

  // Visually clear the board so that information from the last game doesn't persist
  gridInfo.gridSquares.forEach((sqr) => {
    const squareContentEl = sqr.document.querySelector(".");
    squareContentEl.textContent = "";
  });

  // Shows the scores:
  scoreElements.forEach((scoreEl) => {
    scoreEl.classList.remove("content-hidden");
  });

  // Make the squares clickable
  gridInfo.gridSquares.forEach((sqr) => {
    sqr.classList.remove("square-disabled");
  });
}

beginGameBtn.addEventListener("click", startGame);
