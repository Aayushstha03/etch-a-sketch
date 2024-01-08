const gameUI = document.querySelector('#gameUI')
//color coed buttons
const redBtn = document.getElementById('red')
redBtn.addEventListener('click', () => currentColor = 'red')
const yellowBtn = document.getElementById('yellow')
yellowBtn.addEventListener('click', () => currentColor = 'yellow')
const greenBtn = document.getElementById('green')
greenBtn.addEventListener('click', () => currentColor = 'green')
const blueBtn = document.getElementById('blue')
blueBtn.addEventListener('click', () => currentColor = 'blue')
const darkBtn = document.getElementById('dark')
darkBtn.addEventListener('click', () => currentColor = 'dark')
const whiteBtn = document.getElementById('white')
whiteBtn.addEventListener('click', () => currentColor = 'white')
const eraserBtn = document.getElementById('eraser')
eraserBtn.addEventListener('click', () => currentColor = 'erased')
const rainbowBtn = document.getElementById('rainbow')
rainbowBtn.addEventListener('click', () => currentColor = 'rainbow')

//board and ui vars
let boardSize = 16;
let buttonPressed = false

let currentColor = 'white'

const tileRows = [] //array
const tileCols = []

function createBoard(boardSize) {
    const board = document.createElement('div')
    board.setAttribute('id', 'board')
    gameUI.appendChild(board)
    for (let i = 0; i < boardSize; i++) {
        tileRows[i] = document.createElement('div')
        tileRows[i].setAttribute('id', 'tileRow')
        board.appendChild(tileRows[i])//adding divs to the board!!!
        for (let j = 0; j < boardSize; j++) {
            tileCols[j] = document.createElement('div')
            tileCols[j].setAttribute('id', `${i + 1},${j + 1}`)
            tileCols[j].setAttribute('class', `tile`)
            tileRows[i].appendChild(tileCols[j])
        }
    }
    addEventListeners()
}
createBoard(boardSize) //game init

// button that resizes the board
// to be replaced by a slider later on
const button = document.getElementById('size')
button.addEventListener('click', () => resizeBoard())

const resetBtn = document.getElementById('reset')
resetBtn.addEventListener('click', () => {
    board.remove()
    createBoard(boardSize)
})

function resizeBoard() {
    let valid = false
    boardSize = prompt("Enter the desired resolution (1<=x<=50)")
    if (boardSize >= 1 && boardSize <= 50)
        valid = true
    else
        while (!valid) {
            boardSize = prompt("Invalid board size! please enter a valid resolution")
            if (boardSize >= 1 && boardSize <= 50)
                valid = true
        }

    board.remove()
    createBoard(boardSize)
}

function addEventListeners() {
    const tilesNodeList = document.querySelectorAll('.tile')
    for (const tile of tilesNodeList) {
        let id = tile.getAttribute('id')
        tile.addEventListener(('mouseover'), () => changeColor(id))
    }
}

function getCurrentColor() {
    if (currentColor === 'rainbow')
        return rainbow();
    else if (currentColor === 'red')
        return "#ef476f";
    else if (currentColor === 'yellow')
        return '#ffd166';
    else if (currentColor === 'green')
        return '#06d6a0';
    else if (currentColor === 'blue')
        return '#118ab2';
    else if (currentColor === 'dark')
        return '#073b4c';
    else if (currentColor === 'white')
        return '#ffffff';
    else if (currentColor === 'erased')
        return 'bisque';
}

function changeColor(id) {
    let recoloredTile = document.getElementById(id)
    recoloredTile.setAttribute('style', `background-color: ${getCurrentColor()};`);
    // console.log(`${id}color changed! `)
}

function rainbow() {
    let colors = ["#ef476f", '#ffd166', '#06d6a0', '#118ab2', '#073b4c', '#ffffff']
    var color = colors[Math.floor(Math.random() * colors.length)];
    return color
}