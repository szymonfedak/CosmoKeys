var scoreButton;
var currentPos = 0;
var scoreCounter = 0;
var attempts = 0;
var userInputBox = document.getElementById("userInput");
var scoreBoardDivQuary = document.querySelector("#scoreBoardDiv");
var fallingDivs = document.querySelectorAll(".fallingDown");
var startButton = document.getElementById("startButton");
var tryAgain = document.createElement("button");
var gameOver = document.createElement("div");
var gameDiv = document.querySelector(".game");
var spawn; 
var stopCounter;

// GETTING A RANDOM NUMBER
function random(min, max){
    return Math.round(Math.random()*(max-min) + min);
}

// CREATING BOXES WITH WORDS IN THEM FOR THE USER TO SEE
function createNewBox(){
    var gameWidth = gameDiv.clientWidth;
    var length = random(0, gameWidth - 125);
    var velocity = random(5000,10000);

    // GETTING A RANDOM WORD FROM THE DICT ARRAY
    var randomWord = Math.round(Math.random()*dict.length);
    var word = dict[randomWord];

    // CREATING THE DIV TO HOLD THE WORD AND ITS STYLE
    var newDivs = document.createElement("div");
    newDivs.style.position = "absolute";
    newDivs.style.height = "20px";
    newDivs.style.padding = "5px"
    newDivs.style.left = length + "px";
    newDivs.style.textAlign = "center";
    newDivs.style.color = "white";
    
    //ADDS A SPAN IN BETWEEN EACH LETTER WHEN CREATING A NEW DIV
    for (var i = 0; i < word.length; i++) {
        var letterSpan = document.createElement("span");
        letterSpan.textContent = word[i];
        newDivs.appendChild(letterSpan);
    }

    // ADDING THE ANIMATION OF THE BOXES FALLING
    newDivs.classList.add("fallingDown");
    newDivs.style.animationDuration = velocity / 1500 + "s"; // CHANGES THE VELOCITY
    document.querySelector(".game").appendChild(newDivs);

    // LISTENS FOR WHEN A WORD FULLY FINISHES ITS ANIMATION ( HITS THE BOTTOM )
    newDivs.addEventListener("animationend", function() {
        var divsToRemove = document.querySelectorAll(".fallingDown");
        divsToRemove.forEach(function (div){ //REMOVES ALL THE REMAINING DIVS 
            div.remove();
        });
        clearInterval(spawn); 

        // CREATES A GAME OVER DIV THAT DISPLAYS THE SCORE
        gameOver.innerHTML = "GAME OVER" + "<br><span style='font-size: 15px;'>YOUR SCORE WAS " + scoreCounter + "</span>";
        gameOver.classList.add("gameOverBox");
        document.querySelector(".game").appendChild(gameOver);
        // CHANGES THE POSITION AND VALUES OF THE TRY AGAIN BUTTON ONCE THE ANIMATION ENDS
        tryAgain.classList.remove("changed");


        // CREATES A BUTTON THAT RESETS THE GAME IF PRESSED
        tryAgain.classList.add("tryAgain");
        tryAgain.innerHTML = "TRY AGAIN";
        document.querySelector(".game").appendChild(tryAgain);
        tryAgain.addEventListener("click", function(){
            gameStart();
            scoreBoardDivQuary.style.display = "none";
        });

        // CALLING ONTO THE createScoreButton FUNCTION 
        createScoreButton();

        // CREATES THE SCOREBOARD ONCE THE BUTTON IS CLICKED
        scoreButton.addEventListener("click", function() {
            scoreBoardDivQuary.style.display = "block";
            
            // CHANGES THE POSITION AND VALUES OF THE TRY AGAIN BUTTON IF SCOREBOARD HAS BEEN PRESSED
            tryAgain.classList.toggle("changed");
            
            var gameOverDiv = document.querySelector(".gameOverBox");
            if(gameOverDiv){
                gameOverDiv.remove();
                scoreButton.remove();
            }
        });

        // REMOVES THE USER INPUT BOX WHEN THE GAME ENDS
        userInput.style.display = "none";

        // ADDS THE SCORE AND ATTEMPT ONTO THE SCOREBOARD
        addScore(attempts, scoreCounter);
    });
    
}

