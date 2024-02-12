// VARIABLES AND DECLARATIONS
//the board or div that houses the board
const gameUI = document.querySelector("#gameUI");
//var that displays the size of the board
const boardRes = document.getElementById("boardSize");
//board and ui vars
let boardSize = 16;
let buttonPressed = false; //handle click and drag to draw

// COLOR TILE BUTTONS
// TODO VERY VERY DRY CODE NEED TO OPTIMIZE!
const redBtn = document.getElementById("red");
redBtn.addEventListener("click", () => {
    clearSelected();
    redBtn.setAttribute("style", `border: 3px solid black;`);
    currentColor = "red";
});
const yellowBtn = document.getElementById("yellow");
yellowBtn.addEventListener("click", () => {
    clearSelected();
    yellowBtn.setAttribute("style", `border: 3px solid black;`);
    currentColor = "yellow";
});
const greenBtn = document.getElementById("green");
greenBtn.addEventListener("click", () => {
    clearSelected();
    greenBtn.setAttribute("style", `border: 3px solid black;`);
    currentColor = "green";
});
const blueBtn = document.getElementById("blue");
blueBtn.addEventListener("click", () => {
    currentColor = "blue";
    clearSelected();
    blueBtn.setAttribute("style", `border: 3px solid black;`);
});
const darkBtn = document.getElementById("dark");
darkBtn.addEventListener("click", () => {
    currentColor = "dark";
    clearSelected();
    darkBtn.setAttribute("style", `border: 3px solid black;`);
});
const whiteBtn = document.getElementById("white");
whiteBtn.addEventListener("click", () => {
    currentColor = "white";
    clearSelected();
    whiteBtn.setAttribute("style", `border: 3px solid black;`);
});

//BRUSH/TOOL BUTTONS
//THESE ARE MUTUALLY EXCLUSIVE TO COLOR TILES
//EXCEPT FOR ERASER AND RAINBOW BUTTON
const eraserBtn = document.getElementById("eraser");
eraserBtn.addEventListener("click", () => {
    currentColor = "white";
    clearSelected();
    eraserBtn.setAttribute("style", `border: 3px solid black;`);
});

const rainbowBtn = document.getElementById("rainbow");
rainbowBtn.addEventListener("click", () => {
    currentColor = "rainbow";
    clearSelected();
    rainbowBtn.setAttribute("style", `border: 3px solid black;`);
});

const bucketFillBtn = document.getElementById("bucketFill");
bucketFillBtn.addEventListener("click", () => {
    clearSelected();
    //reset then set value as true lol
    bucketFill = true;
    bucketFillBtn.setAttribute(
        "style",
        `border: 3px solid ${getCurrentColor()};`
    );
});

let mirrorY = false;
const mirrorYaxisBtn = document.getElementById("mirrorY");
mirrorYaxisBtn.addEventListener("click", () => {
    if (mirrorY === false) {
        mirrorY = true;
        console.log(mirrorY);
        mirrorYaxisBtn.setAttribute("style", `border: 3px solid black;`);
    } else if (mirrorY === true) {
        mirrorY = false;
        console.log(mirrorY);
        mirrorYaxisBtn.removeAttribute("style");
    }
});

let mirrorX = false;
const mirrorXaxisBtn = document.getElementById("mirrorX");
mirrorXaxisBtn.addEventListener("click", () => {
    if (mirrorX == false) {
        mirrorX = !mirrorX;
        mirrorXaxisBtn.setAttribute("style", `border: 3px solid black;`);
    } else if (mirrorX == true) {
        mirrorX = !mirrorX;
        mirrorXaxisBtn.removeAttribute("style");
    }
});

const resizeButton = document.getElementById("size");
resizeButton.addEventListener("click", () => resizeBoard());

const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", () => {
    board.remove();
    createBoard(boardSize);
});
//the screenshot button and its function
const cameraBtn = document.getElementById("camera");
cameraBtn.addEventListener("click", () => downloadImage());

// logic to handle mouse holds for drawing the pixels
window.addEventListener("mousedown", () => {
    buttonPressed = true;
    // console.log(event.button)
});
window.addEventListener("mouseup", () => {
    buttonPressed = false;
    // console.log(event.button)
});

let currentColor = "white";
let bucketFill = false;

const tileRows = []; //array
const tileCols = [];

function createBoard(boardSize) {
    boardRes.textContent = `${boardSize} X ${boardSize}`;
    const board = document.createElement("div");
    board.setAttribute("id", "board");
    gameUI.appendChild(board);
    for (let i = 1; i < boardSize; i++) {
        tileRows[i] = document.createElement("div");
        tileRows[i].setAttribute("id", "tileRow");
        board.appendChild(tileRows[i]); //adding divs to the board!!!
        for (let j = 1; j < boardSize; j++) {
            tileCols[j] = document.createElement("div");
            //setting up tile ids
            if (i < 10 && j < 10) tileCols[j].setAttribute("id", ` ${i}, ${j}`);
            else if (i < 10 && j >= 10) tileCols[j].setAttribute("id", ` ${i},${j}`);
            else if (j < 10 && i >= 10) tileCols[j].setAttribute("id", `${i}, ${j}`);
            else if (j >= 10 && i >= 10) tileCols[j].setAttribute("id", `${i},${j}`);
            //finish tile id
            tileCols[j].setAttribute("class", `tile`);
            tileCols[j].setAttribute("style", `background-color: #ffffff;`);
            tileRows[i].appendChild(tileCols[j]);
        }
    }
    whiteBtn.setAttribute("style", `border: 3px solid black;`);
    addEventListeners();
}
createBoard(boardSize); //game init

// button that resizes the board
// TODO to be replaced by a slider later on
function resizeBoard() {
    let valid = false;
    boardSize = prompt("Enter the desired resolution (1<=x<=50)");
    if (boardSize >= 1 && boardSize <= 50) valid = true;
    else
        while (!valid) {
            boardSize = prompt("Invalid board size! please enter a valid resolution");
            if (boardSize >= 1 && boardSize <= 50) valid = true;
        }

    board.remove();
    createBoard(boardSize);
}

function addEventListeners() {
    const tilesNodeList = document.querySelectorAll(".tile");
    for (const tile of tilesNodeList) {
        let id = tile.getAttribute("id");
        tile.addEventListener("mousedown", () => changeColorOnce(id));
        tile.addEventListener("mouseover", () => changeColor(id));
    }
}

function getCurrentColor() {
    if (currentColor === "rainbow") return rainbow();
    else if (currentColor === "red") return "#ef476f";
    else if (currentColor === "yellow") return "#ffd166";
    else if (currentColor === "green") return "#06d6a0";
    else if (currentColor === "blue") return "#118ab2";
    else if (currentColor === "dark") return "#073b4c";
    else if (currentColor === "white") return "#ffffff";
}

//coloring functions
//also handles case of floodFilling algorithm
function changeColorOnce(id) {
    if (bucketFill) {
        let colorToBucketFillOver = document
            .getElementById(id)
            .getAttribute("style")
            .substring(18)
            .substring(0, 7);
        //splitting id into x and t comps for floodFill
        let idComponents = String(id).split(",");
        let id_x = parseInt(idComponents[0]);
        let id_y = parseInt(idComponents[1]);
        //we get the current color of the tile as well as its id and
        // pass it to the floodFill function for coloring
        floodFill(id, id_x, id_y, colorToBucketFillOver);
    } else {
        let recoloredTile = document.getElementById(id);
        recoloredTile.setAttribute(
            "style",
            `background-color: ${getCurrentColor()};`
        );
        if (mirrorY) mirrorYplot(id);
        // console.log(`${id} color changed! `)
    }
}

function mirrorYplot(id) {
    let axisOfReflection;
    if (boardSize % 2 != 0) {
        console.log(id)
        axisOfReflection = parseInt(boardSize / 2);
        console.log(axisOfReflection)
        let idComponents = String(id).split(",");
        let id_x = parseInt(idComponents[0]);
        let id_y = parseInt(idComponents[1]);
        console.log(convertToValidID(id_x + (axisOfReflection - id_x), id_y))

        let recoloredTile = document.getElementById(convertToValidID(id_x + (axisOfReflection - id_x), id_y));
        recoloredTile.setAttribute("style", `background-color: ${getCurrentColor()};`);
    }
}

