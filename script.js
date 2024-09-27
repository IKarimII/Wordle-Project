import { WORDS } from "./words.js";
import { WTG } from "./wordsToGuess.js"


const guessNum = 6;
let  guessRemaining = guessNum;
let nextLetterIndex = 0;
let userGuess = [];
let toGuess = WTG[Math.floor(Math.random() * WTG.length)];

function BuildBoard() {
    const mainBoard = document.querySelector("#mainBoard");

    for (let i = 0; i<guessNum; i++) {
        let row = document.createElement("div");
        row.className = 'row';


        for (let j=0; j<5; j++) {
            let box = document.createElement("div");
            box.className ='box';
            row.appendChild(box)
        }
        mainBoard.appendChild(row)
    }
}

BuildBoard();
document.addEventListener('keyup', (e) => {
    
    if (guessRemaining <= 0) {
        return
    }

    let pressedKey = String(e.key);
    if (pressedKey == "Enter" ) {
        checkGuess();
        return
    }

    let letters = pressedKey.match(/[a-z]/gi);
    if (!letters || pressedKey.length > 1) return
    else {
        insertLetter(pressedKey);
    }

})
document.addEventListener('keydown', (e) => {
    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetterIndex !== 0) {
        deleteKey();
        return
    }
})
function insertLetter(letter) {
    if (nextLetterIndex === 5) {
        return
    }
    letter = letter.toLowerCase();

    let curr_row = document.querySelectorAll(".row")[guessNum - guessRemaining];
    let curr_box = curr_row.children[nextLetterIndex];
    animateCSS(curr_box, "pulse")
    curr_box.textContent = letter;
    curr_box.classList.add("filled-box");
    userGuess.push(letter);
    nextLetterIndex += 1
}

function deleteKey() {
    let curr_row = document.querySelectorAll(".row")[guessNum - guessRemaining];
    let curr_box = curr_row.children[nextLetterIndex - 1];
    curr_box.textContent = '';
    curr_box.classList.remove("filled-box");

    userGuess.pop()
    nextLetterIndex -= 1;
}

function checkGuess () {
    let row = document.getElementsByClassName("row")[6 - guessRemaining];
    let guessString = userGuess.join('');
    let rightGuess = Array.from(toGuess); // Convert the correct word into an array to modify it later

    if (userGuess.length != 5) {
        toastr.error("Not enough letters!");
        return;
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Not in Word List!");
        return;
    }

    let colorMap = [];

    for (let i = 0; i < 5; i++) {
        let letter = userGuess[i];

        if (letter === rightGuess[i]) {
            
            colorMap[i] = 'rgb(106, 170, 100)';
            rightGuess[i] = "#"; 
        }
    }

    for (let i = 0; i < 5; i++) {
        let letter = userGuess[i];

        if (colorMap[i]=== 'rgb(106, 170, 100)')continue

        let letterPosition = rightGuess.indexOf(letter);
        if (letterPosition !== -1) {            
            colorMap[i] = 'rgb(201, 180, 88)';
            rightGuess[letterPosition] = "#"; 
        } else {
            colorMap[i] = 'rgb(120, 124, 126)';
            shadeKeyBoard(letter, 'rgb(120, 124, 126)');
        }
    }
    for (let i = 0; i < 5; i++) {
        let box = row.children[i];
        let letter = userGuess[i];
        let letterColor = colorMap[i];
        let delay = 500 * i; 

        setTimeout(() => {
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = letterColor;
            box.classList.add('white-letter')
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }

    // Check if the guess was correct
    if (guessString === toGuess) {
        guessRemaining = 0;
    } else {
        guessRemaining -= 1;
        userGuess = [];
        nextLetterIndex = 0;

        if (guessRemaining === 0) {
            toastr.info("You've run out of guesses! Game over!");
            toastr.info(`The right word was: "${toGuess}"`);
        }
    }
    
    if (guessString === toGuess) {
        setTimeout(() => toastr.success("You guessed right! Game over!", '', {"positionClass": "toast-top-center"}), 2500)
        return;
    }
}

function shadeKeyBoard(letter, color) {
    for (let element of document.body.querySelectorAll('.keyboard-button')) {
        if( element.textContent == letter) {
        if (element.style.backgroundColor == 'rgb(106, 170, 100)' || (element.style.backgroundColor == 'rgb(201, 180, 88)' && color != "rgb(106, 170, 100)")) return
            element.style.backgroundColor = color
        }
    }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
        document.dispatchEvent(new KeyboardEvent("keydown", {'key': key}))
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      // const node = document.querySelector(element);
      const node = element
      if (animation == 'pulse') node.style.setProperty('--animate-duration', '0.1s');
      if (animation == 'flipInX') node.style.setProperty('--animate-duration', '0.5s');
  
      node.classList.add(`${prefix}animated`, animationName);
  
      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }
  
      node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });