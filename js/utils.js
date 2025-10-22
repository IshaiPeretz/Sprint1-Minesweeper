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







function getEmptyCell(board) {
	const emptyCells = []; 

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			const currCell = board[i][j]; 
			if (!currCell.isMine && !currCell.isRevealed) {
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

