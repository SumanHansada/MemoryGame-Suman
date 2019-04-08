/*jshint esversion: 6 */

/*
 * Create a list that holds all of your cards
 */

let cards = [];
let cardNames = [
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-anchor",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-diamond",
  "fa fa-bomb",
  "fa fa-leaf",
  "fa fa-bomb",
  "fa fa-bolt",
  "fa fa-bicycle",
  "fa fa-paper-plane-o",
  "fa fa-cube"
];
let openedCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Getting the nodelist in deckItems variable
var deckOfCards = document.querySelector(".deck");

// Removing the child nodes from deckItems
while (deckOfCards.hasChildNodes()) {
  deckOfCards.removeChild(deckOfCards.firstChild);
}

// Shuffling the cardsNames Array
cardNames = shuffle(cardNames);

// Creating a document fragment
const fragment = document.createDocumentFragment();

for (let i = 0; i < cardNames.length; i++) {
  const listElement = document.createElement("li");
  listElement.setAttribute("class", "card");
  const iElement = document.createElement("i");
  iElement.setAttribute("class", cardNames[i]);
  listElement.appendChild(iElement);
  fragment.appendChild(listElement);
}

// Appending the fragment to the deckOfCards
deckOfCards.appendChild(fragment);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let moves = 0;
let movesText = document.querySelector(".moves");
var starIcons = document.querySelector(".stars");
let rating = 3;
let previousRating = rating;
let currentRating = rating;
let successfulMatches = 0;

deckOfCards.addEventListener("click", openCard);

function openCard(event) {
  let clickedCard = event.target;
  if (clickedCard.className == "card") {
    showCard(clickedCard);
    addToOpenedCards(clickedCard);
    increaseMoves();
    calculateStarRating();
    checkAllMatched(successfulMatches);
  }
}

// function to show the card on click
function showCard(card) {
  setTimeout(() => {
    card.classList.add("open", "show");
  }, 100);
}

// function to hide the cards on wrong match
function hideCard(card) {
  setTimeout(() => {
    card.classList.remove("open", "show", "notmatch");
  }, 1000);
}

// function to add shown cards in the openedCards array
function addToOpenedCards(card) {
  openedCards.push(card);
  if (openedCards.length == 2) {
    matchCards(openedCards[0], openedCards[1]);
  }
}

// function to match the card by class name
function matchCards(firstCard, secondCard) {
  if (firstCard.firstChild.className === secondCard.firstChild.className) {
    cardMatchSuccess(firstCard, secondCard);
  } else {
    cardMatchFailed(firstCard, secondCard);
  }
}

// function to show the matched cards
function cardMatchSuccess(firstCard, secondCard) {
  openedCards = [];
  firstCard.classList.add("match");
  secondCard.classList.add("match");
  successfulMatches++;
}

// function to hide the cards if match failed
function cardMatchFailed(firstCard, secondCard) {
  openedCards = [];
  firstCard.classList.add("notmatch");
  secondCard.classList.add("notmatch");
  hideCard(firstCard);
  hideCard(secondCard);
}

// function to count the moves
function increaseMoves() {
  moves++;
  if (moves === 1) {
    movesText.textContent = moves + " Move";
  } else {
    movesText.textContent = moves + " Moves";
  }
}

// function to calculate the rating.
function calculateStarRating() {
  if (moves === 20) {
    previousRating = rating;
    rating = 3;
    currentRating = rating;
    showStarts(rating);
  } else if (moves > 20 && moves <= 40) {
    previousRating = rating;
    rating = 2;
    currentRating = rating;
    showStarts(rating);
  } else if (moves > 40) {
    previousRating = rating;
    rating = 1;
    currentRating = rating;
    showStarts(rating);
  }
}

// function to show the stars based on realtime moves
function showStarts(rating) {
  if (previousRating !== currentRating) {
    while (starIcons.hasChildNodes()) {
      starIcons.removeChild(starIcons.firstChild);
    }
    const starFragment = document.createDocumentFragment();

    const star = document.createElement("li");
    const icon = document.createElement("i");
    icon.setAttribute("class", "fa fa-star");
    icon.setAttribute("style", "color: rgb(255, 215, 0)");
    star.appendChild(icon);

    for (let i = 1; i <= rating; i++) {
      starFragment.appendChild(star.cloneNode(true));
    }

    starIcons.appendChild(starFragment);
  }
}

// function to check whether all matches have been done or not
function checkAllMatched(successfulMatches) {
  if (successfulMatches === 8) {
    console.log("Game has been completed");
    stopTimer();
    openModal();
    if (hours > 0)
      document.getElementById("modal-hours").innerText = hours + " hours";
    if (minutes > 0)
      document.getElementById("modal-minutes").innerText = minutes + " minutes";
    if (seconds > 0)
      document.getElementById("modal-seconds").innerText = seconds + " seconds";
    
    document.getElementById("modal-rating").innerText = rating;

    const starFragment = document.createDocumentFragment();
    const star = document.createElement("li");
    const icon = document.createElement("i");
    icon.setAttribute("class", "fa fa-star");
    icon.setAttribute("style", "color: rgb(255, 215, 0)");
    
    star.appendChild(icon);

    for (let i = 1; i <= rating; i++) {
      starFragment.appendChild(star.cloneNode(true));
    }
    document.querySelector(".modal-stars").appendChild(starFragment);
  }
}

let modal = document.getElementById("gameComplted");

// function to open the gameCompleted modal
function openModal() {
  modal.style.display = "block";
}

// function to close the gameCompleted modal
function closeModal() {
  modal.style.display = "none";
}

var hours = 0;
var minutes = 0;
var seconds = 0;

var gameStarted = false;

// function to start the countdown timer
function startTimer() {
  setInterval(function() {
    if (gameStarted === true) {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      if (minutes === 60) {
        hours++;
        minutes = 0;
        seconds = 0;
      }
      if (hours < 10) document.getElementById("hours").innerText = "0" + hours;
      else document.getElementById("hours").innerText = hours;
      if (minutes < 10)
        document.getElementById("minutes").innerText = "0" + minutes;
      else document.getElementById("minutes").innerText = minutes;
      if (seconds < 10)
        document.getElementById("seconds").innerText = "0" + seconds;
      else document.getElementById("seconds").innerText = seconds;
    }
  }, 1000);
}

// function to stop the countdown timer
function stopTimer() {
  gameStarted = false;
}

// function to call on DOM loading
window.onload = function() {
  gameStarted = true;
  startTimer();
};


// small codes to add event listener to restart button, replay button and close button 
document.querySelector(".restart").addEventListener("click", function() {
  window.location.reload();
});

document.querySelector(".modal-button").addEventListener("click", function() {
  window.location.reload();
});

document.querySelector(".modal-close").addEventListener("click", function() {
  modal.style.display = "none";
});
