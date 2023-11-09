
// start game button
// message text div
// make a losing screen if key was pressed incorrectly or not fast enough
// make play again button
// function to reset all state to default
// add sounds

/*----- constants -----*/
const keyboard = {
    q: { label: 'Q', color: 'darksalmon', active: false},
    w: { label: 'W', color: 'bisque', active: false },
    e: { label: 'E', color: 'skyblue', active: false }, 
    r: { label: 'R', color: 'violet', active: false },
    t: { label: 'T', color: 'hotpink', active: false },
    y: { label: 'Y', color: 'darkorange', active: false },
    u: { label: 'U', color: 'gold', active: false },
    i: { label: 'I', color: 'turquoise', active: false },
    o: { label: 'O', color: 'cornflowerblue', active: false },
    p: { label: 'P', color: 'palevioletred', active: false },
    a: { label: 'A', color: 'limegreen', active: false },
    s: { label: 'S', color: 'deepskyblue', active: false },
    d: { label: 'D', color: 'dodgerblue', active: false },
    f: { label: 'F', color: 'deeppink', active: false },
    g: { label: 'G', color: 'red', active: false },
    h: { label: 'H', color: 'seagreen', active: false },
    j: { label: 'J', color: 'blue', active: false },
    k: { label: 'K', color: 'darkviolet', active: false },
    l: { label: 'L', color: 'crimson', active: false },
    z: { label: 'Z', color: 'purple', active: false },
    x: { label: 'X', color: 'navy', active: false },
    c: { label: 'C', color: 'green', active: false },
    v: { label: 'V', color: 'chocolate', active: false },
    b: { label: 'B', color: 'steelblue', active: false },
    n: { label: 'N', color: 'tomato', active: false },
    m: { label: 'M', color: 'rebeccapurple', active: false },
}

/*----- state variables -----*/
let level = 0
let keyPatternArray = []
let playerKeyPressArray = []

/*----- cached elements  -----*/
const keyEls = document.querySelectorAll('.key')

/*----- event listeners -----*/
keyEls.forEach((keyEl) => {
    keyEl.addEventListener('click', () => {
        const key = keyEl.id
        playerKeyPressArray.push(key)
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        setTimeout(() => {
            checkWinProgress()   
            keyInfo.active = false    
        }, 200)
        console.log(`Clicked key: ${key}`)
    })
})

document.addEventListener('keydown', handleKeyPress)

/*----- functions -----*/
function handleKeyPress(event) {
    const key = event.key
    if (keyboard.hasOwnProperty(key)) {
        playerKeyPressArray.push(key)
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        setTimeout(() => {
            // handleKeyColor(keyInfo)
            checkWinProgress()
            keyInfo.active = false
        }, 200)
        console.log(`Pressed key: ${key}`)
    }
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
            console.log('YOU LOSE!')
            // make loser function to change dom to red/locked keys and display loser message and play again
            // make a high score message that shows your highest level you reached
            return
        }
    }

    if (playerKeyPressArray.length === keyPatternArray.length) {
        console.log('YOU WIN!')
        setTimeout(() => {
            leveler()
        }, 1000)
    }
}

function leveler() {
    level++
    playerKeyPressArray = []
    pickRandomKey(keyboard)
    playKeyPattern()
}

function playKeyPattern() {
    //lock keys until sequence is done
    let i = 0
    function playNextKey() {
        const key = keyPatternArray[i]
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        setTimeout(() => {
            keyInfo.active = false
            handleKeyColor(keyInfo)
            i++
            if (i < keyPatternArray.length) {
                setTimeout(playNextKey, 350)
            } else {
                // playerTurn()
            }
        }, 350)
    }
    playNextKey()
}

function playerTurn() {
    // unlock keys
    // display message
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext()

function playTone(frequency, duration) {
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)
}

// Play a 440 Hz tone for 1 second
// playTone(70, .3)
// 70-320 in increments of 10


leveler()