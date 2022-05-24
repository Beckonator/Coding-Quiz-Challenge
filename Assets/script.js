//Section list
const quiz_sections = document.querySelectorAll(".quiz-section");

//Start section
const start_section = document.getElementById("start");
const start_btn = document.getElementById("start-button");

//Quiz questions
const quiz_section = document.getElementById("quiz-questions");
const time_remaining = document.getElementById("time-remaining");
const question = document.getElementById("question");
const choices = document.getElementById("choices");
const choice_statuses = document.querySelectorAll(".choice-status");
const correct = document.getElementById("correct");
const wrong = document.getElementById("wrong");

//End section
const end_section = document.getElementById("end");
const end_title = document.getElementById("end-title");
const score = document.getElementById("score");
const initials_input = document.getElementById("initials");
const submit_score = document.getElementById("submit-score");
const error_message = document.getElementById("error-message");

//Questions
class Question {
  constructor(question, choices, indexOfCorrectChoice) {
    this.question = question;
    this.choices = choices;
    this.indexOfCorrectChoice = indexOfCorrectChoice;
  }
}
const question_1 = new Question(
  "Commonly used data types DO NOT include: ",
  ["Strings", "Booleans", "Alerts", "Numbers"],
  2
);
const question_2 = new Question(
  "The condition in an if / else statement is enclosed within ____.",
  ["Quotes", "Curly brackets", "Parentheses", "Square brackets"],
  2
);
const question_3 = new Question(
  "Arrays in JavaScript can be used to store ____.",
  ["Numbers and Strings", "Other arrays", "Booleans", "All of the above"],
  3
);
const question_4 = new Question(
  "String values must be enclosed within _____ when being assigned to variables.",
  ["Commas", "Curly brackets", "Quotes", "Parentheses"],
  2
);
const question_5 = new Question(
  "A very useful tool used during development and debugging for printing content to the debugger is: ",
  ["JavaScript", "Terminal/Bash", "For Loops", "console.log"],
  3
);
const question_list = [
  question_1,
  question_2,
  question_3,
  question_4,
  question_5,
];

let currentQuestion = 0;

let totalTime = 60;
let totalTimeInterval;
let choiceStatusTimeout;

//Event listeners
start_btn.addEventListener("click", startGame);
choices.addEventListener("click", processChoice);
submit_score.addEventListener("submit", processInput);

//Start game
function startGame() {
  showElement(quiz_sections, quiz_section);

  displayTime();
  displayQuestion();

  startTimer();
}

//Show and hide elements
function showElement(siblingList, showElement) {
  for (element of siblingList) {
    hideElement(element);
  }
  showElement.classList.remove("hidden");
}

function hideElement(element) {
  if (!element.classList.contains("hidden")) {
    element.classList.add("hidden");
  }
}

//Time
function displayTime() {
  time_remaining.textContent = totalTime;
}

function startTimer() {
  totalTimeInterval = setInterval(function () {
    totalTime--;
    displayTime();
    checkTime();
  }, 1000);
}

function checkTime() {
  if (totalTime <= 0) {
    totalTime = 0;
    endGame();
  }
}

//Questions
function displayQuestion() {
  question.textContent = question_list[currentQuestion].question;

  displayChoiceList();
}

function displayChoiceList() {
  choices.innerHTML = "";

  question_list[currentQuestion].choices.forEach(function (answer, index) {
    const li = document.createElement("li");
    li.dataset.index = index;
    const button = document.createElement("button");
    button.textContent = index + 1 + ". " + answer;
    li.appendChild(button);
    choices.appendChild(li);
  });
}

//When user answers a question
function processChoice(event) {
  const userChoice = parseInt(event.target.parentElement.dataset.index);

  resetChoiceStatusEffects();
  checkChoice(userChoice);
  getNextQuestion();
}

//Displaying choice statuses
function resetChoiceStatusEffects() {
  clearTimeout(choiceStatusTimeout);
  styleTimeRemainingDefault();
}

function styleTimeRemainingDefault() {
  time_remaining.style.color = "purple";
}

function styleTimeRemainingWrong() {
  time_remaining.style.color = "red";
}

function checkChoice(userChoice) {
  if (isChoiceCorrect(userChoice)) {
    displayCorrectChoiceEffects();
  } else {
    displayWrongChoiceEffects();
  }
}

function isChoiceCorrect(choice) {
  return choice === question_list[currentQuestion].indexOfCorrectChoice;
}

function displayWrongChoiceEffects() {
  deductTimeBy(10);

  styleTimeRemainingWrong();
  showElement(choice_statuses, wrong);

  choiceStatusTimeout = setTimeout(function () {
    hideElement(wrong);
    styleTimeRemainingDefault();
  }, 1000);
}

function deductTimeBy(seconds) {
  totalTime -= seconds;
  checkTime();
  displayTime();
}

function displayCorrectChoiceEffects() {
  showElement(choice_statuses, correct);

  choiceStatusTimeout = setTimeout(function () {
    hideElement(correct);
  }, 1000);
}

//Get next question
function getNextQuestion() {
  currentQuestion++;
  if (currentQuestion >= question_list.length) {
    endGame();
  } else {
    displayQuestion();
  }
}

//End game
function endGame() {
  clearInterval(totalTimeInterval);

  showElement(quiz_sections, end_section);
  displayScore();
}

function displayScore() {
  score.textContent = totalTime;
}

//Submit initials
function processInput(event) {
  event.preventDefault();

  const initials = initials_input.value.toUpperCase();

  if (isInputValid(initials)) {
    const score = totalTime;
    const highscoreEntry = getNewHighscoreEntry(initials, score);
    saveHighscoreEntry(highscoreEntry);
    window.location.href = "./highscores.html";
  }
}

function getNewHighscoreEntry(initials, score) {
  const entry = {
    initials: initials,
    score: score,
  };
  return entry;
}

function isInputValid(initials) {
  let errorMessage = "";
  if (initials === "") {
    errorMessage = "You can't submit empty initials!";
    displayFormError(errorMessage);
    return false;
  } else if (initials.match(/[^a-z]/gi)) {
    errorMessage = "Initials may only include letters.";
    displayFormError(errorMessage);
    return false;
  } else {
    return true;
  }
}

function displayFormError(errorMessage) {
  error_message.textContent = errorMessage;
  if (!initials_input.classList.contains("error")) {
    initials_input.classList.add("error");
  }
}

function saveHighscoreEntry(highscoreEntry) {
  const currentScores = getScoreList();
  placeEntryInHighscoreList(highscoreEntry, currentScores);
  localStorage.setItem("scoreList", JSON.stringify(currentScores));
}

function getScoreList() {
  const currentScores = localStorage.getItem("scoreList");
  if (currentScores) {
    return JSON.parse(currentScores);
  } else {
    return [];
  }
}

function placeEntryInHighscoreList(newEntry, scoreList) {
  const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
  scoreList.splice(newScoreIndex, 0, newEntry);
}

function getNewScoreIndex(newEntry, scoreList) {
  if (scoreList.length > 0) {
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i].score <= newEntry.score) {
        return i;
      }
    }
  }
  return scoreList.length;
}
