const gameUI = document.querySelector('#gameUI')
const boardRes = document.getElementById('boardSize')
//board and ui vars
let boardSize = 16;
let buttonPressed = false

window.addEventListener('mousedown', (event) => {
    buttonPressed = true
    // console.log(event.button)
})
window.addEventListener('mouseup', (event) => {
    buttonPressed = false
    // console.log(event.button)
})


let currentColor = 'white'

const tileRows = [] //array
const tileCols = []

function createBoard(boardSize) {
    boardRes.textContent = `${boardSize} X ${boardSize}`
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
        tile.addEventListener(('mousedown'), () => changeColorOnce(id))
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
    if (buttonPressed) {
        let recoloredTile = document.getElementById(id)
        recoloredTile.setAttribute('style', `background-color: ${getCurrentColor()};`);
        // console.log(`${id}color changed! `)
    }
}

function changeColorOnce(id) {
    let recoloredTile = document.getElementById(id)
    recoloredTile.setAttribute('style', `background-color: ${getCurrentColor()};`);
    // console.log(`${id}color changed! `)
}

function rainbow() {
    let colors = ["#ef476f", '#ffd166', '#06d6a0', '#118ab2', '#073b4c', '#ffffff']
    var color = colors[Math.floor(Math.random() * colors.length)];
    return color
}

//color coed buttons
const redBtn = document.getElementById('red')
redBtn.addEventListener('click', () => {
    clearSelected()
    redBtn.setAttribute('style', `border: 3px solid black;`)
    currentColor = 'red'
})
const yellowBtn = document.getElementById('yellow')
yellowBtn.addEventListener('click', () => {
    clearSelected()
    yellowBtn.setAttribute('style', `border: 3px solid black;`)
    currentColor = 'yellow'
})
const greenBtn = document.getElementById('green')
greenBtn.addEventListener('click', () => {
    clearSelected()
    greenBtn.setAttribute('style', `border: 3px solid black;`)
    currentColor = 'green'
})
const blueBtn = document.getElementById('blue')
blueBtn.addEventListener('click', () => {
    currentColor = 'blue'
    clearSelected()
    blueBtn.setAttribute('style', `border: 3px solid black;`)
})
const darkBtn = document.getElementById('dark')
darkBtn.addEventListener('click', () => {
    currentColor = 'dark'
    clearSelected()
    darkBtn.setAttribute('style', `border: 3px solid black;`)
})
const whiteBtn = document.getElementById('white')
whiteBtn.addEventListener('click', () => {
    currentColor = 'white'
    clearSelected()
    whiteBtn.setAttribute('style', `border: 3px solid black;`)
})

const button = document.getElementById('size')
button.addEventListener('click', () => resizeBoard())

const resetBtn = document.getElementById('reset')
resetBtn.addEventListener('click', () => {
    board.remove()
    createBoard(boardSize)
})

const eraserBtn = document.getElementById('eraser')
eraserBtn.addEventListener('click', () => {
    currentColor = 'erased'
    clearSelected()
    eraserBtn.setAttribute('style', `border: 3px solid black;`)
})

const rainbowBtn = document.getElementById('rainbow')
rainbowBtn.addEventListener('click', () => {
    currentColor = 'rainbow'
    clearSelected()
    rainbowBtn.setAttribute('style', `border: 3px solid black;`)
})

function clearSelected() {
    redBtn.removeAttribute('style')
    yellowBtn.removeAttribute('style')
    blueBtn.removeAttribute('style')
    greenBtn.removeAttribute('style')
    darkBtn.removeAttribute('style')
    whiteBtn.removeAttribute('style')
    eraserBtn.removeAttribute('style')
    rainbowBtn.removeAttribute('style')
}