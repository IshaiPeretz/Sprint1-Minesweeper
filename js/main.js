'use strict'


const MINE = '💥'
const MARKED = '🚩'
const EMPTY = ''
var gBoard

var gLevel = {
    Size: 4,
    Mines: 2,
    Clicks: 0
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.table(gBoard)

}

function onFirstClick(i, j) {
    placeMinesRandomly(gLevel.Mines, i, j)
    setMinesNegsCount(gBoard)
    
    console.table(gBoard)
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
    gLevel.Clicks++
    if (gLevel.Clicks === 1) {
        onFirstClick(i, j)
    }

    console.log('clicks:', gLevel.Clicks)
    var currCell = gBoard[i][j]
    console.log(i, j)
    if (currCell.isRevealed || currCell.isMarked) return

    currCell.isRevealed = true

    if (currCell.isMine) {
        console.log('GameOver')
        elCell.innerText = MINE
    }

    else {
        elCell.innerText = currCell.minesAroundCount
    }

}

function onCellMarked(ev, elCell, i, j) {
    ev.preventDefault()
    var currCell = gBoard[i][j]
    if (!currCell.isMarked) {
        elCell.innerText = MARKED
        currCell.isMarked = true
    } else {
        elCell.innerText = EMPTY
        currCell.isMarked = false
    }


    console.log(elCell, i, j)

}

function placeMinesRandomly(minesAmount, exI, exJ) {
    var Mines = 0
    while (Mines < minesAmount) {
        var emptyCell = getEmptyCell(gBoard)
        if (emptyCell.i === exI && emptyCell.j === exJ) continue
        if (!gBoard[emptyCell.i][emptyCell.j].isMine){
            gBoard[emptyCell.i][emptyCell.j].isMine = true
            Mines++
        }
    
    }
}

// function renderCell(elCell,i,j){
//     var currCell = gBoard[i][j]
//     elCell.innerText = currCell.minesAroundCount
// }