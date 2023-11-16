// CONSTANTS //
const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const gainNode = audioContext.createGain()
gainNode.connect(audioContext.destination)
const volumeControl = document.getElementById('volumeControl')

// MODEL //
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

// STATE VARIABLES //

let level = 1
let keyPatternArray = []
let playerKeyPressArray = []
let userInteractionEnabled = true
let highScores = JSON.parse(localStorage.getItem('highScores')) || []
let isSoundOn = true
let gamePhase = 'start'
let isPopupOpen = false

// CACHED ELEMENTS //

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
const closePopupButton = document.getElementById('closePopup')
const popupContainerEl = document.getElementById('popupContainer')
const howToPlayLink = document.getElementById('howToPlayLink')
const howToPlayDivEl = document.getElementById('howToPlayDiv')
const sfxControlsLink = document.getElementById('sfxControlsLink')
const sfxControlsDivEl = document.getElementById('sfxControlsDiv')
const highScoreLink = document.getElementById('highScoreLink')
const highScoreDivEl = document.getElementById('highScoreDiv')
const resetGameLink = document.getElementById('resetGameLink')
const highScoreDisplay = document.getElementById('highScoreDisplay')
const highScoreList = document.getElementById('highScoreList')
const resetHighScoresButton = document.getElementById('resetHighScoresButton')
const soundToggle = document.getElementById('check')

// EVENT LISTENERS //
startButton.addEventListener('click', () => {
    handleStartButton()
    setTimeout(leveler, 500)
    render()
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !startButton.classList.contains('hidden')) {
        handleStartButton()
        setTimeout(leveler, 500)
        render()
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

howToPlayLink.addEventListener('click', () => {
    isPopupOpen = true
    handlePopup(howToPlayDivEl)
})

document.addEventListener('keydown', (event) => {
    if (event.key === "0") {
        isPopupOpen = true
        handlePopup(howToPlayDivEl)
    }
})

sfxControlsLink.addEventListener('click', () => {
    isPopupOpen = true
    handlePopup(sfxControlsDivEl)
})

document.addEventListener('keydown', (event) => {
    if (event.key === "1") {
        isPopupOpen = true
        handlePopup(sfxControlsDivEl)
    }
})

highScoreLink.addEventListener('click', () => {
    isPopupOpen = true
    handlePopup(highScoreDivEl)
})

document.addEventListener('keydown', (event) => {
    if (event.key === "2") {
        isPopupOpen = true
        handlePopup(highScoreDivEl)
    }
})

resetGameLink.addEventListener('click', handleResetGameLink)

document.addEventListener('keydown', (event) => {
    if (event.key === "3" && gamePhase !== 'start') {
        handleResetGameLink()
    }
})

closePopupButton.addEventListener('click', () => {
    isPopupOpen = false
    handlePopup(null)
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        isPopupOpen = false
        handlePopup(null)
    }
})

resetHighScoresButton.addEventListener('click', resetHighScores)

soundToggle.addEventListener('click', toggleSound)

// VIEW //
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

function handleLevelButton() {
    levelButton.classList.add('hidden')
    levelNumber.innerText = level + 1
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
    levelButton.classList.add('hidden') 
}

function playAgain() {
    resetButton.classList.remove('hidden')
}

function losingMessage() {
    messageEl.innerText = 'YOU LOST! \nWanna try again?'
}

function handleMessage(message) {
    messageEl.innerText = message
}

function countdownReset() {
    let count = 3
    resetGameLink.style.pointerEvents = 'none'
    resetGameLink.style.color = 'red'
    const countdownInterval = setInterval(() => {
        if (count > 0) {
            messageEl.innerText = count
            count--
        } else {
            clearInterval(countdownInterval)
            resetGameLink.style.pointerEvents = 'auto'
            resetGameLink.style.color = 'white'
            messageEl.innerText = "Here we go!!!"
        }
    }, 500)
}

function handlePopup(selectedDiv) {
    const isSameDiv = selectedDiv === popupContainerEl.querySelector('.popup-content:not(.hidden)')

    if (!isSameDiv) {
        howToPlayDivEl.classList.add('hidden')
        sfxControlsDivEl.classList.add('hidden')
        highScoreDivEl.classList.add('hidden')
    }

    if (selectedDiv) {
        selectedDiv.classList.toggle('hidden')
    }
    popupContainerEl.classList.toggle('hidden', isSameDiv)
}

function updateHighScoreDisplay() {
    highScoreList.innerHTML = ''
    highScores.forEach((score, index) => {
        const entry = document.createElement('div')
        entry.classList.add('high-score-entry')
        const rankContent = index === 0 ? '🏆' : `#${index + 1}`
        entry.innerHTML = `<span class="rank">${rankContent}</span> ${score.playerName}: Level ${score.level - 1}`
        highScoreList.appendChild(entry)
    })
}

function updateHighScore() {
    const playerName = prompt('Congratulations! You achieved a high score. Enter your name:')
    if (playerName) {
        const newScore = { level, playerName }
        highScores.push(newScore)
        highScores.sort((a, b) => b.level - a.level)
        highScores = highScores.slice(0, 6)
        localStorage.setItem('highScores', JSON.stringify(highScores))
        updateHighScoreDisplay()
    }
}

function render() {
    startButton.classList.add('hidden')
    keyboardEl.classList.remove('hidden')
    levelNumber.innerText = level + 1
    resetGameLink.style.pointerEvents = 'auto'
}

// CONTROLLER //
updateHighScoreDisplay()

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

function handleKeyTone(keyInfo) {
    playTone(keyInfo.tone,0.2)
}

function playTone(frequency, duration) {
    if(isSoundOn) {
        const oscillator = audioContext.createOscillator()
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        oscillator.connect(gainNode)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + duration)
    }
}