function changeColor(id) {
    if (buttonPressed) {
        let recoloredTile = document.getElementById(id);
        recoloredTile.setAttribute(
            "style",
            `background-color: ${getCurrentColor()};`
        );
        // console.log(`${id}color changed! `)
    }
}

//rainbow coloring function
function rainbow() {
    let colors = [
        "#ef476f",
        "#ffd166",
        "#06d6a0",
        "#118ab2",
        "#073b4c",
        "#ffffff",
    ];
    var color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}

function checkValidForFloodFill(id_x, id_y) {
    if (id_x > 0 && id_x < boardSize && id_y > 0 && id_y < boardSize) {
        // console.log(`Can recolor! ${id_x},${id_y}`)
        return true;
    } else {
        // console.log(`Cannot recolor! ${id_x},${id_y}`)
        return false;
    }
}

function convertToValidID(id_x, id_y) {
    let convertedId;
    if (id_x < 10 && id_y < 10) convertedId = " " + id_x + ", " + id_y;
    else if (id_x < 10 && id_y >= 10) convertedId = " " + id_x + "," + id_y;
    else if (id_y < 10 && id_x >= 10) convertedId = id_x + ", " + id_y;
    else if (id_x >= 10 && id_y >= 10) convertedId = id_x + "," + id_y;

    // console.log(`=>${convertedId}`)
    return convertedId;
}

//flood/bucket filling function
function floodFill(id, id_x, id_y, colorToBucketFillOver) {
    // console.log(id_x, id_y)
    // console.log(`=>${id}`)
    let tileToStartFloodFill = document.getElementById(id);
    let colorOfCurrentTile = tileToStartFloodFill
        .getAttribute("style")
        .substring(18)
        .substring(0, 7);
    // console.log(`CurrentTileColor = ${colorOfCurrentTile}`)
    if (colorToBucketFillOver === getCurrentColor()) {
        console.log("Same color not going throught it!");
        return; //no else cause returning if waste of time
    }

    //ie the tile is already the color that needs to changed, we can skip this tile
    if (colorOfCurrentTile === colorToBucketFillOver) {
        tileToStartFloodFill.setAttribute(
            "style",
            `background-color: ${getCurrentColor()};`
        );
        // console.log(`recolor!  to ${currentColor}`)
        if (checkValidForFloodFill(id_x + 1, id_y))
            floodFill(
                convertToValidID(id_x + 1, id_y),
                id_x + 1,
                id_y,
                colorToBucketFillOver
            );
        if (checkValidForFloodFill(id_x - 1, id_y))
            floodFill(
                convertToValidID(id_x - 1, id_y),
                id_x - 1,
                id_y,
                colorToBucketFillOver
            );
        if (checkValidForFloodFill(id_x, id_y + 1))
            floodFill(
                convertToValidID(id_x, id_y + 1),
                id_x,
                id_y + 1,
                colorToBucketFillOver
            );
        if (checkValidForFloodFill(id_x, id_y - 1))
            floodFill(
                convertToValidID(id_x, id_y - 1),
                id_x,
                id_y - 1,
                colorToBucketFillOver
            );
    }

    //no neeed to self shame
}

//clearing the attributes of a selected button
//also used for clearing bucketFill button induced status
function clearSelected() {
    redBtn.removeAttribute("style");
    yellowBtn.removeAttribute("style");
    blueBtn.removeAttribute("style");
    greenBtn.removeAttribute("style");
    darkBtn.removeAttribute("style");
    whiteBtn.removeAttribute("style");
    eraserBtn.removeAttribute("style");
    rainbowBtn.removeAttribute("style");

    bucketFillBtn.removeAttribute("style");
    bucketFill = false;
}

function downloadImage() {
    html2canvas(document.body, (backgroundColor = "bisque")).then(function (
        canvas
    ) {
        document.body.appendChild(canvas);
        var dataURL = canvas.toDataURL("image/png");
        // Create a dummy link text
        var a = document.createElement("a");
        // Set the link to the image so that when clicked, the image begins downloading
        a.href = dataURL;
        // Specify the image filename
        a.download = "canvas-download.jpeg";
        // Click on the link to set off download
        a.click();
        canvas.remove();
    });
}
