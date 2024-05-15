/*
Class: CS290 Web Development
Assignment: Homework 5 JavaScript Game
Student Name: Finlay Christ
Students In Group: 1
Date: 05/04/2024
*/

// Define some constants for settings.
const numCount = 5;
const numMin = 1;
const numMax = 9;

let gameData = {};
let highscore = 0;

// Event handlers for CTRL+Z and CTRL+Y.
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "z") {
        action("undo");
    } else if (event.ctrlKey && event.key === "y") {
        action("redo");
    }
});

// After the DOM finishes loading initialize the game.
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", newGame);
} else {
    newGame();
}

// Run when the player preforms an action. Intent is a string representing which action was preformed.
// Intent can be one of the following.
// +, -, *, %, =, undo, redo, newgame, or a number.
function action(intent) {
    if(intent === "newgame") {
        newGame();
    }
    
    if (gameData.won) {
        return; // Don't let the player keep playing once they have won.
    }

    if (intent === "undo") {
        historyUndo();
    } else if (intent === "redo") {
        historyRedo();
    } else {
        let gameState = gameData.history[gameData.historyOffset];

        if (gameState.equation.length === 0 || gameState.equation.length === 2) {
            if (typeof intent === "number") {
                historySave();
                let gameState = gameData.history[gameData.historyOffset];

                gameState.equation.push(gameState.numbers[intent]);
                gameState.numbers.splice(intent, 1);
            } else {
                console.log("Expected number. Got invalid intent " + intent);
            }
        } else if (gameState.equation.length === 1) {
            if ("+-*%".includes(intent)) {
                historySave();
                let gameState = gameData.history[gameData.historyOffset];

                gameState.equation.push(intent);
            } else {
                console.log("Expected operation. Got invalid intent " + intent);
            }
        } else {
            if (intent === "equals") {
                historySave();
                let gameState = gameData.history[gameData.historyOffset];

                // Get the current equation in the text box as a string.
                let equationStr = "";
                for (let i = 0; i < gameState.equation.length; i++) {
                    equationStr += gameState.equation[i];
                }

                // Here I use math.evaluate from math.js to to calculate the value of the expression.
                // I could use the built in eval() function however this is really unsafe and generally frowned upon.
                // In an attempt to follow good coding practices I chose to avoid it.
                let value = math.evaluate(equationStr);

                // Add this expression to the log and replace the current expression with the new value.
                gameState.equation.push("=");
                gameState.equation.push(value);
                let equationCopy = JSON.parse(JSON.stringify(gameState.equation));
                gameState.log.push(equationCopy);
                gameState.equation = [value];

                // If we used up the last number and the value of this expression was the goal then the player won!
                if (gameState.numbers.length === 0 && value === gameData.goal) {
                    highscore++;
                    gameData.won = true;
                }
            } else {
                console.log("Expected equals. Got invalid intent " + intent);
            }
        }
    }

    updateBoard();
}

// Redoes one action.
function historyRedo() {
    gameData.historyOffset++;
    if (gameData.historyOffset >= gameData.history.length) {
        gameData.historyOffset = gameData.history.length - 1;
    }
    updateBoard();
}

// Undoes one action.
function historyUndo() {
    gameData.historyOffset--;
    if (gameData.historyOffset < 0) {
        gameData.historyOffset = 0;
    }
    updateBoard();
}

// Saves the current state as a place which can be undone to.
function historySave() {
    if (gameData.historyOffset !== gameData.history.length - 1) {
        gameData.history.splice(gameData.historyOffset + 1, gameData.history.length - (gameData.historyOffset + 1));
        gameData.historyOffset = gameData.history.length - 1;
    }

    let gameState = gameData.history[gameData.historyOffset];
    let gameStateClone = JSON.parse(JSON.stringify(gameState));
    gameData.history.push(gameStateClone);
    gameData.historyOffset++;
}

