'use strict'


function createMat(size) {
    const mat = []
    for (var i = 0; i < size; i++) {
        const row = []
        for (var j = 0; j < size; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}



function countNegsMines(cellI, cellJ, board) {
	var count = 0;
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= board.length) continue;
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= board[i].length) continue;
			if (i === cellI && j === cellJ) continue;
			if (board[i][j].isMine) count++;
		}
	}
	return count;
}


function getEmptyCell(board) {
	const emptyCells = []; 

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			const currCell = board[i][j]; 
			if (!currCell.isMine) {
				emptyCells.push({ i, j })
			}
		}
	}


	const randomIdx = getRandomInt(0, emptyCells.length)
	return emptyCells[randomIdx]
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

