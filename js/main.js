'use strict'

const NORMAL = '😀'
const LOSE = '🤯'
const WIN = '😎'
const MINE = '💥'
const MARKED = '🚩'
const EMPTY = ''
const life = '💖'

const elTimer = document.querySelector('.timer')
const elSmiley = document.querySelector('.smiley')
const elHintBtns = document.querySelectorAll('.hint')
const elSafeBtn = document.querySelector('.safe')
const elDiffBtns = document.querySelectorAll('.level')
const elLives = document.querySelector('.lives')
const elTerminator = document.querySelector('.terminator')
const elMinesCounter = document.querySelector('.mine-counter')
const elMegaHint = document.querySelector('.mega-hint')

var megaHintRange = []
var minesPositions = []
var gStartTime
var gGameInterval
var gActiveHintbtn
var gBoard

var gLevel = {
    size: 4,
    mines: 2,
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    isSafe: 3,
    hintCount: 3,
    isHintOn: false,
    isMegaHint: false,
    isFirstClick: true,
    normalMode: true,
    skipMines: false,
    terminateMinesUses: 1,
    megaHintUses: 1,
}

function onInit() {
    megaHintRange = []
    minesPositions = []
    clearInterval(gGameInterval)
    elSmiley.innerText = NORMAL
    elTerminator.classList.remove('depleted')
    elSafeBtn.classList.remove('depleted')
    elMegaHint.classList.remove('depleted')
    gGame.markedCount = 0
    elMinesCounter.innerText = (gLevel.mines - gGame.markedCount)
    gGame.lives = 3
    elLives.innerText = life.repeat(gGame.lives)
    elHintBtns.forEach(btn => btn.classList.remove('hidden', 'marked'))
    elTimer.innerText = '00:00'
    gGame.terminateMinesUses = 1
    gGame.megaHintUses = 1
    gGame.secsPassed = 0
    gGame.isSafe = 3
    elSafeBtn.innerHTML = `<span class="icon">🔮</span><span class="num">${gGame.isSafe}</span>`
    gGame.hintCount = 3
    gGame.isFirstClick = true
    gGame.revealedCount = 0
    gGame.isOn = true
    gBoard = buildBoard()
    gGame.skipMines = false
    gGame.normalMode = true

    renderBoard(gBoard)
}


function onFirstClick(i, j) {
    if (!gGame.skipMines) placeMinesRandomly(gLevel.mines, i, j)
    setMinesNegsCount(gBoard)
}


function buildBoard() {
    const board = createMat(gLevel.size)
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
}


function countNegsMines(cellI, cellJ, board) {
    var count = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
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

    if (gGame.isMegaHint) {
        megaHintRange.push({ i, j })
        if (megaHintRange.length === 2) {
            for (var i = megaHintRange[0].i; i <= megaHintRange[1].i; i++) {
                for (var j = megaHintRange[0].j; j <= megaHintRange[1].j; j++)
                    revealCells(i, j)
            }
            gGame.isMegaHint = false
            elMegaHint.classList.add('depleted')
        }
        return
    }

    if (!gGame.normalMode) {
        minesPositions.push({ i, j })
        if (minesPositions.length === gLevel.mines) {
            for (var i = 0; i < minesPositions.length; i++) {
                gBoard[minesPositions[i].i][minesPositions[i].j].isMine = true
            }
            gGame.skipMines = true
            gGame.normalMode = true
        }
        return
    }

    if (gGame.isFirstClick) {
        clearInterval(gGameInterval)
        startTimer()
        onFirstClick(i, j)
        gGame.isFirstClick = false
    }
    var currCell = gBoard[i][j]

    if (gGame.isHintOn && gGame.hintCount && !currCell.isRevealed) {

        revealNegs(i, j, gBoard)
        gGame.isHintOn = false
        gGame.hintCount--
        gActiveHintbtn.classList.add('hidden')
    }

    if (currCell.isRevealed || currCell.isMarked) return

    currCell.isRevealed = true
    elCell.classList.toggle('revealed')

    if (currCell.isMine) {
        gGame.lives--
        elLives.innerText = life.repeat(gGame.lives)
        elCell.innerText = MINE
        if (gGame.lives === 0) {
            gGame.isOn = false
            clearInterval(gGameInterval)
            console.log('Game Over')
            elSmiley.innerText = LOSE
            showMines()
        } else
            setTimeout(() => {
                currCell.isRevealed = false
                elCell.innerText = EMPTY
                elCell.classList.toggle('revealed')
            }, 1000)
    }
    if (!currCell.isMine) {
        openNegs(i, j, gBoard)
        gGame.revealedCount++
        (currCell.minesAroundCount) ? elCell.innerText = currCell.minesAroundCount : elCell.innerText = EMPTY
        winCon(gBoard)
    }
}


function winCon(board) {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if ((currCell.isMine && currCell.isMarked) || (currCell.isRevealed && !currCell.isMine)) count++
        }
    }
    if (count === gLevel.size ** 2) {
        elSmiley.innerText = WIN
        gGame.isOn = false
        clearInterval(gGameInterval)
        showMines()
        console.log('Victory')
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
        elMinesCounter.innerText = (gLevel.mines - gGame.markedCount)
        winCon(gBoard)
    } else {
        elCell.innerText = EMPTY
        currCell.isMarked = false
        gGame.markedCount--
        elMinesCounter.innerText = (gLevel.mines - gGame.markedCount)
    }
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
    elDiffBtns.forEach(btn => {
        btn.style.border = '2px solid grey'
    })
    if (difficulty.innerText === 'I') {
        gLevel.size = 4
        gLevel.mines = 2
    }
    else if (difficulty.innerText === 'II') {
        gLevel.size = 8
        gLevel.mines = 14
    }
    else if (difficulty.innerText === 'III') {
        gLevel.size = 12
        gLevel.mines = 32
    }
    difficulty.style.border = '2px solid blue'
    onInit()
}


function safeClick() {
    if (!gGame.isSafe) return
    var safeCell = getEmptyCell(gBoard)
    var elSafeCell = document.querySelector(`.cell-${safeCell.i}-${safeCell.j}`)
    elSafeCell.classList.toggle('safe')
    setTimeout(() => {
        elSafeCell.classList.toggle('safe')
    }, 1500)
    gGame.isSafe--
    console.log(gGame.isSafe)
    elSafeBtn.innerHTML = `<span class="icon">🔮</span><span class="num">${gGame.isSafe}</span>`
    if (gGame.isSafe === 0) elSafeBtn.classList.add('depleted')
}


function revealNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            revealCells(i, j)
        }
    }
}


function revealCells(i, j) {
    var currCell = gBoard[i][j]
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.classList.toggle('hint')
    if (currCell.isMine) {
        elCell.innerText = MINE
    }
    else {
        (currCell.minesAroundCount) ? elCell.innerText = currCell.minesAroundCount : elCell.innerText = EMPTY
    }
    var wasRevealed = currCell.isRevealed
    currCell.isRevealed = true

    setTimeout(() => {
        if (!wasRevealed) {
            currCell.isRevealed = false
            elCell.innerText = EMPTY
        }
        elCell.classList.toggle('hint')
    }, 1500)
}


function openNegs(cellI, cellJ, board) {
    if (board[cellI][cellJ].minesAroundCount) {
        return
    }
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            var currCell = board[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.isMine || currCell.isMarked || currCell.isRevealed) continue
            currCell.isRevealed = true
            elCell.classList.add('revealed')
            gGame.revealedCount++
            (currCell.minesAroundCount) ? elCell.innerText = currCell.minesAroundCount : elCell.innerText = EMPTY
            if (currCell.minesAroundCount === 0) {
                openNegs(i, j, board)
            }
        }
    }
}


function activeHint(elBtn) {
    gGame.isHintOn = !gGame.isHintOn
    if (gGame.hintCount) {
        gActiveHintbtn = elBtn
        elBtn.classList.toggle('marked')
    }
}


function terminateMines() {
    if (!gGame.isFirstClick)
        if (gGame.terminateMinesUses) {
            gGame.terminateMinesUses--
            for (var i = 0; i < 3; i++) {
                var minesPos = getMines(gBoard)
                var currCell = gBoard[minesPos.i][minesPos.j]
                currCell.isMine = false
                setMinesNegsCount(gBoard)
                renderNegs(minesPos.i, minesPos.j, gBoard)
                elTerminator.classList.add('depleted')
            }

        }
}


function activeMegaHint() {
    if (!gGame.isFirstClick)
        if (gGame.megaHintUses) {
            gGame.megaHintUses--
            gGame.isMegaHint = true
        }

}

function placeMines() {
    if (gGame.isFirstClick) {
        gGame.normalMode = !gGame.normalMode
        console.log(gGame.normalMode)
    }
}


function renderNegs(cellI, cellJ, board) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            var currCell = board[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.minesAroundCount && currCell.isRevealed) {
                elCell.innerText = currCell.minesAroundCount
            }
            else elCell.innerText = EMPTY
        }
    }
}


function startTimer() {
    gStartTime = Date.now()
    gGameInterval = setInterval(timer, 1000)
}

function timer() {
    var duration = Math.floor((Date.now() - gStartTime) / 1000)
    const totalMinutes = Math.floor(duration / 60)
    const totalSeconds = duration % 60
    const seconds = totalSeconds + ''
    const minutes = totalMinutes + ''

    elTimer.innerText = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

