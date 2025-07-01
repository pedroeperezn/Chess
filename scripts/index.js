import { Chess } from '../node_modules/chess.js/dist/esm/chess.js'
import '../node_modules/@chrisoakman/chessboardjs/dist/chessboard-1.0.0.js'
import { getStockfishNextMove } from './stockfishCall.js'
import * as Utils from './utils.js'
import { Timer } from './timer.js'

const chess = new Chess()
const boardSelector = document.querySelector("#board1")
var board = null

var turn = null
var stockfishMove = null
var hasGameStarted = false

const difficultySelector = document.querySelector('#select-difficulty')
var difficulty = difficultySelector.value
const orientationSelector = document.querySelector('#select-position')
var userOrientation = orientationSelector.value
const timeSelector = document.querySelector('#select-time')
var time = timeSelector.value

const whiteTimerElement = document.querySelector("#white-timer")
const blackTimerElement = document.querySelector("#black-timer")

const stockfishTimer = new Timer()
const humanTimer = new Timer()

const restartButton = document.querySelector('#restart-btn')
const flipBoardButton = document.querySelector('#flip-btn')
const startGameButton = document.querySelector('#start-btn')

var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

const getUserBoardOrientation = () => {
    userOrientation = orientationSelector.value
}

const getUserDifficulty = () => {
    difficulty = difficultySelector.value
}

const refreshTimers = () => 
{
    whiteTimerElement.textContent = Timer.formatInputTime(timeSelector.value)
    blackTimerElement.textContent = Timer.formatInputTime(timeSelector.value)
}

const requestEngineMove = async () => {
    try {

        var depth;

        switch(difficulty)
        {
            case 'easy':
                depth = 1
                break
            case 'medium':
                depth = 5
                break
            case 'hard':
                depth = 10
                break
            default:
                depth = 5
                break

        }

        const data = await getStockfishNextMove(chess.fen(), depth)

        if (data.success && data.bestmove) {
            stockfishMove = data.bestmove
            makeStockfishMove(stockfishMove)
        }
    }
    catch (error) 
    {
        console.error('Failed to get engine move:', error);
    }
}

const makeStockfishMove = async (move) => {
    const moveTokens = move.split(' ');
    var move = moveTokens[1]
    var source = move.substring(0, 2)
    var target = move.substring(2, 4)

    try {
        var move = chess.move({
            from: source,
            to: target,
            promotion: 'q'
        })

        await Utils.generateRandomDelayTime(2, 10)

        board.position(chess.fen())
        updateStatus()
        turn = 'human'
        stockfishTimer.stop()
        humanTimer.start()
    }
    catch (error) {
        return 'snapback'
    }
}

const onDragStart = (source, piece, position, orientation) => {

    if (chess.isGameOver()) {
        return false
    }

    if (!(turn === 'human') || !hasGameStarted) 
    {
        return false
    }

}

const onDrop = (source, target) => {
    try {
        var move = chess.move({
            from: source,
            to: target,
            promotion: 'q'
        })
    }
    catch (error) {
        return 'snapback'
    }
}

const onSnapEnd = () => {
    board.position(chess.fen())
    turn = 'stockfish'
    humanTimer.stop()
    stockfishTimer.start()
    updateStatus()
    requestEngineMove()
}

const updateStatus = () => {
    var status = ''

    var moveColor = 'White'

    if (chess.turn() == 'b') {
        moveColor = 'Black'
    }

    if (chess.isCheckmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }
    else if (chess.isDraw()) {
        status = 'Game over, drawn position'
    }
    else {
        status = moveColor + ' to move'

        if (chess.isCheck()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
    $fen.html(chess.fen())
    $pgn.html(chess.pgn())
}

const chessboardGameConfig = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    orientation: 'white'
}

const initGame = () => 
{
    board = Chessboard(boardSelector, chessboardGameConfig) 
    turn = 'human'
}

restartButton.addEventListener('click', () => {
    refreshTimers()
    setupTimers()
    
    chess.reset()
    board.orientation() === 'white' ? turn = 'human' : turn = 'stockfish'

    if(turn === 'stockfish')
    {
        requestEngineMove()
    }

    board.position('start')
    updateStatus()
})

difficultySelector.addEventListener('change', () => {
    difficulty = difficultySelector.value
});

flipBoardButton.addEventListener('click', () => {
    board.flip()
})

startGameButton.addEventListener('click', () => {
    
    if(hasGameStarted)
    {
        console.log("Game had already started")
        return
    }

    getUserDifficulty()
    getUserBoardOrientation()

    if(userOrientation == 'random')
    {
        userOrientation = Utils.getRandomBoardOrientation()
    }

    board.orientation(userOrientation)
    setupTimers()

    if(userOrientation === 'white')
    {
        turn = 'human'
        whiteTimer.start()
    }
    else if(userOrientation == 'black')
    {
        turn = 'stockfish'
        stockfishTimer.start()
        requestEngineMove()
    }

    hasGameStarted = true
})

const timeEnded = () => {
    console.log('Time\'s up!!')
}

document.addEventListener('DOMContentLoaded', () => {
    refreshTimers()
})

timeSelector.addEventListener('change', () => {
    refreshTimers()
})

const setupTimers = () => 
{
    if(board.orientation === 'white')
    {

        humanTimer.set(timeSelector.value, whiteTimerElement, timeEnded)
        stockfishTimer.set(timeSelector.value, blackTimerElement, timeEnded)
    }
    else
    {
        stockfishTimer.set(timeSelector.value, whiteTimerElement, timeEnded)
        humanTimer.set(timeSelector.value, blackTimerElement, timeEnded)
    }
}

initGame()
updateStatus()



