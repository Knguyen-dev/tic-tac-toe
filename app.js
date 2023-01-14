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

const playerElements = document.querySelectorAll(".player-el");
const scoreElements = document.querySelectorAll(".player-score-el");
const gridSquares = document.querySelectorAll(".grid-square");
const beginGameBtn = document.querySelector(".begin-game-btn");

const Player = (ID) => {
  let score = 0;
  return { ID, score };
};

let gameBoard = (() => {
  let currentPlayer = "x";
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  return { currentPlayer, board };
})();

/*
- function should know who the current player is by accessing the currentPlayer property
*/

function startGame() {}

/*
- Mark the board 



*/
function markBoard(e) {
  console.log(gameBoard.currentPlayer);
}

beginGameBtn.addEventListener("click", startGame);

/*
- Create the players, whether they are x or o.

- Start the game with the start game button:
- Calls startGame:
1. creates click event listeners for all of the grid squares, link to function markBoard
2. visually indicate that it's player x's turn; (do this with a function)
3. Show the scores of the players 
*/