function toggleSound() {
    isSoundOn = !isSoundOn
}

volumeControl.addEventListener('input', () => {
    const volumeValue = parseFloat(volumeControl.value)
    setVolume(volumeValue)
})

function setVolume(volume) {
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
}

function playKeyPattern() {
    userInteractionEnabled = false
    gamePhase = 'default'
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

function checkWinProgress() {
    const partialPattern = keyPatternArray.slice(0, playerKeyPressArray.length)
    
    for (let i = 0; i < playerKeyPressArray.length; i++) {
        if (playerKeyPressArray[i] !== partialPattern[i]) {
            userInteractionEnabled = false
            gamePhase = 'reset'
            losingMessage()
            playAgain()
            if (level - 1 > getHighestLevel()) {
                updateHighScore()
            }
            return 
        }
    }
    if (playerKeyPressArray.length === keyPatternArray.length) {
        userInteractionEnabled = false
        gamePhase = 'level'
        nextLevel()
        return
    }
}

function getHighestLevel() {
    return highScores.length > 0 ? highScores[0].level : 0
}

function leveler() {
    level++
    playerKeyPressArray = []
    pickRandomKey(keyboard)
    setTimeout(() => {playKeyPattern()}, 500)
    getRandomMessage()
    userInteractionEnabled = false
}

function resetGame() {
    resetScores()
    render()
    setTimeout(leveler, 500)
}

function resetScores() {
    level = 1
    keyPatternArray = []
    updateHighScoreDisplay()
}

function getRandomMessage() {
    const randomMessage = computerMessages[Math.floor(Math.random() * computerMessages.length)]
    handleMessage(randomMessage)
}

function handleResetGameLink(gamePhase) {
    countdownReset()
    handlePopup(null)
    setTimeout(() => {
        switch (gamePhase) {
            case 'level':
                handleLevelButton()
                resetGame()
                break
            case 'reset':
                handleResetButton()
                resetGame()
                break
            default:
                resetGame()
        }
    }, 2000)
}

function resetHighScores() {
    localStorage.removeItem('highScores')
    highScores = []
    updateHighScoreDisplay()
}