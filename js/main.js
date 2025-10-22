'use strict'

const NORMAL = '😀'
const LOSE = '🤯'
const WIN = '😎'
const MINE = '💥'
const MARKED = '🚩'
const EMPTY = ''
var gBoard

const elSmiley = document.querySelector('.smiley')

var gLevel = {
    Size: 4,
    Mines: 2,
}


var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    Lives: 3,

}


function onInit() {
    elSmiley.innerText = NORMAL
    gGame.Lives = 3
    document.querySelector('.lives').innerText = gGame.Lives
    gGame.revealedCount = 0
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    // console.table(gBoard)

}

function onFirstClick(i, j) {
    placeMinesRandomly(gLevel.Mines, i, j)
    setMinesNegsCount(gBoard)
}

function buildBoard() {
    const board = createMat(gLevel.Size)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    // board[0][1].isMine = true
    // board[0][0].isMine = true

    return board
}


function renderBoard(board) {
    var stringHTML = ''
    for (var i = 0; i < board.length; i++) {
        stringHTML += '\n<tr>'
        for (var j = 0; j < board[i].length; j++) {
            stringHTML += `\n<td class = "cell cell-${i}-${j}" onclick="onCellClicked(this, ${i}, ${j})"
          oncontextmenu="onCellMarked(event,this, ${i}, ${j})"></td>`
        }

        stringHTML += '\n </tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = stringHTML
    // console.log(stringHTML)


}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var mineCount = countNegsMines(i, j, board)
            board[i][j].minesAroundCount = mineCount
        }
    }

}


function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    // console.log('revealed:', gGame.revealedCount)
    gGame.revealedCount++
    if (gGame.revealedCount === 1) {
        onFirstClick(i, j)
    }
    var currCell = gBoard[i][j]

    if (currCell.isRevealed || currCell.isMarked) return

    currCell.isRevealed = true
    elCell.classList.add('revealed')

    if (currCell.isMine) {
        gGame.Lives--
        document.querySelector('.lives').innerText = gGame.Lives
        elCell.innerText = MINE
        if (gGame.Lives === 0) {
            gGame.isOn = false
            console.log('Game Over')
            elSmiley.innerText = LOSE
            showMines()
        } else
            setTimeout(() => {
                gGame.revealedCount--
                currCell.isRevealed = false
                elCell.innerText = EMPTY
                elCell.classList.remove('revealed')
            }, 1000)

    }

    else {
        elCell.innerText = currCell.minesAroundCount
    }


    // console.log('revealed:', gGame.revealedCount)

    if (!currCell.isMine) {
        if (gGame.revealedCount === gLevel.Size ** 2 - gLevel.Mines) {
            elSmiley.innerText = WIN
            console.log('Victory')
        }
    }
}

function onCellMarked(ev, elCell, i, j) {
    ev.preventDefault()
    if (!gGame.isOn) return
    var currCell = gBoard[i][j]
    if (!currCell.isMarked) {
        elCell.innerText = MARKED
        currCell.isMarked = true
        gGame.markedCount++
    } else {
        elCell.innerText = EMPTY
        currCell.isMarked = false
        gGame.markedCount--
    }


    console.log(gGame.markedCount)

}

function placeMinesRandomly(minesAmount, exI, exJ) {
    var Mines = 0
    while (Mines < minesAmount) {
        var emptyCell = getEmptyCell(gBoard)
        if (emptyCell.i === exI && emptyCell.j === exJ) continue
        if (!gBoard[emptyCell.i][emptyCell.j].isMine) {
            gBoard[emptyCell.i][emptyCell.j].isMine = true
            Mines++
        }

    }
}

function showMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.isMine) elCell.innerText = MINE
        }
    }

}

function changeDiff(difficulty) {
    if (difficulty.innerText === 'I') {
        gLevel.Size = 4
        gLevel.Mines = 2
    }
    else if (difficulty.innerText === 'II') {
        gLevel.Size = 8
        gLevel.Mines = 14
    }
    else if (difficulty.innerText === 'III') {
        gLevel.Size = 12
        gLevel.Mines = 32
    }
    onInit()

}