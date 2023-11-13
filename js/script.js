
// make hamburger menu on top right of screen with drop down
// how to play, reset game
// your high score
// sfx controls
// make it mobile friendly

/*----- constants -----*/
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext()

const keyboard = {
    q: { label: 'Q', color: 'darksalmon', tone: 100, active: false},
    w: { label: 'W', color: 'bisque', tone: 110, active: false },
    e: { label: 'E', color: 'skyblue', tone: 120, active: false }, 
    r: { label: 'R', color: 'violet', tone: 130, active: false },
    t: { label: 'T', color: 'hotpink', tone: 140, active: false },
    y: { label: 'Y', color: 'darkorange', tone: 150, active: false },
    u: { label: 'U', color: 'gold', tone: 160, active: false },
    i: { label: 'I', color: 'turquoise', tone: 170, active: false },
    o: { label: 'O', color: 'cornflowerblue', tone: 180, active: false },
    p: { label: 'P', color: 'palevioletred', tone: 190, active: false },
    a: { label: 'A', color: 'limegreen', tone: 200, active: false },
    s: { label: 'S', color: 'deepskyblue', tone: 210, active: false },
    d: { label: 'D', color: 'dodgerblue', tone: 220, active: false },
    f: { label: 'F', color: 'deeppink', tone: 230, active: false },
    g: { label: 'G', color: 'red', tone: 240, active: false },
    h: { label: 'H', color: 'seagreen', tone: 250, active: false },
    j: { label: 'J', color: 'blue', tone: 260, active: false },
    k: { label: 'K', color: 'darkviolet', tone: 270, active: false },
    l: { label: 'L', color: 'crimson', tone: 280, active: false },
    z: { label: 'Z', color: 'purple', tone: 290, active: false },
    x: { label: 'X', color: 'navy', tone: 300, active: false },
    c: { label: 'C', color: 'green', tone: 310, active: false },
    v: { label: 'V', color: 'chocolate', tone: 320, active: false },
    b: { label: 'B', color: 'steelblue', tone: 330, active: false },
    n: { label: 'N', color: 'tomato', tone: 340, active: false },
    m: { label: 'M', color: 'rebeccapurple', tone: 350, active: false },
}

const computerMessages = [
    'Watch the sequence . . .',
    'Just a little harder this time . . .',
    'Pay attention . . .',
    "Wow, you're still here? Good job!!!",
    'Keep it up!',
    "You're doing great!",
    'This is a tricky one . . .',
    "I'm nervous about this one . . .",
    'Okay, this one is going to be tricky',
    'I think I got you on this one . . .',
    'Concentrate!!!',
    'Stop reading this and look at the board!',
    'My turn . . .',
    'Try this one out!',
]

/*----- state variables -----*/
let level = 2
let keyPatternArray = []
let playerKeyPressArray = []
let userInteractionEnabled = true

/*----- cached elements  -----*/
const keyEls = document.querySelectorAll('.key')
const keyboardEl = document.getElementById('keyboardContainer')
const messageEl = document.getElementById('message')
const buttonEl = document.getElementById('buttonContainer')
const startButton = document.getElementById('startButton')
const levelButton = document.getElementById('levelButton')
const resetButton = document.getElementById('resetButton')
const levelNumber = document.getElementById('levelNumber')
const primaryNavigation = document.querySelector('.primary-navigation')
const navigationToggle = document.querySelector('.mobile-nav-toggle')

/*----- event listeners -----*/
startButton.addEventListener('click', () => {
    handleStartButton()
    render()
    setTimeout(leveler, 500)
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !startButton.classList.contains('hidden')) {
        handleStartButton()
        render()
        setTimeout(leveler, 500)
    }
})

levelButton.addEventListener('click', () => {
    handleLevelButton()
    leveler()
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !levelButton.classList.contains('hidden')) {
        handleLevelButton()
        leveler()
    }
})

resetButton.addEventListener('click', () => {
    handleResetButton()
    resetGame()
})

document.addEventListener('keydown', (event) => {
    if(event.key === 'Enter' && !resetButton.classList.contains('hidden')) {
        handleResetButton()
        resetGame()
    }
})

