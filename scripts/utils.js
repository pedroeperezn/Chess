export const getRandomBoardOrientation = () => {
    if (Math.random() < 0.5) {
        return 'white'
    }
    else {
        return 'black'
    }
}

export const generateRandomDelayTime = (minSeconds, maxSeconds) => {
    var minMs = minSeconds * 1000
    var maxMs = maxSeconds * 1000

    var delay = Math.floor(Math.random() * (maxMs = minMs)) + minMs

    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}




