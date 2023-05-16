// Read ./assets/json/wordlist.json and append it into words array
var request = new XMLHttpRequest();
request.open("GET", "./assets/json/wordlist.json", false);
request.send(null);
var words = JSON.parse(request.responseText);

console.log(words);

var currentWordIndex = 0;
var attempts = 0;
var guessedLetters = [];
var wins = 0;
var losses = 0;

function onStart() {
  updateDisplay();
  document.addEventListener("keyup", onGuess);
}
function onGuess(character) {
  var keyPressed = character.replace(/i/g, "İ").toUpperCase();
  if (isLetterOnly(keyPressed)) {
    if (guessedLetters.indexOf(keyPressed) === -1) {
      guessedLetters.push(keyPressed);
      if (currentWordLetters().indexOf(keyPressed) === -1) {
        attempts++;
      }
      updateDisplay();
      if (isRoundLost()) {
        losses++;
        goToNextWord();
        return;
      } else if (isRoundWon()) {
        wins++;
        goToNextWord();
        return;
      }
    }
  }
}
function onKeyPress(event) {
  var character = String(event.key);
  onGuess(character);
}

document.addEventListener("keypress", onKeyPress);

function getGameboardWord() {
  return currentWordLetters().map(function (letter) {
    if (guessedLetters.indexOf(letter) === -1) {
      return "&nbsp";
    } else {
      return letter;
    }
  });
}

function goToNextWord() {
  currentWordIndex = Math.floor(Math.random() * words.length);
  attempts = 0;
  guessedLetters = [];
  updateDisplay();
  setTimeout(enableAllLetters, 200);
}

function isRoundLost() {
  if (getGuessesAllowed() - attempts === 0) {
    alert("KAYBETTİNİZ! Doğru kelime: " + words[currentWordIndex]);
    return true;
  }
  return false;
}
function isRoundWon() {
  var gameboardWord = getGameboardWord();
  if (gameboardWord.indexOf("&nbsp") === -1) {
    var audio = new Audio("assets/sounds/correct.mp3");
    audio.play();
    return true;
  }
  return false;
}

function isLetterOnly(character) {
  if (character.length !== 1) {
    return false;
  }
  var checker = /^[A-ZĞÜŞİÖÇ]+$/i.test(character);
  console.log(checker, character);
  return checker;
}

function updateDisplay() {
  document.getElementById("guessed").innerHTML = guessedLetters.reduce(
    function (list, letter) {
      return list + letter + " ";
    },
    ""
  );
  showGameBoard();
  document.getElementById("wins").innerHTML = wins;
  document.getElementById("losses").innerHTML = losses;
  document.getElementById("guesses_remaining").innerHTML =
    getGuessesAllowed() - attempts;
}

function showGameBoard() {
  var container = document.getElementById("game_board_container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  getGameboardWord().forEach(function (letter) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class", "game_board_letter");
    newDiv.innerHTML = letter;
    if (letter !== "&nbsp") {
      newDiv.setAttribute("class", "no_border");
    }
    container.appendChild(newDiv);
  });
}

function currentWordLetters() {
  console.info(words[currentWordIndex]);
  return words[currentWordIndex].split("");
}

function getGuessesAllowed() {
  return 6;
}

onStart();

function onLetterClick(letter) {
  console.log(letter);
  onGuess(letter);
  disableLetter(letter);
}

function disableLetter(letter) {
  var letterElement = document.querySelector(
    '.letter[data-letter="' + letter + '"]'
  );
  letterElement.classList.add("disabled");
}

function enableAllLetters() {
  var letterElements = document.querySelectorAll(".letter");
  for (var i = 0; i < letterElements.length; i++) {
    var letterElement = letterElements[i];
    letterElement.classList.remove("disabled");
  }
}
