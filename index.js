//variables
let gameboardDiv = document.getElementById("gameboard");
let buttonDiv = document.getElementById("gamebutton");
let winDiv = document.getElementById("winoutput");
let playerTurnDiv = document.getElementById("playerturn");
let scoreDiv = document.getElementById("scoreboard");
let gamePlayArr = [];
let outputCount = 0;
let boardSize = 5;
const maxOutputCount = boardSize * boardSize;
let winStringX = "XXX";
let winStringO = "OOO";
let winAlert;
let playerXName;
let playerOName;
let xScore = 0;
let oScore = 0;
let randomMoveTimeout = 0;

//initialise game board
//1. initialise game play array that contains empty string
//2. creates game play board display via DOM
//3. adds event listener to each grid element of board
function initGameBoard() {
  for (let i = 0; i < boardSize; i++) {
    gamePlayArr.push([]);
    for (let x = 0; x < boardSize; x++) {
      gamePlayArr.push([]);
      let newDiv = document.createElement("div");
      newDiv.className = "square";
      newDiv.textContent = " ";
      newDiv.id = i + "-" + x;
      gameboardDiv.appendChild(newDiv);
      console.log("init game board");
      newDiv.addEventListener("click", onClick);
    }
  }
  startGameButtonErase();
}

function onClick(event) {
  //does not let you re-click squares or click squares before game start OR after 1 click OR after there is a win
  if (
    event.target.textContent !== " " ||
    buttonDiv.className === "normal" ||
    winAlert
  ) {
    return;
  }
  let clickedIndex = event.target.id.split("-");
  // console.log(clickedIndex[1]);
  let xCoor = clickedIndex[0];
  let yCoor = clickedIndex[1];
  outputCount++;
  console.log(outputCount);
  //depending on number of turns, display X or O
  if (outputCount % 2 !== 0) {
    gamePlayArr[xCoor][yCoor] = "X";
    event.target.textContent = "X";
    playerTurnDiv.textContent = playerOName + "'s turn: O";
  } else {
    gamePlayArr[xCoor][yCoor] = "O";
    event.target.textContent = "O";
    playerTurnDiv.textContent = playerXName + "'s turn: X";
  }
  checkWin();
  if (randomMoveTimeout !== 0) {
    clearTimeout(randomMoveTimeout);
  }
  if (winAlert === undefined) {
    randomMoveTimeout = setTimeout(randomMove, 5000);
  }
}

function startGameButtonErase() {
  // console.log(playerOName);
  // console.log(playerXName);
  buttonDiv.addEventListener("click", function(event) {
    let xNameValue = document.getElementById("playerxname").value;
    let oNameValue = document.getElementById("playeroname").value;
    if (xNameValue !== "" && oNameValue !== "") {
      playerXName = xNameValue;
      playerOName = oNameValue;
      // console.log(playerOName);
      // console.log(playerXName);
      buttonDiv.className = "hidden";
      playerTurnDiv.textContent = playerXName + "'s turn: X";
      if (randomMoveTimeout !== 0) {
        clearTimeout(randomMoveTimeout);
      }
      randomMoveTimeout = setTimeout(randomMove, 5000);
    }
  });
}

function checkWin() {
  let XWin = playerXName + " has won the game!";
  let OWin = playerOName + " has won the game!";
  //check rows
  for (let i = 0; i < boardSize; i++) {
    let stringRow = gamePlayArr[i].join("");
    // console.log(stringRow);
    if (outputCount % 2 !== 0 && stringRow.includes(winStringX)) {
      winAlert = XWin;
      xScore++;
    } else if (outputCount % 2 === 0 && stringRow.includes(winStringO)) {
      winAlert = OWin;
      oScore++;
    }
  }
  //check columns
  for (let y = 0; y < boardSize; y++) {
    let stringCol = "";
    for (let x = 0; x < boardSize; x++) {
      stringCol += gamePlayArr[x][y];
      // console.log(stringCol);
      if (outputCount % 2 !== 0 && stringCol.includes(winStringX)) {
        winAlert = XWin;
        xScore++;
      } else if (outputCount % 2 === 0 && stringCol.includes(winStringO)) {
        winAlert = OWin;
        oScore++;
      }
    }
  }
  //check diagonal up and down
  let stringDiagUp = "";
  let stringDiagDown = "";
  let xCo = boardSize - 1;
  let yCo = 0;
  for (let z = 0; z < boardSize; z++) {
    stringDiagUp += gamePlayArr[xCo][yCo];
    stringDiagDown += gamePlayArr[yCo][yCo];
    xCo--;
    yCo++;
    // console.log(stringDiagDown);
    // console.log(stringDiagUp);
    if (
      outputCount % 2 !== 0 &&
      (stringDiagUp.includes(winStringX) || stringDiagDown.includes(winStringX))
    ) {
      winAlert = XWin;
      xScore++;
    } else if (
      outputCount % 2 === 0 &&
      (stringDiagUp.includes(winStringO) || stringDiagDown.includes(winStringO))
    ) {
      winAlert = OWin;
      oScore++;
    }
  }
  // console.log(winAlert);
  displayWinAlert();
}

function displayWinAlert() {
  let draw = "It is a draw!";
  let newP = document.createElement("p");
  if (winAlert === undefined && (outputCount === maxOutputCount)) {
    winAlert = draw;
  }
  newP.textContent = winAlert;
  winDiv.appendChild(newP);
  scoreDiv.textContent =
    "SCORE: [" +
    playerXName +
    " : " +
    playerOName +
    "   |   " +
    xScore +
    " : " +
    oScore +
    "]";
  if (winAlert) {
    restartGame();
  }
}

function restartGame() {
  buttonDiv.className = "normal";
  buttonDiv.addEventListener("click", function(event) {
    gameboardDiv.innerHTML = "";
    winDiv.innerHTML = "";
    gamePlayArr = [];
    outputCount = 0;
    winAlert = undefined;
    initGameBoard();
  });
}




function randomMove() {
  let emptyIdArr = [];
  let emptyIds = [];
  let squareArr = gameboardDiv.getElementsByClassName("square");
  for (let i = 0; i < squareArr.length; i++) {
    if ((squareArr[i].textContent === " ")) {
      emptyIdArr.push(squareArr[i].id.split("-"));
      emptyIds.push(squareArr[i].id);
    }
  }
  console.log(emptyIdArr);
  console.log(emptyIds);
  let randomNum = Math.floor(Math.random() * emptyIdArr.length);
  console.log("random number: " + randomNum);
  outputCount++;
  console.log(outputCount);
  if (outputCount % 2 !== 0) {
    gamePlayArr[emptyIdArr[randomNum][0]][emptyIdArr[randomNum][1]] = "X";
    //document.getElementById(emptyIds[randomNum]).textContent = "X";
    playerTurnDiv.textContent = playerOName + "'s turn: O";
  } else {
    gamePlayArr[emptyIdArr[randomNum][0]][emptyIdArr[randomNum][1]] = "O";
    //document.getElementById(emptyIds[randomNum]).textContent = "O";
    playerTurnDiv.textContent = playerXName + "'s turn: X";
  }
  console.log(gamePlayArr);
  //print game in DOM again
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      let squareId = x + "-" + y;
      console.log(squareId);
      // console.log(document.getElementById(squareId));
      document.getElementById(squareId).textContent = gamePlayArr[x][y];
    }
  }
  checkWin();
  if (randomMoveTimeout !== 0) {
    clearTimeout(randomMoveTimeout);
  }
  if (winAlert === undefined) {
    randomMoveTimeout = setTimeout(randomMove, 5000);
  }
}

initGameBoard();