// Initializes game data and generates a possible challenge.
function newGame() {
    const operations = ["+", "-", "*", "%"];

    // Initialize a new gameData and gameState.
    gameData = { won: false, goal: 0, history: [], solution: "", historyOffset: 0 };
    let gameState = { equation: [], numbers: [], log: [] };

    // Generate a random number as our first number.
    let firstNum = randomRange(numMin, numMax);
    gameState.numbers.push(firstNum);
    gameData.solution = firstNum;

    // Generate other numbers and operations to increase complexity of solution. 
    for (let i = 0; i < numCount - 1; i++) {
        let operation = operations[randomRange(0, operations.length - 1)];
        let num = randomRange(numMin, numMax);
        gameData.solution = "(" + gameData.solution + ") " + operation + " " + num;
        gameState.numbers.push(num);
    }

    // Calculate the value of the random operations we did above as our solution.
    gameData.goal = math.evaluate(gameData.solution);

    // Randomly shuffle the numbers so they are not in the order they must be used.
    for (i = 0; i < gameState.numbers.length; i++) {
        let j = randomRange(i, gameState.numbers.length - 1);
        let temp = gameState.numbers[i];
        gameState.numbers[i] = gameState.numbers[j];
        gameState.numbers[j] = temp;
    }

    gameData.history.push(gameState);

    console.log("Solution: " + gameData.solution);

    updateBoard();
}

// Returns a random integer x where x >= min and x <= max.
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Deletes all tiles from the board. Except for the operations
function clearBoard() {
    let equationElement = document.querySelector("#equation");
    while (equationElement.children.length > 0) {
        equationElement.children[0].remove();
    }

    let numbersElement = document.querySelector("#numbers");
    while (numbersElement.children.length > 0) {
        numbersElement.children[0].remove();
    }

    let logContainer = document.querySelector("#log");
    while (logContainer.children.length > 0) {
        logContainer.children[0].remove();
    }
}

// Clears the board then spawns tiles to show the current game state.
function updateBoard() {
    clearBoard();

    let highscoreElement = document.querySelector("#highscore-number");
    highscoreElement.textContent = highscore;

    let goalNumberElement = document.querySelector("#goal-number");
    goalNumberElement.textContent = gameData.goal;

    let gameState = gameData.history[gameData.historyOffset];

    let equationElement = document.querySelector("#equation");
    for (let i = 0; i < gameState.equation.length; i++) {
        addTile(equationElement, gameState.equation[i]);
    }

    let numbersElement = document.querySelector("#numbers");
    for (let i = 0; i < gameState.numbers.length; i++) {
        addTile(numbersElement, gameState.numbers[i], i);
    }

    let logContainer = document.querySelector("#log");
    for (let i = gameState.log.length - 1; i >= 0; i--) {
        let logEquation = gameState.log[i];
        let lineBreak = document.createElement("br");
        let logElement = document.createElement("div");
        logElement.classList.add("tile-container");
        for (let j = 0; j < logEquation.length; j++) {
            addTile(logElement, logEquation[j]);
        }
        logContainer.appendChild(lineBreak);
        logContainer.appendChild(logElement);
    }

    let popupElement = document.querySelector("#popup-container");
    if (gameData.won) {
        document.body.style.overflow = "hidden";
        popupElement.style.removeProperty("display");
    } else {
        document.body.style.removeProperty("overflow");
        popupElement.style.display = "none";
    }
}

// Adds a new tile as a child of tileContainer with a specified text.
function addTile(container, text, actionIntent = undefined) {
    let tile = document.createElement("div");
    tile.classList.add("tile");

    if (actionIntent !== undefined) {
        tile.onclick = action.bind(null, actionIntent);
        tile.classList.add("interactive-tile");
    }

    let tileText = document.createElement("p");
    tileText.classList.add("tile-text");
    tileText.textContent = text;

    tile.appendChild(tileText);
    container.appendChild(tile);
}