keyEls.forEach((keyEl) => {
    keyEl.addEventListener('click', () => {
        handleKeyPress({ key: keyEl.id })
    })
})

document.addEventListener('keydown', handleKeyPress)

/*----- functions -----*/
function handleKeyPress(event) {
    const key = event.key || event.target.id
    if (keyboard.hasOwnProperty(key) && userInteractionEnabled) {
        playerKeyPressArray.push(key)
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        handleKeyTone(keyInfo)
        setTimeout(() => {
            checkWinProgress()
            keyInfo.active = false
        }, 200)
    }
}

function pickRandomKey() {
    const keys = Object.keys(keyboard)
    const randomIndex = Math.floor(Math.random() * keys.length)
    const randomKey = keys[randomIndex]
    keyPatternArray.push(randomKey)
    return randomKey
}

function checkWinProgress() {
    const partialPattern = keyPatternArray.slice(0, playerKeyPressArray.length)
    
    for (let i = 0; i < playerKeyPressArray.length; i++) {
        if (playerKeyPressArray[i] !== partialPattern[i]) {
            userInteractionEnabled = false
            losingMessage()
            playAgain()
            return
        }
    }
    if (playerKeyPressArray.length === keyPatternArray.length) {
        userInteractionEnabled = false
        nextLevel()
    }
}

function leveler() {
    level++
    playerKeyPressArray = []
    pickRandomKey(keyboard)
    setTimeout(() => {playKeyPattern()}, 500)
    getRandomMessage()
    userInteractionEnabled = false
}

function playKeyPattern() {
    computerTurn()
    let i = 0
    function playNextKey() {
        const key = keyPatternArray[i]
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        handleKeyTone(keyInfo)
        setTimeout(() => {
            keyInfo.active = false
            i++
            if (i < keyPatternArray.length) {
                setTimeout(playNextKey, 350)
            } else {
                setTimeout(() => {
                    userInteractionEnabled = true
                }, 200)
                playerTurn()
            }
        }, 350)
    }
    playNextKey()
}

function resetGame() {
    level = 2
    keyPatternArray = []
    render()
    setTimeout(leveler, 500)
}

function getRandomMessage() {
    const randomMessage = computerMessages[Math.floor(Math.random() * computerMessages.length)]
    handleMessage(randomMessage)
}

function handleKeyColor(keyInfo) {
    if (keyInfo.active === true) {
        const keyEl = document.getElementById(keyInfo.label.toLowerCase())
        keyEl.style.backgroundColor = keyInfo.color
        keyEl.classList.add('active')
        setTimeout(() => {
            keyEl.style.backgroundColor = ''
            keyEl.classList.remove('active')
        }, 200)
    }
}

function handleKeyTone(keyInfo) {
    const keyEl = document.getElementById(keyInfo.label.toLowerCase())
    playTone(keyInfo.tone,0.2)
}

function handleLevelButton() {
    levelButton.classList.add('hidden')
    levelNumber.innerText = level
}

function handleResetButton() {
    resetButton.classList.add('hidden')
}

function handleStartButton() {
    buttonEl.style.marginBottom = '10vmin'
}

function nextLevel() {
    levelButton.classList.remove('hidden')
    messageEl.innerText = 'Would you like to proceed?'
}

function playerTurn() {
    messageEl.innerText = "Now it's your turn . . ."
}

function computerTurn() {
    userInteractionEnabled = false
    levelButton.classList.add('hidden')
}

function playTone(frequency, duration) {
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)
}

function playAgain() {
    resetButton.classList.remove('hidden')
}

function losingMessage() {
    messageEl.innerText = 'YOU LOST! \nWanna try again?'
}

function render() {
    startButton.classList.add('hidden')
    keyboardEl.classList.remove('hidden')
    levelNumber.innerText = level
}

function handleMessage(message) {
    messageEl.innerText = message
}

navigationToggle.addEventListener('click', () => {
    const visibility = primaryNavigation.getAttribute('data-visible')
    if (visibility === 'false') {
        primaryNavigation.setAttribute('data-visible', true)
        navigationToggle.setAttribute('aria-expanded', true)
    } else {
        primaryNavigation.setAttribute('data-visible', false)
        navigationToggle.setAttribute('aria-expanded', false)
    }
})