// CALL TO START SPAWNING BOXES
function gameStart() {
    // CLEARS ANY EXISTING INTERVALS
    clearInterval(stopCounter);
    clearInterval(spawn);

    // SETS THE INPUT TO READ ONLY
    userInputBox.readOnly = true;
    
    // MAKES THE USER INPUT BOX REAPPEAR WHEN THE GAME STARTS 
    userInput.style.display = "block";
    userInput.focus();

    // REMOVES THE COUNTDOWNDIV IF IT EXISTS
    var countDownDiv = document.querySelector(".countDown");
    if (countDownDiv) {
        countDownDiv.remove();
    }

    // RESETS THE SCORECOUNTER VARIABLE
    scoreCounter = 0;

    // RESETS THE SCORECOUNTER BOX
    counterBox.innerHTML = scoreCounter;

    // CLEARS THE INPUT BOX
    userInput.value = "";

    // REMOVES THE SCOREBOARD BUTTON IF IT EXISTS
    var scoreBoardButton = document.querySelector("#scoreButton");
    if(scoreBoardButton){
        scoreBoardButton.remove();
    }

    // REMOVES THE TRYAGAIN BUTTON IF IT EXISTS
    var tryAgainButton = document.querySelector(".tryAgain");
    if (tryAgainButton) {
        tryAgainButton.remove();
    }

    // REMOVES THE GAMEOVERDIV IF IT EXISTS
    if (gameOver.parentNode) {
        gameOver.parentNode.removeChild(gameOver);
    }

    // REMOVES THE START BUTTON ONCE THE GAME BEGINS
    startButton.remove();

    // CREATES A COUNTER ( FROM 3 TO 1 ) WHEN REACHING 1 IT STARTS TO SPAWN BOXES
    var counter = 3;
    countDownDiv = document.createElement("div");
    countDownDiv.classList.add("countDown");
    document.querySelector(".game").appendChild(countDownDiv);

    stopCounter = setInterval(function () {
        countDownDiv.innerHTML = counter;
        counter--;

        if (counter === -1) {
            attempts++;
            userInputBox.readOnly = false; // LET THE INPUT BE EDITED
            clearInterval(stopCounter);
            countDownDiv.remove();
            spawn = setInterval(createNewBox, 2000);
        }
    }, 1000);
}

// STARTS THE GAME WHEN THE BUTTON IS CLICKED
startButton.addEventListener("click",gameStart);

// REMOVES THE WORD BOX ONCE ITS BEEN CORRECTLY TYPED OUT 
var userInput = document.getElementById("userInput");
var counterBox = document.getElementById("score");
userInput.addEventListener("input", function(){
    var inputValue = userInput.value;
    var fallingDivs = document.querySelectorAll(".fallingDown");

    fallingDivs.forEach(function (div) {
        var word = div.textContent.trim(); // REMOVES WHITE SPACES

        // CHECKS IF THE WORD IS TYPED CORRECTLY AND UPDATES THE VALUE OF THE SCORE COUNTER ACCORDINGLY 
        if (word === inputValue) {
            div.remove();
            userInput.value = "";
            scoreCounter++;
            counterBox.innerHTML = scoreCounter;
        } 
        
    });
});

// CHANGES THE COLOR OF THE WORD AS THE USER TYPES
userInput.addEventListener("input", function(){
    var inputValue = userInput.value;
    var fallingDivs = document.querySelectorAll(".fallingDown");
    
    fallingDivs.forEach(function (div) {
        var word = div.textContent.trim(); // REMOVES WHITE SPACES
        var letters = div.querySelectorAll("span"); 

        for (var i = 0; i < word.length; i++) { // LOOPS THROUGH THE WORDS AND GETS EACH LETTER
            var character = word.charAt(i);
            var inputChar = inputValue.charAt(i);

            if (inputValue.length <= i) { // CHECKS IF THE LETTER IS YET TO BE TYPED CHANGING IT TO EITHER WHITE, GREEN OR RED
                letters[i].style.color = "white"; 
            } else if (character === inputChar) {
                letters[i].style.color = "green"; 
            } else {
                letters[i].style.color = "red"; 
            }
        }
    });
});

// CREATES A SCOREBOARD BUTTON
function createScoreButton() {
    scoreButton = document.createElement("button");
    scoreButton.setAttribute("id","scoreButton");
    scoreButton.innerHTML = "SCOREBOARD";
    document.querySelector(".game").appendChild(scoreButton);
}

// ADDS THE SCORE TO THE LOCAL STORAGE AND APPENDS THE DIVS ONTO THE SCOREBOARD
function addScore(attempts, score) {
    localStorage.setItem(attempts, score);
    var scoreDiv = document.createElement("div");
    scoreDiv.setAttribute("id", "scoreListing");
    scoreDiv.textContent = "SCORE:  " + score + "       " + "ATTEMPT:" + attempts;

    // COLLECTS ALL DIVS INTO AN ARRAY
    var scoreDivs = Array.from(document.querySelectorAll("#scoreBoardDiv > div"));

    // ADDS THE NEW SCORE INTO THE ARRAY
    scoreDivs.push(scoreDiv);

    // SORTS THE ARRAY BASED ON THE SCORE ( HIGHEST TO LOWEST )
    scoreDivs.sort(function (a, b) {
        return parseInt(b.textContent.match(/\d+/)[0]) - parseInt(a.textContent.match(/\d+/)[0]);
    });

    scoreBoardDivQuary.innerHTML = "";

    // ADDING BACK THE DIVS INTO THE SCOREBOARD
    scoreDivs.forEach(function (div) {
        scoreBoardDivQuary.appendChild(div);
    });
}