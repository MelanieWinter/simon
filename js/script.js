
// start game button
// message text div

// make :active css for each div. make it work when it is accessed through keypress
// function to push key pressed into an array
// function to check if patter array and keypress array are the same
// function will add onto the array after every players (winning) turn with another random key
// make a losing screen if key was pressed incorrectly or not fast enough
// make play again button
// function to reset all state to default
// make a winning condition after a certain amount of turns
// winning screen

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
        const key = keyEl.id;
        playerKeyPressArray.push(key)
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        handleKeyColor(key)
        console.log(`Clicked key: ${key}`)
    })
})

document.addEventListener('keydown', handleKeyPress);

/*----- functions -----*/
function handleKeyPress(event) {
    const key = event.key;
    if (keyboard.hasOwnProperty(key)) {
        playerKeyPressArray.push(key)
        const keyInfo = keyboard[key]
        keyInfo.active = true
        handleKeyColor(keyInfo)
        console.log(`Pressed key: ${key}`)
    }
}

function handleKeyColor(keyInfo) {
    if (keyInfo.active === true) {
        const keyEl = document.getElementById(keyInfo.label.toLowerCase())
        keyEl.style.backgroundColor = keyInfo.color
        keyEl.classList.add('active')
        setTimeout(() => {
            keyInfo.active = false
            keyEl.style.backgroundColor = ''
            keyEl.classList.remove('active')
        }, 200)

    }
}

function pickRandomKey() {
    const keys = Object.keys(keyboard);
    const randomIndex = Math.floor(Math.random() * keys.length)
    const randomKey = keys[randomIndex]
    keyPatternArray.push(randomKey)
    return randomKey
}

const randomKey = pickRandomKey(keyboard)
console.log(`Random key: ${randomKey}`)
console.log(keyPatternArray)

function checkWin() {
    if (playerKeyPressArray.length !== keyPatternArray.length) {
        console.log('YOU LOSE!')
        return
    }

    for (let i = 0; i < playerKeyPressArray.length; i++) {
        if (playerKeyPressArray[i] !== keyPatternArray[i]) {
            console.log('YOU LOSE!')
            return
        }
    }
    console.log('YOU WIN')
}




